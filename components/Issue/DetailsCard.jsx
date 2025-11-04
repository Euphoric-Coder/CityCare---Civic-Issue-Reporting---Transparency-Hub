import { AlertCircle, Camera, NotebookText, X } from 'lucide-react';

const categories = [
  { value: 'road', label: 'Road & Infrastructure', icon: '🛣️' },
  { value: 'lighting', label: 'Street Lighting', icon: '💡' },
  { value: 'water', label: 'Water & Drainage', icon: '💧' },
  { value: 'waste', label: 'Waste Management', icon: '🗑️' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const severityLevels = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700 border-blue-400 ring-blue-300' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-400 ring-yellow-300' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-700 border-red-400 ring-red-300' },
];

const DetailsCard = ({ formData, setFormData, errors }) => {
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photoUrl: null });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-6 flex items-center gap-2">
        <NotebookText />
        Issue Details
      </h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Issue Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.title
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-emerald-500"
            } focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all`}
            placeholder="e.g., Broken streetlight on Main Street"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Be specific and concise</p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            rows={5}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              errors.description
                ? "border-red-300 focus:border-red-500"
                : "border-gray-200 focus:border-emerald-500"
            } focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none`}
            placeholder="Describe the issue in detail. What happened? When did you notice it?"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/500 characters (min 20)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.category
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-emerald-500"
              } focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all bg-white`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Severity Level *
            </label>
            <div className="flex gap-4">
              {severityLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, severity: level.value })
                  }
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                    formData.severity === level.value
                      ? level.color + " ring-4 ring-opacity-60 scale-105"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
            {errors.severity && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.severity}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Photo (Optional)
          </label>

          {!formData.photoUrl ? (
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 cursor-pointer transition-all bg-gray-50 hover:bg-emerald-50 group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Camera className="w-10 h-10 text-gray-400 group-hover:text-emerald-600 transition-colors mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </label>
          ) : (
            <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200">
              <img
                src={formData.photoUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                onClick={removePhoto}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
