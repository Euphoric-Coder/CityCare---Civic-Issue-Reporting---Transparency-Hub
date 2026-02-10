import {
  AlertCircle,
  Camera,
  NotebookText,
  X,
  Map,
  Lightbulb,
  Trash2,
  Clipboard,
  ChevronDown,
  Check,
  Droplets,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MediaPreview from "./MediaPreview";
import ImageCarousel from "./ImageCarousel";
import { toast } from "sonner";

const categories = [
  {
    value: "road",
    label: "Road & Infrastructure",
    icon: Map,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "lighting",
    label: "Street Lighting",
    icon: Lightbulb,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    value: "water",
    label: "Water & Drainage",
    icon: Droplets,
    color: "text-cyan-600 dark:text-cyan-400",
  },
  {
    value: "waste",
    label: "Waste Management",
    icon: Trash2,
    color: "text-green-600 dark:text-green-400",
  },
  {
    value: "other",
    label: "Other",
    icon: Clipboard,
    color: "text-gray-600 dark:text-gray-400",
  },
];

const severityLevels = [
  {
    value: "low",
    label: "Low",
    color:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-400 dark:border-blue-600 ring-blue-300 dark:ring-blue-700",
  },
  {
    value: "medium",
    label: "Medium",
    color:
      "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 border-yellow-400 dark:border-yellow-600 ring-yellow-300 dark:ring-yellow-700",
  },
  {
    value: "high",
    label: "High",
    color:
      "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-400 dark:border-red-600 ring-red-300 dark:ring-red-700",
  },
];

const DetailsCard = ({ formData, setFormData, errors, setErrors }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const generateUploadUrl = useMutation(api.issuesMedia.generateUploadUrl);

  const deleteMedia = useMutation(api.issuesMedia.deleteMedia);

  const isVideoDisabled = !!video || uploading;

  const uploadFile = async (file) => {
    const url = await generateUploadUrl();

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!res.ok) throw new Error("Upload failed");

    const { storageId } = await res.json();

    return storageId;
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploading(true);

    const loadImage = toast.loading("Uploading images...");

    try {
      const uploaded = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;

        const id = await uploadFile(file);
        uploaded.push(id);
      }

      setImages((prev) => [...prev, ...uploaded]);

      setFormData((prev) => ({
        ...prev,
        photos: [...(prev.photos || []), ...uploaded],
      }));

      toast.dismiss(loadImage);
      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(`Failed to upload images: ${err.message}`);
    } finally {
      setUploading(false);

      // Reset input so same file can be re-uploaded
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !file.type.startsWith("video/")) return;

    setUploading(true);

    try {
      const id = await uploadFile(file);

      setVideo(id);

      setFormData((prev) => ({
        ...prev,
        videos: [id],
      }));
    } finally {
      setUploading(false);

      // Reset input
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
    }
  };

  const removeMedia = async (id, type) => {
    await deleteMedia({ storageId: id });

    if (type === "image") {
      setImages((p) => p.filter((x) => x !== id));

      setFormData((p) => ({
        ...p,
        photos: p.photos.filter((x) => x !== id),
      }));
    }

    if (type === "video") {
      setVideo(null);

      setFormData((p) => ({
        ...p,
        videos: [],
      }));
    }
  };

  const handleInput = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset the error for that field (if any)
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
        <NotebookText />
        Issue Details
      </h2>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
          >
            Issue Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInput("title", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${
              errors.title
                ? "border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-800"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            placeholder="e.g., Broken streetlight on Main Street"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Be specific and concise
          </p>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={(e) => handleInput("description", e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border-2 resize-none transition-all outline-none focus:ring-4 ${
              errors.description
                ? "border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-800"
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            placeholder="Describe the issue in detail. What happened? When did you notice it?"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.description.length}/500 characters (min 20)
          </p>
        </div>

        {/* Category & Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Category *
            </label>

            <button
              type="button"
              onClick={() => setShowDropdown((prev) => !prev)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // small delay
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${
                errors.category
                  ? "border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                  : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-800"
              } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
            >
              <span className="flex items-center gap-2">
                {formData.category ? (
                  <>
                    {(() => {
                      const selected = categories.find(
                        (cat) => cat.value === formData.category,
                      );
                      const Icon = selected?.icon;
                      return Icon ? (
                        <>
                          <Icon className={`w-5 h-5 ${selected.color}`} />
                          {selected.label}
                        </>
                      ) : (
                        "Select a category"
                      );
                    })()}
                  </>
                ) : (
                  "Select a category"
                )}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden animate-fadeIn">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = formData.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        handleInput("category", cat.value);
                        setShowDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-all ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                          : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50/50 dark:hover:bg-gray-700/50"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${cat.color}`} />
                        {cat.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {errors.category && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.category}
              </p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Severity Level *
            </label>
            <div className="flex gap-4">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => handleInput("severity", level.value)}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                    formData.severity === level.value
                      ? `${level.color} ring-4 ring-opacity-60 scale-105`
                      : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
            {errors.severity && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.severity}
              </p>
            )}
          </div>

          {formData.category === "other" && (
            <div className="md:col-span-2">
              <label
                htmlFor="otherCategoryName"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
              >
                Other Category (If Applicable) *
              </label>
              <input
                type="text"
                id="otherCategoryName"
                value={formData.otherCategoryName}
                onChange={(e) =>
                  handleInput("otherCategoryName", e.target.value)
                }
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none focus:ring-4 ${
                  errors.otherCategoryName
                    ? "border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                    : "border-gray-200 dark:border-gray-700 focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-emerald-100 dark:focus:ring-emerald-800"
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100`}
                placeholder="e.g., Broken streetlight on Main Street"
              />
              {errors.otherCategoryName && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.otherCategoryName}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Be specific and concise
              </p>
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Photo Evidence *
          </label>

          <label
            className={`flex flex-col items-center justify-center w-full h-40 
    border-2 border-dashed rounded-xl transition-all cursor-pointer 
    bg-gray-50 dark:bg-gray-800 group

    ${
      errors.photos
        ? "border-red-300 dark:border-red-500 bg-red-50/40 dark:bg-red-950/30 hover:border-red-500"
        : "border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
    }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Camera
                className={`w-10 h-10 mb-2 transition-colors

        ${
          errors.photos
            ? "text-red-400 dark:text-red-400"
            : "text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
        }`}
              />

              <p
                className={`text-sm font-medium

        ${
          errors.photos
            ? "text-red-600 dark:text-red-400"
            : "text-gray-600 dark:text-gray-300"
        }`}
              >
                Click to upload or drag and drop
              </p>

              <p
                className={`text-xs mt-1

        ${
          errors.photos
            ? "text-red-500 dark:text-red-400"
            : "text-gray-500 dark:text-gray-400"
        }`}
              >
                PNG, JPG up to 10MB
              </p>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e);

                // Clear error when uploaded
                setErrors((prev) => ({
                  ...prev,
                  photos: "",
                }));
              }}
              disabled={uploading}
            />
          </label>

          {/* Error Message */}
          {errors.photos && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.photos}
            </p>
          )}

          {/* IMAGE CAROUSEL */}
          {images.length > 0 && (
            <div className="mt-4">
              {/* UPLOAD COUNT BADGE */}
              <div
                className="
  px-4 py-1.5 rounded-full
  bg-white/80 dark:bg-dark-400/80
  backdrop-blur-md mb-2
  border border-emerald-200 dark:border-emerald-700
  shadow-md shadow-emerald-500/10
  flex items-center gap-2
  text-xs font-semibold text-gray-700 dark:text-gray-200"
              >
                <Camera className="w-4 h-4 text-emerald-500" />

                <span>
                  {images.length} Image{images.length > 1 ? "s" : ""}
                </span>

                <span className="text-emerald-600 dark:text-emerald-400">
                  Uploaded
                </span>
              </div>
              <ImageCarousel images={images} removeMedia={removeMedia} />
            </div>
          )}
        </div>

        {/* Video Upload */}
        <div className="mt-6">
          <label className="block text-sm font-semibold mb-2">
            Video (Optional)
          </label>

          <label
            className={`
      flex flex-col items-center justify-center
      w-full h-44 border-2 border-dashed rounded-xl
      transition-all group

      ${
        isVideoDisabled
          ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-60 cursor-not-allowed pointer-events-none"
          : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
      }
    `}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Video
                className={`
          w-10 h-10 transition-colors
          ${
            isVideoDisabled
              ? "text-gray-400"
              : "text-gray-400 group-hover:text-emerald-500"
          }
        `}
              />

              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {isVideoDisabled ? "Video Uploaded" : "Upload Video Evidence"}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                MP4 / WebM • Max 50MB
              </p>
            </div>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoUpload}
              disabled={isVideoDisabled}
            />
          </label>

          {/* Preview */}
          {video && (
            <div className="relative mt-3 rounded-xl overflow-hidden shadow">
              <MediaPreview storageId={video} isVideo />

              <button
                onClick={() => removeMedia(video, "video")}
                className="
          absolute top-2 right-2
          bg-red-500 hover:bg-red-600
          p-1.5 rounded-full
          text-white shadow
          transition
        "
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
