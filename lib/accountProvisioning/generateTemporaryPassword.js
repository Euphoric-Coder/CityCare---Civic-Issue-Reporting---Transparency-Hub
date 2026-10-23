/**
 * Generates temporary password using Initials@FirstNameDDMMYYYY based on Full Name and DOB.
 * Example: Kevin Jason Dcosta with DOB 02/06/2004 -> KJD@Kevin02062004
 */
export const generatePassword = (fullName = "", dob = "") => {
  if (!fullName || !dob) return "DefaultPass@123";

  // Split name
  const names = fullName.trim().split(" ").filter(Boolean);

  if (names.length === 0) return "DefaultPass@123";

  // Get initials
  const initials = names.map((n) => n[0].toUpperCase()).join("");

  // First name (capitalized properly)
  const firstName =
    names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();

  // Extract numbers from DOB
  const digits = dob.replace(/\D/g, "");

  let formattedDOB = "";

  // Check if formatted with separators like YYYY-MM-DD or DD/MM/YYYY
  const sepParts = dob.includes("-")
    ? dob.split("-")
    : dob.includes("/")
    ? dob.split("/")
    : null;

  if (sepParts && sepParts.length === 3) {
    if (sepParts[0].length === 4) {
      // YYYY-MM-DD or YYYY/MM/DD -> convert to DDMMYYYY
      const year = sepParts[0];
      const month = sepParts[1].padStart(2, "0");
      const day = sepParts[2].padStart(2, "0");
      formattedDOB = `${day}${month}${year}`;
    } else if (sepParts[2].length === 4) {
      // DD-MM-YYYY or DD/MM/YYYY
      const day = sepParts[0].padStart(2, "0");
      const month = sepParts[1].padStart(2, "0");
      const year = sepParts[2];
      formattedDOB = `${day}${month}${year}`;
    }
  }

  if (!formattedDOB) {
    if (digits.length === 8) {
      // Check if starts with a 4-digit year (YYYYMMDD)
      const first4 = parseInt(digits.slice(0, 4), 10);
      const last4 = parseInt(digits.slice(4, 8), 10);
      if (first4 >= 1900 && first4 <= 2099 && (last4 < 1900 || last4 > 2099)) {
        // YYYYMMDD -> DDMMYYYY
        const year = digits.slice(0, 4);
        const month = digits.slice(4, 6);
        const day = digits.slice(6, 8);
        formattedDOB = `${day}${month}${year}`;
      } else {
        // If already DDMMYYYY
        formattedDOB = digits;
      }
    } else if (digits.length === 7) {
      // Handle single-digit day/month like 2032000 -> 02032000
      const day = digits.slice(0, 1).padStart(2, "0");
      const month = digits.slice(1, 3).padStart(2, "0");
      const year = digits.slice(3);
      formattedDOB = `${day}${month}${year}`;
    } else {
      return "DefaultPass@123";
    }
  }

  return `${initials}@${firstName}${formattedDOB}`;
};

// Also export as generateTemporaryPassword for backwards compatibility
export const generateTemporaryPassword = (fullName = "", dob = "") => {
  if (typeof fullName === "number") {
    return "DefaultPass@123";
  }
  return generatePassword(fullName, dob);
};
