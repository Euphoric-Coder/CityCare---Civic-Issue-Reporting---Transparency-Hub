import { useState } from "react";
import {
  X,
  UserPlus,
  Shield,
  Zap,
  KeyRound,
  Loader2,
  Check,
  AlertCircle,
  Plus,
  Search,
  Mail,
} from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  CANONICAL_DEPARTMENTS,
  INDIAN_STATES,
  COMMON_CITIES,
} from "../../../lib/accountProvisioning/provisioningConstants";
import { generatePassword, generateTemporaryPassword } from "../../../lib/accountProvisioning/generateTemporaryPassword";

const DEPARTMENT_SPECIALISATIONS = {
  sanitation: [
    "Waste Collection",
    "Drain Cleaning",
    "Public Toilet Maintenance",
    "Garbage Segregation",
    "Sewage Handling",
  ],
  road: [
    "Pothole Repair",
    "Asphalt Laying",
    "Footpath Repair",
    "Speed Breaker Construction",
    "Road Marking",
  ],
  water: [
    "Pipeline Repair",
    "Leakage Detection",
    "Valve Maintenance",
    "Tanker Management",
    "Water Quality Testing",
  ],
  electricity: [
    "Street Light Repair",
    "Cable Maintenance",
    "Transformer Inspection",
    "Meter Repair",
  ],
  drainage: [
    "Manhole Cleaning",
    "Flood Prevention",
    "Storm Water Management",
    "Sewer Line Repair",
  ],
  solid_waste: [
    "Dumping Site Management",
    "Waste Transportation",
    "Recycling Operations",
  ],
  public_health: [
    "Mosquito Control",
    "Disinfection",
    "Disease Prevention",
    "Sanitation Inspection",
  ],
  other: [
    "General Maintenance",
    "Civil Works",
    "Emergency Response",
  ],
};

export function AddOfficerDialog({ isOpen, onClose, referenceData, onSuccess }) {
  const createOfficerAction = useAction(
    api.accountProvisioningActions.createPreProvisionedOfficer
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    state: "Uttar Pradesh",
    city: "Varanasi",
    district: "Varanasi",
    department: "road",
    role: "unit_officer",
    specialisations: [],
    reportingUnitOfficerId: "",
    maxIssueCapacity: 10,
    rawPassword: "",
  });

  const [specialisationSearch, setSpecialisationSearch] = useState("");
  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredential, setCreatedCredential] = useState(null);

  const monthlyUsage = useQuery(api.accountProvisioning.getMonthlyProvisioningUsage);
  const isMonthlyLimitReached = Boolean(monthlyUsage?.isLimitReached);

  if (!isOpen) return null;

  // Existing emails from Convex user database & provisioned reference records
  const existingUserEmails = new Set(
    (
      referenceData?.existingUserEmails ||
      (referenceData?.unitOfficersList || []).map((u) => u.email)
    ).map((e) => e.toLowerCase().trim())
  );

  const normalizedInputEmail = formData.email.toLowerCase().trim();
  const isEmailTaken = Boolean(
    normalizedInputEmail && existingUserEmails.has(normalizedInputEmail)
  );

  // Filter UOs matching selected city & department for FO mapping
  const availableUOs = (referenceData?.unitOfficersList || []).filter(
    (uo) =>
      uo.city.toLowerCase().trim() === formData.city.toLowerCase().trim() &&
      uo.department.toLowerCase().trim() === formData.department.toLowerCase().trim()
  );

  // Department-specific specialisations
  const currentDeptSpecs = DEPARTMENT_SPECIALISATIONS[formData.department] || [];
  const filteredSpecs = currentDeptSpecs.filter((spec) =>
    spec.toLowerCase().includes(specialisationSearch.toLowerCase())
  );
  const availableSpecs = filteredSpecs.filter(
    (spec) => !(formData.specialisations || []).includes(spec)
  );

  const handleSpecSelect = (spec) => {
    const trimmed = spec.trim();
    if (!trimmed) return;
    if (!(formData.specialisations || []).includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        specialisations: [...(prev.specialisations || []), trimmed],
      }));
    }
    setSpecialisationSearch("");
    setShowSpecDropdown(false);
  };

  const handleRemoveSpec = (spec) => {
    setFormData((prev) => ({
      ...prev,
      specialisations: (prev.specialisations || []).filter((s) => s !== spec),
    }));
  };

  const handleSpecKeyDown = (e) => {
    if (e.key === "Enter" && specialisationSearch.trim()) {
      e.preventDefault();
      handleSpecSelect(specialisationSearch.trim());
    }
  };

  const handleChange = (field, val) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: val };
      if (field === "fullName" || field === "dob") {
        if (next.fullName.trim() && next.dob.trim()) {
          next.rawPassword = generatePassword(next.fullName, next.dob);
        } else {
          next.rawPassword = "";
        }
      }
      return next;
    });
  };

  const handleRegeneratePassword = () => {
    if (!formData.fullName.trim() || !formData.dob) {
      toast.info("Please enter Full Name and Date of Birth first");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      rawPassword: generatePassword(prev.fullName, prev.dob),
    }));
    toast.success("Temporary password generated!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Full Name and Email are required");
      return;
    }
    if (!formData.dob) {
      toast.error("Date of Birth is required to generate officer credentials");
      return;
    }

    if (isMonthlyLimitReached) {
      toast.error("Monthly provisioning limit of 1,000 has been reached for this month.");
      return;
    }

    const emailToSubmit = formData.email.toLowerCase().trim();
    if (existingUserEmails.has(emailToSubmit)) {
      toast.error(
        `User with email "${emailToSubmit}" already exists in the Convex user database`
      );
      return;
    }

    const effectivePassword =
      formData.rawPassword || generatePassword(formData.fullName, formData.dob);

    setIsSubmitting(true);
    try {
      const res = await createOfficerAction({
        fullName: formData.fullName.trim(),
        email: emailToSubmit,
        phone: formData.phone.trim() || "9876543210",
        dob: formData.dob || undefined,
        state: formData.state,
        city: formData.city,
        district: formData.district || formData.city,
        department: formData.department,
        role: formData.role,
        specialisations:
          formData.role === "field_officer" ? formData.specialisations || [] : undefined,
        reportingUnitOfficerId:
          formData.role === "field_officer" && formData.reportingUnitOfficerId
            ? formData.reportingUnitOfficerId
            : undefined,
        maxIssueCapacity:
          formData.role === "field_officer"
            ? Number(formData.maxIssueCapacity) || 10
            : undefined,
        rawPassword: effectivePassword,
      });

      setCreatedCredential({
        name: formData.fullName,
        email: emailToSubmit,
        role: formData.role,
        tempPassword: effectivePassword,
        emailSent: res?.emailSent !== false,
      });

      if (res?.emailSent) {
        toast.success("Officer provisioned & onboarding email sent via Resend!");
      } else {
        toast.success("Officer account pre-provisioned successfully!");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to provision officer account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNameAndDob = Boolean(formData.fullName.trim() && formData.dob);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl border border-white/30">
              <UserPlus size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Add Officer Account</h2>
              <p className="text-xs font-semibold text-emerald-100/90">
                Pre-provision Unit Officer or Field Officer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {createdCredential ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check size={24} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Account Created Successfully!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Share these credentials securely with the officer. Password change will be enforced on first login.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-emerald-200/80 dark:border-emerald-800/80 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Full Name:</span>
                  <span className="font-black text-slate-900 dark:text-white">{createdCredential.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Email:</span>
                  <span className="font-black text-slate-900 dark:text-white">{createdCredential.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Role:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase">
                    {createdCredential.role.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500">Temporary Password:</span>
                  <code className="font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg font-bold text-slate-900 dark:text-emerald-400 text-sm">
                    {createdCredential.tempPassword}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold text-left">
                <Mail size={16} className="shrink-0 text-blue-600 dark:text-blue-400" />
                <span>
                  {createdCredential.emailSent
                    ? `Onboarding email with temporary credentials automatically sent to ${createdCredential.email} via Resend!`
                    : `Account created. (Note: Email delivery failed or was skipped).`}
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors shadow-md text-sm"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isMonthlyLimitReached && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 flex items-center gap-2.5 text-xs font-bold">
                  <AlertCircle size={18} className="shrink-0 text-rose-500" />
                  <span>
                    Monthly provisioning limit of 1,000 accounts reached. Further provisioning is paused for this calendar month to respect Resend quota.
                  </span>
                </div>
              )}
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-500 mb-2">
                  Officer Role *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("role", "unit_officer")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-xs transition-all border ${
                      formData.role === "unit_officer"
                        ? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Shield size={16} /> Unit Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("role", "field_officer")}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-extrabold text-xs transition-all border ${
                      formData.role === "field_officer"
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Zap size={16} /> Field Officer
                  </button>
                </div>
              </div>

              {/* Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="e.g. Amit Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="e.g. amit@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isEmailTaken
                        ? "border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    } text-sm font-semibold focus:outline-none focus:ring-2`}
                  />
                  {isEmailTaken && (
                    <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} className="shrink-0" />
                      Email is already registered in Convex user database.
                    </p>
                  )}
                </div>
              </div>

              {/* Phone & DOB */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* State & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {COMMON_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400 mb-1">
                  Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange("department", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CANONICAL_DEPARTMENTS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field Officer specific fields */}
              {formData.role === "field_officer" && (
                <div className="space-y-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">
                        Reporting Unit Officer (Optional)
                      </label>
                      <select
                        value={formData.reportingUnitOfficerId}
                        onChange={(e) => handleChange("reportingUnitOfficerId", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Auto-assign or Unassigned</option>
                        {availableUOs.map((uo) => (
                          <option key={uo.id} value={uo.id}>
                            {uo.fullName} ({uo.city} - {uo.department})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-emerald-800 dark:text-emerald-300 mb-1">
                        Max Issue Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.maxIssueCapacity}
                        onChange={(e) => handleChange("maxIssueCapacity", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Specialisations / Subcategories selector matching DetailsCard pattern */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                        Officer Specialisations
                      </label>
                      {formData.specialisations?.length > 0 && (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {formData.specialisations.length} selected
                        </span>
                      )}
                    </div>

                    {/* Selected Specialisation Badges */}
                    {formData.specialisations && formData.specialisations.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-800/60 min-h-[42px] items-center">
                        {formData.specialisations.map((s, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 rounded-full px-3 py-1 shadow-sm animate-in fade-in zoom-in-95 duration-150"
                          >
                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                              {s}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSpec(s)}
                              className="p-0.5 rounded-full bg-emerald-100 dark:bg-emerald-800/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-emerald-600 dark:text-emerald-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors ml-0.5"
                            >
                              <X size={11} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search / Input with Dropdown */}
                    <div className="relative">
                      <div className="relative">
                        <Search
                          size={15}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          value={specialisationSearch}
                          onChange={(e) => setSpecialisationSearch(e.target.value)}
                          onKeyDown={handleSpecKeyDown}
                          onFocus={() => setShowSpecDropdown(true)}
                          onBlur={() => setTimeout(() => setShowSpecDropdown(false), 200)}
                          placeholder="Search skills or type custom skill and press Enter..."
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                      </div>

                      {showSpecDropdown && (specialisationSearch || availableSpecs.length > 0) && (
                        <div className="absolute z-30 left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                          {specialisationSearch &&
                            !currentDeptSpecs.some(
                              (s) => s.toLowerCase() === specialisationSearch.trim().toLowerCase()
                            ) && (
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSpecSelect(specialisationSearch.trim());
                                }}
                                className="w-full px-4 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-left text-xs font-bold text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-700 flex items-center gap-1.5"
                              >
                                <Plus size={14} /> Add custom "{specialisationSearch.trim()}"
                              </button>
                            )}
                          {availableSpecs.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSpecSelect(s);
                              }}
                              className="w-full px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-left text-xs text-slate-700 dark:text-slate-200 transition-colors font-medium flex items-center justify-between"
                            >
                              <span>{s}</span>
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                + Add
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Temporary Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-400">
                    Generated Temporary Password
                  </label>
                  <button
                    type="button"
                    onClick={handleRegeneratePassword}
                    disabled={!hasNameAndDob}
                    className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                  >
                    <KeyRound size={12} /> Regenerate
                  </button>
                </div>
                {formData.rawPassword ? (
                  <div>
                    <input
                      type="text"
                      readOnly
                      value={formData.rawPassword}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 font-mono text-sm font-black text-emerald-600 dark:text-emerald-400"
                    />
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                      Generated from officer's initials, first name, and date of birth.
                    </p>
                  </div>
                ) : (
                  <div className="px-3.5 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-2">
                    <KeyRound size={14} className="text-slate-400 shrink-0" />
                    <span>Provide Full Name and Date of Birth above to generate password</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-extrabold text-slate-600 dark:text-slate-400 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isEmailTaken}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Provisioning...
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} /> Provision Officer Account
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
