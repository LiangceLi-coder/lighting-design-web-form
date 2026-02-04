import React, { useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function Step3LightingDesign({ onBack, onNext }) {
  const {
    register,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://lighting-design-web-form.onrender.com/api/products");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Failed to load /api/products:", err);
      }
    };
    fetchProducts();
  }, []);

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
    ]);

    if (!isValid) return;
    onNext();
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 50 * 1024 * 1024);
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

  const drawingOptions = ["CAD", "Sketch", "Google Earth", "PDF", "REVIT", "None Provided"];

  return (
    <div className="form-page">
      <div className="form-panel animate-fade">
        <h2 className="section-title">Step 3 Lighting Design Requirements</h2>

        <h3 className="section-subtitle">Size of Area</h3>
        <div className="form-grid grid-3">
          <input placeholder="Length (m)" type="number" {...register("size.length")} />
          <input placeholder="Width (m)" type="number" {...register("size.width")} />
          <input placeholder="Height (m)" type="number" {...register("size.height")} />
        </div>

        <div>
          <h3 className="section-subtitle">Surface Reflectances</h3>
          <div className="form-grid grid-3">
            <input placeholder="Ceiling" {...register("reflectance.ceiling")} />
            <input placeholder="Wall" {...register("reflectance.wall")} />
            <input placeholder="Floor" {...register("reflectance.floor")} />
          </div>
        </div>

        <div>
          <label>Workplane Height</label>
          <div className="form-grid grid-2">
            {["Floor", "Desk (0.7m AFFL)", "Bench (0.9m AFFL)", "Other"].map((option) => (
              <label key={option}>
                <input type="radio" value={option} {...register("workplaneHeight")} /> {option}
              </label>
            ))}
          </div>
        </div>

        <h3 className="section-subtitle">Preferred Illuminance Level</h3>
        <div className="form-grid grid-2">
          <input placeholder="LUX" {...register("illuminance")} />
          <div>
            <label>
              Emergency Lighting <span className="badge-required">Required</span>
            </label>
            <div className="form-grid grid-2">
              <label>
                <input type="radio" value="Yes" {...register("emergency", { required: true })} />
                Yes
              </label>
              <label>
                <input type="radio" value="No" {...register("emergency", { required: true })} />
                No
              </label>
            </div>
            {errors.emergency && <p className="text-red-500 text-sm">This field is required</p>}
          </div>
        </div>

        <h3 className="section-subtitle">Preferred Luminaire Type(s) / Model(s)</h3>
        <input placeholder="Type model or series" {...register("luminaireType")} />

        <div>
          <label>Lighting Standards</label>
          <div className="form-grid grid-2">
            <label>
              <input type="radio" value="Yes" {...register("standardRequired")} /> Yes
            </label>
            <label>
              <input type="radio" value="No" {...register("standardRequired")} /> No
            </label>
          </div>
        </div>

        <div>
          <label>
            Control <span className="badge-required">Required</span>
          </label>
          <div className="form-grid grid-2">
            {["Non Dim", "Phase Cut", "Dali", "Specify Dali System onsite"].map((option) => (
              <label key={option}>
                <input type="radio" value={option} {...register("control", { required: true })} /> {option}
              </label>
            ))}
          </div>
          {errors.control && <p className="text-red-500 text-sm">This field is required</p>}
        </div>

        <div>
          <h3 className="section-subtitle">Product List</h3>

          {fields.map((item, index) => (
            <div key={item.id} className="form-grid grid-2">
              <input
                list={`products-list-${index}`}
                {...register(`products.${index}.itemNo`, { required: true })}
                placeholder="Type to search product..."
              />

              <datalist id={`products-list-${index}`}>
                {allProducts.map((p) => (
                  <option key={p.itemNo} value={p.itemNo}>
                    {p.itemNo} | {p.name} | {p.status}
                  </option>
                ))}
              </datalist>

              <button type="button" onClick={() => remove(index)} className="btn-outline">
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={() => append({ itemNo: "" })} className="btn-outline">
            + Add Product
          </button>
        </div>

        <div>
          <label>Other Information</label>
          <textarea {...register("otherInfo")} rows={4} />
        </div>

        <div>
          <label>
            Attached Drawings <span className="badge-required">Required</span>
          </label>
          <div className="form-grid grid-3">
            {drawingOptions.map((option) => (
              <label key={option}>
                <input type="checkbox" value={option} {...register("attachedDrawings", { required: true })} />
                {option}
              </label>
            ))}
          </div>
          {errors.attachedDrawings && (
            <p className="text-red-500 text-sm mt-1">This field is required</p>
          )}
        </div>

        <div>
          <label>Upload Drawing Files (up to 5 files, max 50MB each)</label>
          <div className="upload-zone">
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
                  <li key={index} className="flex items-center justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-700 text-sm">{file.name}</span>
                    <button type="button" onClick={() => removeFile(index)} className="btn-outline">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="action-row">
          <button type="button" onClick={onBack} className="btn-outline">
            Back
          </button>
          <button type="submit" onClick={submitHandler} className="btn-accent">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
