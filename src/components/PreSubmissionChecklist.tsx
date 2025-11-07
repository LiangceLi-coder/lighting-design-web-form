import React from "react";
import { useFormContext } from "react-hook-form";

const checklistFields = [
  { label: "Requested Date", name: "requestedDate" },
  { label: "Contractor Name", name: "contractor" },
  { label: "Plans Included", name: "attachedDrawings" },
  { label: "Estimated Value (Haneco)", name: "estimatedValue" },
  { label: "Ceiling Heights Included", name: "ceilingHeight" },
  { label: "Ceiling Type (T-bar, plaster, cement, timber, other)", name: "ceilingType" },
  { label: "Ceiling T-Bar Direction", name: "ceilingDirection" },
  { label: "Emergency Lighting Included?", name: "emergencyLighting" },
  { label: "Lighting Standards Specified?", name: "lightingStandard" },
  { label: "Suggested Fittings Listed", name: "suggestedFittings" },
  { label: "If Sports Lighting, Existing/New Poles, Pole Heights", name: "sportsPoles" },
  { label: "If Sports Lighting, Level Noted (Rec, Comp, Training)", name: "sportsLevel" },
  { label: "If Sports Lighting, Glare or Obtrusive Light Concerns Captured", name: "sportsGlare" },
];

export default function PreSubmissionChecklist({ onBack, onSubmit }) {
  const { getValues } = useFormContext();
  const formData = getValues();

  const getYesNo = (value) => {
    if (Array.isArray(value)) return value.length > 0 ? "Y" : "N";
    return value ? "Y" : "N";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-[#13294B] mb-2">Pre Submission Checklist</h2>
        <p className="text-sm text-gray-600 mb-6">
          Stop, take 5 and review the request before pressing the submit button.<br />
          Whilst you can add more information to this request at any time, there are fields requesting information that is mandatory due to the
          critical nature of the information they provide to the Lighting Design team. Mandatory fields inform their work and ensuring a speedy return
          of your request.
        </p>

        <h3 className="text-lg font-semibold text-[#13294B] underline">Information Checklist</h3>

        <div className="grid grid-cols-2 gap-4">
          {checklistFields.map((field) => (
            <div key={field.name} className="flex justify-between">
              <span className="text-[#13294B] font-medium">{field.label}</span>
              <span className="text-white bg-[#13294B] px-3 py-1 rounded-md font-semibold">
                {getYesNo(formData[field.name])}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => onSubmit(formData)}
            disabled={true}
            className="bg-[#00B388] hover:bg-[#00a177] text-white px-6 py-2 rounded-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
