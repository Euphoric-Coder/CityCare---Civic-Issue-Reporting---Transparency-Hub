import {
  X,
  MapPin,
  Tag,
  AlertTriangle,
  Shield,
  Mail,
  Loader2,
  Lightbulb,
  Droplets,
  Trash2,
  ClipboardList,
  Map,
} from "lucide-react";

const PreviewModal = ({ formData, onClose, onSubmit, isSubmitting }) => {
  const getCategoryLabel = (value) => {
    switch (value) {
      case "road":
        return (
          <span className="inline-flex items-center gap-1">
            <Map
              className="text-emerald-600 dark:text-emerald-400"
              size={18}
            />
            Road & Infrastructure
          </span>
        );
      case "lighting":
        return (
          <span className="inline-flex items-center gap-1">
            <Lightbulb
              className="text-yellow-500 dark:text-yellow-400"
              size={18}
            />
            Street Lighting
          </span>
        );
      case "water":
        return (
          <span className="inline-flex items-center gap-1">
            <Droplets className="text-cyan-600 dark:text-cyan-400" size={18} />
            Water & Drainage
          </span>
        );
      case "waste":
        return (
          <span className="inline-flex items-center gap-1">
            <Trash2 className="text-green-600 dark:text-green-400" size={18} />
            Waste Management
          </span>
        );
      case "other":
        return (
          <span className="inline-flex items-center gap-1">
            <ClipboardList
              className="text-gray-600 dark:text-gray-400"
              size={18}
            />
            Other
          </span>
        );
      default:
        return (
          <span className="text-gray-500 italic">
            Unknown Category: {String(value || "N/A")}
          </span>
        );
    }
  };

  const getSeverityColor = (value) => {
    const colors = {
      low: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
      medium:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
      high: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
    };
    return colors[value] || "";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp border border-gray-200 dark:border-gray-800 transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Review Your Report</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Title & Description */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
              {formData.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {formData.description}
            </p>
          </div>

          {/* Category & Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <Tag size={16} />
                <span className="font-medium">Category</span>
              </div>
              <p className="text-gray-800 dark:text-gray-100 font-semibold">
                {getCategoryLabel(formData.category)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-colors">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                <AlertTriangle size={16} />
                <span className="font-medium">Severity</span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-lg border-2 font-semibold text-sm ${getSeverityColor(
                  formData.severity
                )}`}
              >
                {formData.severity.charAt(0).toUpperCase() +
                  formData.severity.slice(1)}
              </span>
            </div>
          </div>

          {/* Photo Evidence */}
          {formData.photoUrl && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Photo Evidence
              </h4>
              <img
                src={formData.photoUrl}
                alt="Issue"
                className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
              />
            </div>
          )}

          {/* Location */}
          <div className="bg-emerald-50 dark:bg-gray-800 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-700 transition-colors">
            <div className="flex items-start gap-3">
              <MapPin
                className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </h4>
                <p className="text-gray-800 dark:text-gray-100 font-medium mb-2">
                  {formData.address}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  {formData.latitude.toFixed(6)},{" "}
                  {formData.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact / Anonymous */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-700 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              {formData.isAnonymous ? (
                <>
                  <Shield
                    className="text-emerald-600 dark:text-emerald-400"
                    size={20}
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Anonymous Report
                  </span>
                </>
              ) : (
                <>
                  <Mail
                    className="text-emerald-600 dark:text-emerald-400"
                    size={20}
                  />
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    Contact Information
                  </span>
                </>
              )}
            </div>
            {formData.isAnonymous ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your identity will remain private.
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formData.email || "No email provided"}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50 transition-colors">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Report
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                "Submit Issue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
