import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function Step1BasicInfo({ onNext }) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
    trigger,
  } = useFormContext();

  const selectedTerritory = useWatch({ control, name: "territory" });
  const hasMountedTerritory = useRef(false);

  useEffect(() => {
    if (!hasMountedTerritory.current) {
      hasMountedTerritory.current = true;
      return;
    }

    setValue("wholesaler", "");
  }, [selectedTerritory, setValue]);

  const handleNextClick = async () => {
    const isValid = await trigger([
      "role",
      "territory",
      "wholesaler",
      "address.line1",
      "phone",
      "email",
    ]);
    if (!isValid) return;
    onNext();
  };

  return (
    <div className="form-page">
      <div className="form-panel animate-fade">
        <h2 className="section-title">Step 1 Basic Project Information</h2>

        <div>
          <label>
            Request Source <span className="badge-required">Required</span>
          </label>
          <select {...register("role", { required: true })}>
            <option value="" className="text-gray-400">
              --- Select role ---
            </option>
            <option value="Builder">Builder</option>
            <option value="Homeowner">Homeowner</option>
            <option value="Contractor">Contractor</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Interior Designer">Interior Designer</option>
            <option value="others">others</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-2">This field is required</p>}
        </div>

        <div>
          <label>Priority Case</label>
          <div className="form-grid grid-3">
            <label>
              <input type="radio" value="High" {...register("priority")} /> High
            </label>
            <label>
              <input type="radio" value="Medium" {...register("priority")} /> Medium
            </label>
            <label>
              <input type="radio" value="Low" {...register("priority")} /> Low
            </label>
          </div>
        </div>

        <div>
          <label>Contact Name</label>
          <input type="text" {...register("contactName")} />
        </div>

        <div>
          <label>Project Name</label>
          <input type="text" {...register("projectName")} />
        </div>

        <div>
          <label>Description</label>
          <textarea {...register("description")} rows={4} placeholder="Type description here..." />
        </div>

        <div>
          <label>
            Address <span className="badge-required">Required</span>
          </label>
          <input
            type="text"
            placeholder="Address Line 1"
            {...register("address.line1", { required: true })}
          />
          <div className="form-grid grid-2">
            <input type="text" placeholder="Address Line 2" {...register("address.line2")} />
            <input type="text" placeholder="City" {...register("address.city")} />
          </div>
          <div className="form-grid grid-2">
            <input
              type="text"
              placeholder="State / Province / Region"
              {...register("address.state")}
            />
            <input type="text" placeholder="Postal Code" {...register("address.postalCode")} />
          </div>
          <select {...register("address.country")}>
            <option value="" className="text-gray-400">
              --- Select country ---
            </option>
            <option value="Australia">Australia</option>
            <option value="New Zealand">New Zealand</option>
          </select>
          {errors.address?.line1 && (
            <p className="text-red-500 text-sm mt-2">Address Line 1 is required</p>
          )}
        </div>

        <div className="action-row">
          <span className="helper-text">You can continue and edit later.</span>
          <button type="button" onClick={handleNextClick} className="btn-accent">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
