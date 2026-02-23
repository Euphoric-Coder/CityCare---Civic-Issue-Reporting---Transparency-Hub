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
import MediaPreview from "./MediaPreview";
import { useMutation, useQuery } from "convex/react";
import { duplicateTracker } from "@/lib/duplicateTracker";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const PreviewModal = ({
  formData,
  setFormData,
  onClose,
  setCurrentStep,
  onSubmit,
  isSubmitting,
}) => {
  const { data: session, status } = useSession();
  const [duplicates, setDuplicates] = useState([]);
  // values: "cancel" | "submit"
  const [dialogType, setDialogType] = useState(null);

  const hasStrongDuplicate = duplicates.some((dup) => dup.strongDuplicate);

  // Only run query when:
  // 1. Session finished loading
  // 2. User authenticated
  // 3. City exists
  const activeIssues = useQuery(
    api.duplicateIssues.getActiveIssuesForDuplicateCheck,
    status === "authenticated" && formData.city
      ? {
          city: formData.city,
        }
      : "skip",
  );

  // Filter only issues posted by same citizen
  const filteredIssues = useMemo(() => {
    if (!activeIssues || !session?.user?.id) return [];

    return activeIssues.filter((issue) => issue.reportedBy === session.user.id);
  }, [activeIssues, session?.user?.id]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!filteredIssues.length) return;
    if (!formData.title || !formData.description) return;

    const results = duplicateTracker(formData, filteredIssues);

    // Attach full issue details
    const enrichedResults = results.map((dup) => {
      const fullIssue = filteredIssues.find(
        (issue) => issue._id === dup.issueId,
      );

      return {
        ...dup,
        fullIssue,
      };
    });

    setDuplicates(enrichedResults);
  }, [formData, filteredIssues]);

  const deleteMedia = useMutation(api.issuesMedia.deleteMedia);

  const handleCancelSubmission = async () => {
    try {
      // Delete all photos
      if (formData.photos?.length > 0) {
        await Promise.all(
          formData.photos.map((storageId) => deleteMedia({ storageId })),
        );
      }

      // Delete video if exists
      if (formData.videos) {
        await deleteMedia({ storageId: formData.videos });
      }

      // Reset duplicate state
      setDuplicates([]);

      // Resets Issue Data
      setFormData({
        title: "",
        description: "",
        category: "",
        subcategory: [],
        otherCategoryName: "",
        priority: "",
        tags: [],
        photos: [],
        videos: [],

        searchQuery: "",
        address: "",
        city: "",
        state: "",
        postal: "",
        latitude: 20.5937,
        longitude: 78.9629,
        googleMapUrl: "",

        isAnonymous: false,
        additionalEmail: "",

        createdAt: Date.now(),
      });

      // Reset to Step 1
      setCurrentStep(1);

      // Close modal
      onClose();
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const getCategoryLabel = (value) => {
    switch (value) {
      case "road":
        return (
          <span className="inline-flex items-center gap-1">
            <Map className="text-emerald-600 dark:text-emerald-400" size={18} />
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
                  formData.priority,
                )}`}
              >
                {formData.priority.charAt(0).toUpperCase() +
                  formData.priority.slice(1)}
              </span>
            </div>
          </div>

          {/* Media Evidence */}
          {(formData.photos?.length > 0 || formData.videos?.length > 0) && (
            <div className="space-y-5">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Media Evidence
              </h4>

              {/* Photos */}
              {formData.photos?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Photos ({formData.photos.length})
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {formData.photos.map((id, index) => (
                      <div
                        key={id}
                        className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <MediaPreview storageId={id} isVideo={false} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {formData.videos?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Video
                  </p>

                  {formData.videos && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                      <MediaPreview storageId={formData.videos} isVideo />
                    </div>
                  )}
                </div>
              )}
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

          {/* Duplicate Detection */}
          {duplicates.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-2xl p-5 shadow-lg animate-fadeIn">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle
                  className="text-yellow-600 dark:text-yellow-400"
                  size={22}
                />
                <h3 className="font-bold text-yellow-800 dark:text-yellow-300 text-lg">
                  Similar Active Issues Found
                </h3>
              </div>

              <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-4">
                Matching threshold: {70}/100
              </p>

              <div className="space-y-4">
                {duplicates.map((dup) => (
                  <div
                    key={dup.issueId}
                    className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-yellow-200 dark:border-yellow-600 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          {dup.fullIssue?.title || "Untitled Issue"}
                        </p>

                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {dup.fullIssue?.description}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                            Category: {dup.fullIssue?.category}
                          </span>

                          {dup.fullIssue?.subcategory?.map((sub) => (
                            <span
                              key={sub}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md"
                            >
                              {sub}
                            </span>
                          ))}

                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                            Priority: {dup.fullIssue?.priority}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-400">
                          Issue ID: {dup.issueId}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`flex-1 items-end px-3 py-1 rounded-full text-xs font-bold ${
                        dup.score >= 85
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                    >
                      {dup.score}/100 Match
                    </span>

                    {/* Match Reasons */}
                    <ul className="text-xs text-gray-600 dark:text-gray-400 list-disc list-inside space-y-1">
                      {dup.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>

                    {/* Strong Duplicate Warning */}
                    {dup.strongDuplicate && (
                      <div className="mt-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400">
                          <AlertTriangle
                            className="inline mr-1 text-red-600"
                            size={14}
                          />{" "}
                          Strong Duplicate Detected
                        </p>
                        <p className="text-xs text-red-500 dark:text-red-300">
                          This issue is highly similar to an existing active
                          report. Consider reviewing it before submitting.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact / Anonymous */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Anonymous Status */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Shield
                  className="text-emerald-600 dark:text-emerald-400"
                  size={20}
                />

                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  Anonymity Status
                </span>
              </div>

              {formData.isAnonymous ? (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This report is submitted anonymously.
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Reporter identity is visible to authorities.
                </p>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-emerald-200 dark:border-emerald-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Mail
                  className="text-emerald-600 dark:text-emerald-400"
                  size={20}
                />

                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  Contact Information
                </span>
              </div>

              {formData.additionalEmail ? (
                <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                  {formData.additionalEmail}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No contact details provided.
                </p>
              )}
            </div>
          </div>
        </div>

        {hasStrongDuplicate && (
          <p className="text-center text-sm text-red-600 dark:text-red-400 font-semibold mt-2">
            A highly similar active issue exists. Please confirm your action.
          </p>
        )}

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-gray-900/50 transition-colors">
          <div className="flex gap-4">
            {/* Edit Button */}
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit Report
            </button>

            {/* IF Strong Duplicate → Replace Submit */}
            {hasStrongDuplicate ? (
              <>
                <button
                  onClick={() => setDialogType("cancel")}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-red-400 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Submission
                </button>

                <button
                  onClick={() => setDialogType("submit")}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Submit Anyway
                </button>
              </>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={!!dialogType} onOpenChange={() => setDialogType(null)}>
        <AlertDialogContent
          className="
      p-0 overflow-hidden rounded-2xl
      border border-emerald-200 dark:border-emerald-800
      bg-white dark:bg-gray-900
      shadow-2xl
    "
        >
          {/* Gradient Header */}
          <div
            className="
        bg-gradient-to-r 
        from-teal-600 
        via-emerald-600 
        to-cyan-700 
        p-6
      "
          >
            <div className="flex items-center gap-3">
              {dialogType === "cancel" ? (
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <AlertTriangle className="text-white" size={22} />
                </div>
              ) : (
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Shield className="text-white" size={22} />
                </div>
              )}

              <h2 className="text-xl font-bold text-white">
                {dialogType === "cancel"
                  ? "Cancel This Report?"
                  : "Submit Duplicate Issue?"}
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {dialogType === "cancel"
                ? "This will permanently delete all uploaded media and completely clear your report data. This action cannot be undone."
                : "A highly similar active issue already exists in the system. Submitting this report may create redundancy. Are you sure you want to proceed?"}
            </p>

            {dialogType === "submit" && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4 text-xs text-yellow-700 dark:text-yellow-300">
                Submitting a duplicate issue may delay resolution and affect
                system efficiency.
              </div>
            )}

            {dialogType === "cancel" && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl p-4 text-xs text-red-600 dark:text-red-300">
                All uploaded photos and videos will be permanently deleted from
                storage.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-4 p-6 pt-0">
            <AlertDialogCancel
              className="
          flex-1
          px-5 py-3
          rounded-xl
          border-2
          border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-all
        "
            >
              Go Back
            </AlertDialogCancel>

            {dialogType === "cancel" ? (
              <AlertDialogAction
                onClick={handleCancelSubmission}
                className="
            flex-1
            px-5 py-3
            rounded-xl
            font-semibold
            bg-gradient-to-r 
            from-red-500 
            to-red-600
            text-white
            shadow-lg
            hover:shadow-xl
            hover:scale-[1.02]
            transition-all
          "
              >
                Yes, Cancel Report
              </AlertDialogAction>
            ) : (
              <AlertDialogAction
                onClick={onSubmit}
                className="
            flex-1
            px-5 py-3
            rounded-xl
            font-semibold
            bg-gradient-to-r 
            from-teal-600 
            via-emerald-600 
            to-cyan-700
            text-white
            shadow-lg
            hover:shadow-xl
            hover:scale-[1.02]
            transition-all
          "
              >
                Yes, Submit Anyway
              </AlertDialogAction>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreviewModal;
