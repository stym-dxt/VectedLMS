import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";

const onboardingSteps = [
  {
    name: "welcome",
    title: "Welcome to Vector Skill Academy",
    description: "Get started on your learning journey",
  },
  {
    name: "profile",
    title: "Complete Your Profile",
    description: "Tell us about yourself",
  },
  {
    name: "interests",
    title: "Select Your Interests",
    description: "Choose courses that interest you",
  },
  {
    name: "goals",
    title: "Set Your Goals",
    description: "Define what you want to achieve",
  },
];

export default function Onboarding() {
  const { isAuthenticated } = useAuthStore();
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    api
      .get("/onboarding")
      .then((response) => {
        const userSteps = response.data;
        const stepMap = new Map(userSteps.map((s: any) => [s.step_name, s]));

        const allSteps = onboardingSteps.map((step, index) => {
          const userStep = stepMap.get(step.name) as any;
          return {
            ...step,
            index,
            is_completed: userStep?.is_completed || false,
            step_data: userStep?.step_data || {},
          };
        });

        setSteps(allSteps);
        const firstIncomplete = allSteps.findIndex((s) => !s.is_completed);
        setCurrentStep(firstIncomplete >= 0 ? firstIncomplete : 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated]);

  const handleStepComplete = async () => {
    const step = steps[currentStep];
    try {
      let stepResponse = await api.post("/onboarding", {
        step_name: step.name,
        step_data: formData,
      });

      const stepId = stepResponse.data.id;
      await api.put(`/onboarding/${stepId}`, {
        is_completed: true,
      });

      const nextStep = currentStep + 1;
      if (nextStep < steps.length) {
        setCurrentStep(nextStep);
        setFormData({});
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      alert("Failed to save step");
    }
  };

  const handleSkip = () => {
    const nextStep = currentStep + 1;
    if (nextStep < steps.length) {
      setCurrentStep(nextStep);
      setFormData({});
    } else {
      window.location.href = "/dashboard";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((s, index) => (
              <div
                key={s.name}
                className={`flex-1 h-2 mx-1 rounded ${
                  index <= currentStep ? "bg-blue-600" : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-center">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-4">{step.title}</h1>
          <p className="text-gray-300 mb-8">{step.description}</p>

          {step.name === "welcome" && (
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                Welcome to Vector Skill Academy! We're excited to have you on
                board. Let's get started with your learning journey.
              </p>
            </div>
          )}

          {step.name === "profile" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.full_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
            </div>
          )}

          {step.name === "interests" && (
            <div className="space-y-4">
              <label className="block text-gray-300 mb-2">
                Select your interests:
              </label>
              {[
                "AI/ML",
                "Web Development",
                "Data Science",
                "Cloud Computing",
                "Cybersecurity",
              ].map((interest) => (
                <label
                  key={interest}
                  className="flex items-center text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={formData.interests?.includes(interest) || false}
                    onChange={(e) => {
                      const interests = formData.interests || [];
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          interests: [...interests, interest],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          interests: interests.filter(
                            (i: string) => i !== interest,
                          ),
                        });
                      }
                    }}
                    className="mr-2"
                  />
                  {interest}
                </label>
              ))}
            </div>
          )}

          {step.name === "goals" && (
            <div className="space-y-4">
              <textarea
                placeholder="What are your learning goals?"
                value={formData.goals || ""}
                onChange={(e) =>
                  setFormData({ ...formData, goals: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={handleSkip}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
            >
              Skip
            </button>
            <button
              onClick={handleStepComplete}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentStep === steps.length - 1 ? "Complete" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
