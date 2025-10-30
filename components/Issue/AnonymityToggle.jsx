import { Shield, Mail, AlertCircle } from 'lucide-react';

const AnonymityToggle = ({ formData, setFormData, errors }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Shield className="text-emerald-600" size={28} />
        Privacy & Contact
      </h2>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-emerald-200">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Report Anonymously
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Keep your identity private. We'll still track your report and award CityPoints to your account.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-700">
                <Shield size={14} />
                <span className="font-medium">Your privacy is protected</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
              className={`relative inline-flex h-12 w-20 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-emerald-100 ${
                formData.isAnonymous
                  ? 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 border-emerald-600'
                  : 'bg-gray-200 border-gray-300'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  formData.isAnonymous ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {!formData.isAnonymous && (
          <div className="animate-fadeIn">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 ${
                  errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'
                } focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all`}
                placeholder="your.email@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Receive updates about your report and resolution status
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-800 mb-1 text-sm">Secure</h4>
            <p className="text-xs text-gray-600">Your data is encrypted and protected</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="text-2xl mb-2">✉️</div>
            <h4 className="font-semibold text-gray-800 mb-1 text-sm">Updates</h4>
            <p className="text-xs text-gray-600">Get notified about progress</p>
          </div>

          <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
            <div className="text-2xl mb-2">🎖️</div>
            <h4 className="font-semibold text-gray-800 mb-1 text-sm">Recognition</h4>
            <p className="text-xs text-gray-600">Earn badges for helping</p>
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Why provide contact info?</h3>
              <p className="text-sm text-yellow-800">
                While optional, sharing your email helps us reach out for clarification and keeps you informed about the resolution. It also builds community trust and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymityToggle;
