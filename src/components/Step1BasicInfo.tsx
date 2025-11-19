import React, { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { wholesalersData } from "./wholesalersData";

export default function Step1BasicInfo({ onNext }) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();

  const selectedTerritory = useWatch({ control, name: "territory" });

  useEffect(() => {
    setValue("wholesaler", "");
  }, [selectedTerritory, setValue]);

  const submitHandler = async (data) => {
    console.log("Step 1 Data:", data);

    const sfData = new URLSearchParams();

    // 固定字段 salesforce case的字段的网址中的代码
    sfData.append("orgid", "00D6F000000FxAK");
    sfData.append("retURL", "https://www.google.com");

    // 联系人信息
    sfData.append("00NOa000003T5B7", data.email);
    sfData.append("ContactEmail", data.email);
    sfData.append("Contact",data.contactName) //有问题
    sfData.append("ContactPhone", data.phone);
    

    sfData.append("recordType", "012Oa000005RfCHIA0");

    // 案件信息
    sfData.append("subject", data.subject || "Lighting Design Request");
    sfData.append("description", data.description || "Lighting Design Test Description");
    sfData.append("priority", data.priority || "Medium"); //有
    sfData.append("status", data.status || "Open");
    sfData.append("00NOa00000GF91l", data.territory);
    sfData.append("00NOa00000GFHz3",data.address.line1);
    sfData.append("00NOa00000GFFpD",data.address.line2);
    sfData.append("00NOa00000GFMjl",data.address.city);
    sfData.append("00NOa00000GFESx",data.address.state);
    sfData.append("00NOa00000GFKZu",data.address.postalCode);
    sfData.append("00NOa00000GFNCn", data.address.country);


    // 自定义字段
    sfData.append("00NOa000003THuz", data.role);         // Role
    sfData.append("00NOa00000F6vOR", data.projectName);  // Project Name
    sfData.append("00N6F00000HjgSL", data.wholesaler);   // Wholesaler 


    sfData.append("debug", "1");
    sfData.append("debugEmail", "liangceli@kasta.com.au");

    try {
      await fetch(
      "https://webto.salesforce.com/servlet/servlet.WebToCase?encoding=UTF-8",
      {
        method: "POST",
        body: sfData,
        mode: "no-cors",
      }
    );
    alert("✅ Case created successfully!");
    onNext(data);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit to Salesforce.");
    }
    // onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-8 w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-[#13294B] mb-6">Step 1 - Basic Project Information</h2>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            {...register("role", { required: true })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]"
          >
            <option value="" className="text-gray-400">--- Select role ---</option>
            <option value="Builder">Builder</option>
            <option value="Homeowner">Homeowner</option>
            <option value="Contractor">Contractor</option>
            <option value="Wholesaler">Wholesaler</option>
            <option value="Interior Designer">Interior Designer</option>
            <option value="others">others</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm mt-1">This field is required</p>}
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Priority Case</label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input type="radio" value="High" {...register("priority")} className="mr-2" /> High
            </label>
            <label className="inline-flex items-center">
              <input type="radio" value="Medium" {...register("priority")} className="mr-2" /> Medium
            </label>
            <label className="inline-flex items-center">
              <input type="radio" value="Low" {...register("priority")} className="mr-2" /> Low
            </label>
          </div>
        </div>

        {/* Territory */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Territory <span className="text-red-500">*</span>
          </label>
          <select
            {...register("territory", { required: true })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]"
          >
            <option value="" disabled hidden>Select a Territory</option>
            {Object.keys(wholesalersData).map((territory) => (
              <option key={territory} value={territory}>{territory}</option>
            ))}
          </select>
          {errors.territory && <p className="text-red-500 text-sm mt-1">Territory is required</p>}
        </div>

        {/* Wholesaler */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Wholesaler <span className="text-red-500">*</span>
          </label>
          <select
            {...register("wholesaler", { required: true })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]"
            disabled={!selectedTerritory}
            >
            <option value="" disabled hidden>
                {selectedTerritory ? "Select a Wholesaler" : "Choose a Territory first"}
            </option>
            {selectedTerritory &&
                wholesalersData[selectedTerritory]?.map((wholesaler) => (
                <option key={wholesaler} value={wholesaler}>
                    {wholesaler}
                </option>
                ))}
            </select>
          {errors.wholesaler && <p className="text-red-500 text-sm mt-1">Wholesaler is required</p>}
        </div>

        {/* Contact Name */}
        <div>
          <label>Contact Name</label>
          <input type="text" {...register("contactName")} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]" />
        </div>

        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Project Name</label>
          <input type="text" {...register("projectName")} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]" />
        </div>

        {/* description */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Description</label>
          <textarea
            {...register("description")}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]"
            rows={4}
            placeholder="Type description here..."
          />

        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Address <span className="text-red-500">*</span></label>
          <input type="text" placeholder="Address Line 1" {...register("address.line1", { required: true })} className="w-full border border-gray-300 p-3 rounded-lg mb-3" />
          <input type="text" placeholder="Address Line 2" {...register("address.line2")} className="w-full border border-gray-300 p-3 rounded-lg mb-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <input type="text" placeholder="City" {...register("address.city")} className="border border-gray-300 p-3 rounded-lg" />
            <input type="text" placeholder="State / Province / Region" {...register("address.state")} className="border border-gray-300 p-3 rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Postal Code" {...register("address.postalCode")} className="border border-gray-300 p-3 rounded-lg" />
            <select {...register("address.country")} className="border border-gray-300 p-3 rounded-lg">
              <option value="" className="text-gray-400">--- Select country ---</option>
              <option value="Australia">Australia</option>
              <option value="New Zealand">New Zealand</option>
            </select>
          </div>
          {errors.address?.line1 && <p className="text-red-500 text-sm mt-2">Address Line 1 is required</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Contact Phone <span className="text-red-500">*</span></label>
          <input type="tel" {...register("phone", { required: true })} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]" />
          {errors.phone && <p className="text-red-500 text-sm mt-1">This field is required</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">Contact Email <span className="text-red-500">*</span></label>
          <input type="email" {...register("email", { required: true })} className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]" />
          {errors.email && <p className="text-red-500 text-sm mt-1">This field is required</p>}
        </div>

        {/* Next Button */}
        <div className="pt-4 text-right">
          <button type="submit" className="bg-[#00B388] hover:bg-[#00a177] text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}