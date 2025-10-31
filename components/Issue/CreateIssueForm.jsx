import { useState } from "react";
import { CheckCircle2, HeartHandshake } from "lucide-react";
import ProgressBar from "./ProgressBar";
import DetailsCard from "./DetailsCard";
import Location from "./Location";
import AnonymityToggle from "./AnonymityToggle";
import PreviewModal from "./Preview";

const IssueForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    severity: "",
    photoUrl: null,
    latitude: 40.7128,
    longitude: -74.006,
    address: "",
    isAnonymous: false,
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
      } else if (formData.title.length < 5) {
        newErrors.title = "Title must be at least 5 characters";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
      } else if (formData.description.length < 20) {
        newErrors.description =
          "Please provide more details (min 20 characters)";
      }

      if (!formData.category) {
        newErrors.category = "Please select a category";
      }

      if (!formData.severity) {
        newErrors.severity = "Please select a severity level";
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowPreview(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    setShowPreview(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      severity: "",
      photoUrl: null,
      latitude: 40.7128,
      longitude: -74.006,
      address: "",
      isAnonymous: false,
      email: "",
    });
    setCurrentStep(1);
    // onSuccess();
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 shadow-lg mb-4">
            <HeartHandshake className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 bg-clip-text text-transparent mb-3">
            Report a New Issue
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us keep the city clean and safe. Your voice matters in building
            a better community for everyone.
          </p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <div className="mt-8">
          {currentStep === 1 && (
            <DetailsCard
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <Location
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <AnonymityToggle
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          )}
        </div>

        <div className="mt-8 flex justify-between gap-4">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            className="ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
          >
            {currentStep === 3 ? (
              <>
                <CheckCircle2 size={20} />
                Preview & Submit
              </>
            ) : (
              <>
                Continue
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          🏆 You'll earn{" "}
          <span className="font-semibold text-emerald-600">CityPoints</span> for
          verified reports
        </p>
      </div>

      {showPreview && (
        <PreviewModal
          formData={formData}
          onClose={() => setShowPreview(false)}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
};

export default IssueForm;
