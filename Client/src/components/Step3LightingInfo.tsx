import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

const productOptions = {
  "Accessories": ["Accessories"],
  "Commercial Downlights": [
    "ASTRAL", "Aurora Square", "CEDAR", "CENTAURI", "METEOR", "OVOLO", "STELLAR",
    "VIVA145", "XBOX"
  ],
  "Drivers": ["DRIVERS"],
  "Exit and Emergency": ["ESODO", "LUME"],
  "Highbays and Lowbays": ["BENZINA", "SKYLUX", "SKYPAD"],
  "Indoor Battens": ["BLADE", "UNO", "VISTA", "VISTAEVO", "VISTA-HR"],
  "KASTA": ["Kasta Smart", "Kasta Unison"],
  "Lighting Control": ["DUO", "SENTURA"],
  "Linear and Track Lighting": ["FLEXION", "FOCI", "PARALLAX", "TRACK"],
  "Other": ["Other"],
  "Other Cost": ["LED Lamps", "LED TUBE"],
  "Outdoor Lighting": [
    "ARCHISPOT", "CALEO", "DAWN", "HS-LUMINO", "HS-LUMINO PRO", "HS-SKYLUX FG PRO",
    "MATITA", "PANORAMA", "PARX G2", "PROXIMA", "PROXIMA G2", "STAX", "WALL WASHER"
  ],
  "Oysters": ["DISCUS", "PURO G4"],
  "Panels": ["FRAME", "MATRIX", "MATRIX_III"],
  "Residential Downlights": [
    "AURORA", "DETAIL", "DULAR", "HABITAT", "Retro 7W Kit", "Stellar 60",
    "VIVA EVO", "VIVA LP", "VIVA SEN", "VIVA110", "VIVA115", "VIVA90", "VIVA-REMOTE"
  ],
  "Weatherproof Battens": [
    "CENTAU", "DURA", "DURA FOREMAN", "SENTRY", "TRIPROOF G2"
  ]
};


export default function Step3LightingDesign({ onBack, onNext }) {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext();

  const submitHandler = async () => {
    const isValid = await trigger([
      "size.length",
      "size.width",
      "size.height",
      "reflectance.ceiling",
      "reflectance.wall",
      "reflectance.floor",
      "workplaneHeight",
      "illuminance",
      "emergency",
      "luminaireType",
      "standardRequired",
      "control",
      "otherInfo",
      // "attachedDrawings",
      // "",
      // "",
    ]);
    console.log("isValid", isValid);
    
    if (!isValid) return;
    onNext();
  }

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchProducts = useWatch({ control, name: "products" });
  const selectedAreaType = useWatch({ control, name: "dropdown" });
  const [uploadedFiles, setUploadedFiles] = useState([]);



  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= 50 * 1024 * 1024);
    const limitedFiles = [...uploadedFiles, ...validFiles].slice(0, 5);
    setUploadedFiles(limitedFiles);
    setValue("drawingFiles", limitedFiles);
  };
  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    setValue("drawingFiles", newFiles);
  };

    const drawingOptions = [
    "CAD",
    "Sketch",
    "Google Earth",
    "PDF",
    "REVIT",
    "None Provided"
    ];
  return (
    <div className="space-y-8 max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold text-[#13294B] mb-6">Step 3 - Lighting Design Requirements</h2>
      <h3 className="text-lg font-semibold text-[#13294B] mb-2">Size of Area</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input placeholder="Length (m)" type="number" {...register("size.length")} className="border border-gray-300 p-3 rounded-lg" />
        <input placeholder="Width (m)" type="number" {...register("size.width")} className="border border-gray-300 p-3 rounded-lg" />
        <input placeholder="Height (m)" type="number" {...register("size.height")} className="border border-gray-300 p-3 rounded-lg" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#13294B] mb-2">Surface Reflectances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Ceiling" {...register("reflectance.ceiling")} className="border border-gray-300 p-3 rounded-lg" />
          <input placeholder="Wall" {...register("reflectance.wall")} className="border border-gray-300 p-3 rounded-lg" />
          <input placeholder="Floor" {...register("reflectance.floor")} className="border border-gray-300 p-3 rounded-lg" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#13294B] mb-2">Workplane Height</label>
        {['Floor', 'Desk (0.7m AFFL)', 'Bench (0.9m AFFL)', 'Other'].map(option => (
          <label key={option} className="block">
            <input type="radio" value={option} {...register("workplaneHeight")} className="mr-2" /> {option}
          </label>
        ))}
      </div>
      <h3 className="text-lg font-semibold text-[#13294B] mb-2">Preferred Illuminance Level</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="LUX" {...register("illuminance")} className="border border-gray-300 p-3 rounded-lg" />
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Emergency Lighting <span className="text-red-500">*</span></label>
          <label className="inline-flex mr-4">
            <input type="radio" value="Yes" {...register("emergency", { required: true })} className="mr-1" /> Yes
          </label>
          <label className="inline-flex">
            <input type="radio" value="No" {...register("emergency", { required: true })} className="mr-1" /> No
          </label>
          {errors.emergency && <p className="text-red-500 text-sm">This field is required</p>}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-[#13294B] mb-2">Preferred Luminaire Type(s) / Model(s)</h3>
      <input placeholder="" {...register("luminaireType")} className="w-full border border-gray-300 p-3 rounded-lg" />
      {/* <h3 className="text-lg font-semibold text-[#13294B] mb-2">Preferred Wholesaler and Contact</h3>
      <input placeholder="" {...register("preferredWholesaler")} className="w-full border border-gray-300 p-3 rounded-lg" /> */}

      <div>
        <h3 className="text-lg font-semibold text-[#13294B] mb-2">Lighting Standards</h3>
        <label className="inline-flex mr-4">
          <input type="radio" value="Yes" {...register("standardRequired")} className="mr-2" /> Yes
        </label>
        <label className="inline-flex">
          <input type="radio" value="No" {...register("standardRequired")} className="mr-2" /> No
        </label>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#13294B] mb-2">Control <span className="text-red-500">*</span></h3>
        {['Non Dim', 'Phase Cut', 'Dali', 'Specify Dali System onsite'].map(option => (
          <label key={option} className="block">
            <input type="radio" value={option} {...register("control", { required: true })} className="mr-2" /> {option}
          </label>
        ))}
        {errors.control && <p className="text-red-500 text-sm">This field is required</p>}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-[#13294B] mb-2">Product List</h3>
        {fields.map((item, index) => {
          const selectedCat = watchProducts?.[index]?.category;
          const availableProducts = productOptions[selectedCat] || [];

          return (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <select {...register(`products.${index}.category`, { required: true })} className="border border-gray-300 p-3 rounded-lg">
                <option value="" className="text-gray-400">Select Category</option>
                {Object.keys(productOptions).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select {...register(`products.${index}.product`, { required: true })} className="border border-gray-300 p-3 rounded-lg">
                <option value="" className="text-gray-400">{selectedCat ? "Select Product" : "Select category first"}</option>
                {availableProducts.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button type="button" onClick={() => remove(index)} className="text-white font-semibold rounded-full bg-[#00b388] hover:bg-[#045542]">Remove</button>
            </div>
          );
        })}

        <button type="button" onClick={() => append({ category: "", product: "" })} className="text-[#00B388] underline">
          + Add Product
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#13294B] mb-2">Other Information</label>
        <textarea {...register("otherInfo")} className="w-full border border-gray-300 p-3 rounded-lg" rows={4}></textarea>
      </div>


      <div>
        <label className="block text-sm font-medium text-[#13294B] mb-2">
          Attached Drawings <span className="text-red-500">(Multi-Select)</span>
        </label>
        <div className="flex flex-wrap gap-4">
          {drawingOptions.map(option => (
            <label key={option} className="inline-flex items-center">
              <input
                type="checkbox"
                value={option}
                {...register("attachedDrawings", { required: true })}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
        {errors.attachedDrawings && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </div>

       <div className="mt-6">
        <label className="block text-sm font-medium text-[#13294B] mb-2">
          Upload Drawing Files (up to 5 files, max 50MB each)
        </label>
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg bg-gray-50 text-center">
          <input
            type="file"
            multiple
            accept=".pdf,.dwg,.jpg,.jpeg,.png,.svg,.zip,.rar"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#00B388] file:text-white hover:file:bg-[#00a177]"
          />
          {uploadedFiles.length > 0 && (
            <ul className="mt-4 text-left">
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-700 text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      <div className="flex justify-between pt-6">
        <button type="button" onClick={onBack} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400">
          Back
        </button>
        <button type="submit" onClick={submitHandler} className="bg-[#00B388] hover:bg-[#00a177] text-white px-6 py-2 rounded-lg font-semibold">
          Next
        </button>
      </div>
    </div>
  );
}
