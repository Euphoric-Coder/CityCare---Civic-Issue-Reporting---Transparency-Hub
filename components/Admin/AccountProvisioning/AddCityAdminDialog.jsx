import { useState } from "react";
import { X, UserPlus, Building2, KeyRound, Loader2, Check, AlertCircle, Mail } from "lucide-react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import {
  INDIAN_STATES,
  COMMON_CITIES,
} from "../../../lib/accountProvisioning/provisioningConstants";
import { generatePassword, generateTemporaryPassword } from "../../../lib/accountProvisioning/generateTemporaryPassword";

export function AddCityAdminDialog({ isOpen, onClose, adminUserId, referenceData, onSuccess }) {
  const createCityAdminAction = useAction(
    api.accountProvisioningActions.createPreProvisionedCityAdmin
  );

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    state: "Uttar Pradesh",
    city: "Varanasi",
    rawPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCredential, setCreatedCredential] = useState(null);

  const monthlyUsage = useQuery(api.accountProvisioning.getMonthlyProvisioningUsage);
  const isMonthlyLimitReached = Boolean(monthlyUsage?.isLimitReached);

  if (!isOpen) return null;

  // Existing emails from Convex user database & provisioned reference records
  const existingUserEmails = new Set(
    (referenceData?.existingUserEmails || []).map((e) => e.toLowerCase().trim())
  );

  const normalizedInputEmail = formData.email.toLowerCase().trim();
  const isEmailTaken = Boolean(
    normalizedInputEmail && existingUserEmails.has(normalizedInputEmail)
  );

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
      toast.error("Date of Birth is required to generate City Admin credentials");
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
      const res = await createCityAdminAction({
        fullName: formData.fullName.trim(),
        email: emailToSubmit,
        phone: formData.phone.trim() || "9876543220",
        dob: formData.dob || undefined,
        state: formData.state,
        city: formData.city,
        rawPassword: effectivePassword,
        creatorUserId: adminUserId,
      });

      setCreatedCredential({
        name: formData.fullName,
        email: emailToSubmit,
        tempPassword: effectivePassword,
        emailSent: res?.emailSent !== false,
      });

      if (res?.emailSent) {
        toast.success("City Admin provisioned & onboarding email sent via Resend!");
      } else {
        toast.success("City Admin account pre-provisioned successfully!");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to provision City Admin account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasNameAndDob = Boolean(formData.fullName.trim() && formData.dob);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 px-6 py-5 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl border border-white/30">
              <Building2 size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Add City Admin</h2>
              <p className="text-xs font-semibold text-purple-100/90">
                Pre-provision dedicated Administrator for a City
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
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 rounded-2xl p-5 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Check size={24} strokeWidth={3} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  City Admin Provisioned!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Share these credentials securely with the city administrator.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-purple-200/80 dark:border-purple-800/80 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Full Name:</span>
                  <span className="font-black text-slate-900 dark:text-white">{createdCredential.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-500">Email:</span>
                  <span className="font-black text-slate-900 dark:text-white">{createdCredential.email}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-500">Temporary Password:</span>
                  <code className="font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg font-bold text-slate-900 dark:text-purple-400 text-sm">
                    {createdCredential.tempPassword}
                  </code>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-xs font-bold text-left">
                <Mail size={16} className="shrink-0 text-purple-600 dark:text-purple-400" />
                <span>
                  {createdCredential.emailSent
                    ? `Onboarding email with temporary credentials automatically sent to ${createdCredential.email} via Resend!`
                    : `Account created. (Note: Email delivery failed or was skipped).`}
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-colors shadow-md text-sm"
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
                    placeholder="e.g. Ananya Gupta"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    placeholder="e.g. ananya@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl border ${
                      isEmailTaken
                        ? "border-rose-500 focus:ring-rose-500 bg-rose-50/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200"
                        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-purple-500 text-slate-900 dark:text-white"
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
                    placeholder="9876543220"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {COMMON_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                    className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 font-mono text-sm font-black text-purple-600 dark:text-purple-400"
                    />
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                      Generated from City Admin's initials, first name, and date of birth.
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
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Provisioning...
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} /> Provision City Admin
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
