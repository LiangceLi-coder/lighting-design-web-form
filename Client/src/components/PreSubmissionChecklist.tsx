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

export default function PreSubmissionChecklist({ onBack, onSubmitted }) {
  const { getValues, handleSubmit } = useFormContext();
  const formData = getValues();

  const getYesNo = (value) => {
    if (Array.isArray(value)) return value.length > 0 ? "Y" : "N";
    return value ? "Y" : "N";
  };

  const submitHandler = async () => {
    const allData = getValues();

    const files = allData.drawingFiles || [];
    const { drawingFiles, ...rest } = allData;

    const fd = new FormData();
    fd.append("jsonData", JSON.stringify(rest));

    if (Array.isArray(files)) {
      files.forEach((file) => {
        fd.append("drawingFiles", file);
      });
    }

    onSubmitted();
    window.scrollTo({ top: 0, behavior: "instant" });

    try {
      const res = await fetch("https://lighting-design-web-form.onrender.com/api/lighting-design", {
        method: "POST",
        body: fd,
      });

      const result = await res.json();
      if (!result.success) {
        console.error("Server error:", result);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="form-page">
      <div className="form-panel animate-fade">
        <h2 className="section-title">Pre-submission Checklist</h2>
        <p className="helper-text">
          Stop, take 5 and review the request before pressing the submit button.
          Whilst you can add more information to this request at any time, there are fields
          requesting information that is mandatory due to the critical nature of the information
          they provide to the Lighting Design team. Mandatory fields inform their work and ensure
          a speedy return of your request.
        </p>

        <h3 className="section-subtitle">Information Checklist</h3>

        <div className="form-grid grid-2">
          {checklistFields.map((field) => (
            <div key={field.name} className="flex justify-between items-center gap-4">
              <span className="text-gray-800 font-medium">{field.label}</span>
              <span className="list-chip">{getYesNo(formData[field.name])}</span>
            </div>
          ))}
        </div>

        <div className="action-row">
          <button type="button" onClick={onBack} className="btn-outline">
            Back
          </button>
          <button type="submit" className="btn-accent">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
