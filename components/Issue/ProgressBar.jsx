
const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Details' },
    { number: 2, label: 'Location' },
    { number: 3, label: 'Submit' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.number}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? 'text-emerald-700' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mb-6">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentStep > step.number
                      ? 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700'
                      : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
