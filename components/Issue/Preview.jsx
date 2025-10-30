import { X, MapPin, Tag, AlertTriangle, Shield, Mail, Loader2 } from 'lucide-react';

const PreviewModal = ({ formData, onClose, onSubmit, isSubmitting }) => {
  const getCategoryLabel = (value) => {
    const categories = {
      road: '🛣️ Road & Infrastructure',
      lighting: '💡 Street Lighting',
      water: '💧 Water & Drainage',
      waste: '🗑️ Waste Management',
      other: '📋 Other',
    };
    return categories[value] || value;
  };

  const getSeverityColor = (value) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700 border-blue-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      high: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[value] || '';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{formData.title}</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{formData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <Tag size={16} />
                  <span className="font-medium">Category</span>
                </div>
                <p className="text-gray-800 font-semibold">{getCategoryLabel(formData.category)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  <AlertTriangle size={16} />
                  <span className="font-medium">Severity</span>
                </div>
                <span className={`inline-block px-3 py-1 rounded-lg border-2 font-semibold text-sm ${getSeverityColor(formData.severity)}`}>
                  {formData.severity.charAt(0).toUpperCase() + formData.severity.slice(1)}
                </span>
              </div>
            </div>

            {formData.photoUrl && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Photo Evidence</h4>
                <img
                  src={formData.photoUrl}
                  alt="Issue"
                  className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                />
              </div>
            )}

            <div className="bg-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
              <div className="flex items-start gap-3">
                <MapPin className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-700 mb-1">Location</h4>
                  <p className="text-gray-800 font-medium mb-2">{formData.address}</p>
                  <p className="text-xs text-gray-600 font-mono">
                    {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border-2 border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                {formData.isAnonymous ? (
                  <>
                    <Shield className="text-emerald-600" size={20} />
                    <span className="font-semibold text-gray-800">Anonymous Report</span>
                  </>
                ) : (
                  <>
                    <Mail className="text-emerald-600" size={20} />
                    <span className="font-semibold text-gray-800">Contact Information</span>
                  </>
                )}
              </div>
              {formData.isAnonymous ? (
                <p className="text-sm text-gray-600">Your identity will remain private</p>
              ) : (
                <p className="text-sm text-gray-600">
                  {formData.email || 'No email provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                'Submit Issue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
