import { CANONICAL_DEPARTMENTS } from "./provisioningConstants.js";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s]{10,15}$/;
import { generatePassword, generateTemporaryPassword } from "./generateTemporaryPassword.js";

/**
 * Normalizes input role string to canonical enum
 */
export function normalizeRole(raw) {
  if (!raw) return "unit_officer";
  const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
  if (cleaned.includes("field") || cleaned === "fo") return "field_officer";
  if (cleaned.includes("unit") || cleaned === "uo") return "unit_officer";
  return null;
}

/**
 * Normalizes department string to canonical department value
 */
export function normalizeDepartment(raw) {
  if (!raw) return null;
  const cleaned = raw.toLowerCase().trim();

  // Keyword-based department matching
  if (cleaned.includes("road") || cleaned.includes("street")) return "road";
  if (cleaned.includes("electric") || cleaned.includes("power") || cleaned.includes("light"))
    return "electricity";
  if (cleaned.includes("water") || cleaned.includes("sewag")) return "water";
  if (cleaned.includes("sanitat") || cleaned.includes("waste_manag")) return "sanitation";
  if (cleaned.includes("drain") || cleaned.includes("storm")) return "drainage";
  if (cleaned.includes("solid") || cleaned.includes("garbage")) return "solid_waste";
  if (cleaned.includes("health") || cleaned.includes("hygien")) return "public_health";
  if (cleaned.includes("other") || cleaned.includes("misc")) return "other";

  const directMatch = CANONICAL_DEPARTMENTS.find((d) => d.value === cleaned);
  return directMatch ? directMatch.value : null;
}

/**
 * Validates parsed Officer CSV rows against CityCare business rules and existing Convex user database
 */
export function validateOfficerRows(rows, referenceData = {}) {
  const existingUODepartments = referenceData.existingUODepartments || [];
  const existingEmails = new Set(
    (
      referenceData.existingUserEmails ||
      referenceData.existingEmails ||
      []
    ).map((e) => e.toLowerCase().trim())
  );

  const seenEmailsInCSV = new Set();
  const seenUOCityDeptInCSV = new Set();

  const validRows = [];
  const invalidRows = [];
  const warningRows = [];

  rows.forEach(({ rowNumber, data }) => {
    const errors = [];
    const warnings = [];

    const fullName = (data.fullName || "").trim();
    const email = (data.email || "").toLowerCase().trim();
    const phone = (data.phone || "").trim();
    const dob = (data.dob || "").trim();
    const state = (data.state || "Uttar Pradesh").trim();
    const city = (data.city || "Varanasi").trim();
    const district = (data.district || city).trim();
    const rawDept = (data.department || "").trim();
    const rawSpecialisation = (data.specialisation || "").trim();
    const specialisation = rawSpecialisation
      .split(/[;,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .join(", ");

    let rawRole = (data.role || "").trim();
    if (!rawRole) {
      // Infer role if omitted in Google Form CSV export
      const isFieldOfficerSkills =
        rawSpecialisation.includes(";") ||
        /repair|laying|inspection|maintenance|cleaning|prevention|management|operations|testing|control|disinfection|segregation|handling/i.test(
          rawSpecialisation
        );
      rawRole = isFieldOfficerSkills ? "field_officer" : "unit_officer";
    }

    // 1. Full Name check
    if (!fullName) {
      errors.push("Full Name is required");
    }

    // 2. Email format & duplicate checks against CSV and Convex users table
    if (!email) {
      errors.push("Email address is required");
    } else if (!EMAIL_REGEX.test(email)) {
      errors.push("Invalid email format");
    } else {
      if (seenEmailsInCSV.has(email)) {
        errors.push("Duplicate email in uploaded CSV");
      } else {
        seenEmailsInCSV.add(email);
      }

      if (existingEmails.has(email)) {
        errors.push("Email already exists in Convex user database");
      }
    }

    // 3. Phone validation
    if (!phone) {
      warnings.push("Phone number is recommended");
    } else if (!PHONE_REGEX.test(phone)) {
      warnings.push("Phone number format should be 10 digits");
    }

    // 4. DOB check
    if (!dob) {
      warnings.push("Date of birth is missing; default temporary password will be assigned");
    }

    // 5. City & State check
    if (!city) errors.push("City is required");
    if (!state) errors.push("State is required");

    // 6. Role validation (defaults to unit_officer if omitted)
    const normalizedRole = normalizeRole(rawRole);
    if (!normalizedRole || (normalizedRole !== "unit_officer" && normalizedRole !== "field_officer")) {
      errors.push(`Invalid role "${rawRole}". Must be Unit Officer or Field Officer`);
    }

    // 7. Department validation
    const normalizedDept = normalizeDepartment(rawDept);
    if (!rawDept) {
      errors.push("Department is required");
    } else if (!normalizedDept) {
      errors.push(`Unrecognized department "${rawDept}"`);
    }

    // 8. Unit Officer Uniqueness check (1 active UO per City + Department)
    if (normalizedRole === "unit_officer" && city && normalizedDept) {
      const cityDeptKey = `${city.toLowerCase().trim()}_${normalizedDept}`;

      if (seenUOCityDeptInCSV.has(cityDeptKey)) {
        errors.push(
          `Multiple Unit Officers assigned to ${normalizedDept} in ${city} within this upload`
        );
      } else {
        seenUOCityDeptInCSV.add(cityDeptKey);
      }

      const existingUO = existingUODepartments.find(
        (uo) => uo.city === city.toLowerCase().trim() && uo.department === normalizedDept
      );
      if (existingUO) {
        errors.push(
          `A Unit Officer (${existingUO.fullName}) is already assigned to ${normalizedDept} in ${city}`
        );
      }
    }

    const rowPayload = {
      clientRowId: `row-${rowNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      rowNumber,
      fullName,
      email,
      phone: phone || "9876543210",
      dob,
      state,
      city,
      district,
      department: normalizedDept || rawDept,
      role: normalizedRole || rawRole,
      specialisation,
      tempPassword: generatePassword(fullName, dob),
      validationStatus: errors.length > 0 ? "invalid" : warnings.length > 0 ? "warning" : "valid",
      errors,
      warnings,
    };

    if (errors.length > 0) {
      invalidRows.push(rowPayload);
    } else if (warnings.length > 0) {
      warningRows.push(rowPayload);
      validRows.push(rowPayload);
    } else {
      validRows.push(rowPayload);
    }
  });

  return {
    validRows,
    invalidRows,
    warningRows,
    stats: {
      total: rows.length,
      valid: validRows.length,
      invalid: invalidRows.length,
      warnings: warningRows.length,
    },
  };
}

/**
 * Validates parsed City Admin CSV rows against CityCare business rules and existing Convex user database
 */
export function validateCityAdminRows(rows, referenceData = {}) {
  const existingCityAdmins = referenceData.existingCityAdmins || [];
  const existingEmails = new Set(
    (
      referenceData.existingUserEmails ||
      referenceData.existingEmails ||
      []
    ).map((e) => e.toLowerCase().trim())
  );

  const seenEmailsInCSV = new Set();
  const validRows = [];
  const invalidRows = [];
  const warningRows = [];

  rows.forEach(({ rowNumber, data }) => {
    const errors = [];
    const warnings = [];

    const fullName = (data.fullName || "").trim();
    const email = (data.email || "").toLowerCase().trim();
    const phone = (data.phone || "").trim();
    const dob = (data.dob || "").trim();
    const state = (data.state || "Uttar Pradesh").trim();
    const city = (data.city || "Varanasi").trim();

    if (!fullName) errors.push("Full Name is required");

    if (!email) {
      errors.push("Email address is required");
    } else if (!EMAIL_REGEX.test(email)) {
      errors.push("Invalid email format");
    } else {
      if (seenEmailsInCSV.has(email)) {
        errors.push("Duplicate email in uploaded CSV");
      } else {
        seenEmailsInCSV.add(email);
      }

      if (existingEmails.has(email)) {
        errors.push("Email already exists in Convex user database");
      }
    }

    if (!dob) {
      warnings.push("Date of birth is missing; default temporary password will be assigned");
    }

    if (!city) errors.push("City is required");
    if (!state) errors.push("State is required");

    const rowPayload = {
      clientRowId: `ca-row-${rowNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      rowNumber,
      fullName,
      email,
      phone: phone || "9876543220",
      dob,
      state,
      city,
      tempPassword: generatePassword(fullName, dob),
      validationStatus: errors.length > 0 ? "invalid" : warnings.length > 0 ? "warning" : "valid",
      errors,
      warnings,
    };

    if (errors.length > 0) {
      invalidRows.push(rowPayload);
    } else if (warnings.length > 0) {
      warningRows.push(rowPayload);
      validRows.push(rowPayload);
    } else {
      validRows.push(rowPayload);
    }
  });

  return {
    validRows,
    invalidRows,
    warningRows,
    stats: {
      total: rows.length,
      valid: validRows.length,
      invalid: invalidRows.length,
      warnings: warningRows.length,
    },
  };
}
