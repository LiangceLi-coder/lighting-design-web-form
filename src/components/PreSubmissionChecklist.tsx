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
  const { getValues,handleSubmit } = useFormContext();
  const formData = getValues();

  const getYesNo = (value) => {
    if (Array.isArray(value)) return value.length > 0 ? "Y" : "N";
    return value ? "Y" : "N";
  };

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
    // sfData.append("00NOa00000GF91l", data.territory);
    sfData.append("00NOa00000GFHz3",data.address.line1);
    sfData.append("00NOa00000GFFpD",data.address.line2);
    sfData.append("00NOa00000GFMjl",data.address.city);
    sfData.append("00NOa00000GFESx",data.address.state);
    sfData.append("00NOa00000GFKZu",data.address.postalCode);
    sfData.append("00NOa00000GFNCn", data.address.country);

    // Step 2 fields
    sfData.append("00NOa00000GItzJ", data.activeTender);
    sfData.append("00N6F00000HjgSL", data.contractor);
    sfData.append("00NOa00000GIus9", data.probability);
    // sfData.append("00NOa00000GIuNW", data.estimatedSupplyDate);
    const rawDate = data.estimatedSupplyDate;

    if (rawDate) {
      const [year, month, day] = rawDate.split("-");
      const sfDate = `${day}/${month}/${year}`;
      sfData.append("00NOa00000GluNW", sfDate);
    }

    sfData.append("00NOa00000GIv8H", data.salesTerritory);
    sfData.append("00NOa00000GIvGL", data.estimatedValue);
    sfData.append("00NOa00000GIvLB", data.dropdown);


    // 自定义字段
    sfData.append("00NOa000003THuz", data.role);         // Role
    sfData.append("00NOa00000F6vOR", data.projectName);  // Project Name
    // sfData.append("00N6F00000HjgSL", data.wholesaler);   // Wholesaler 


    sfData.append("debug", "1");
    sfData.append("debugEmail", "liangceli@kasta.com.au");

    // Step 3
    // ====== 尺寸信息 Size of Area ======
    sfData.append("00NOa00000GIYGZ",  data.size?.length  || "");   // 长度 Length (m)
    sfData.append("00NOa00000GJFBp",   data.size?.width   || "");   // 宽度 Width (m)
    sfData.append("00NOa00000GJFF3",  data.size?.height  || "");   // 高度 Height (m)

    // ====== 反射率 Surface Reflectances ======
    sfData.append("00NOa00000GJFOj", data.reflectance?.ceiling || "");  // Ceiling
    sfData.append("00NOa00000GJFVB",    data.reflectance?.wall    || "");  // Wall
    sfData.append("00NOa00000GJFer",   data.reflectance?.floor   || "");  // Floor

    // ====== 工作平面高度 Workplane Height ======
    sfData.append("00NOa00000GJFuz", data.workplaneHeight || ""); 
    // 可能的值： "Floor", "Desk (0.7m AFFL)", "Bench (0.9m AFFL)", "Other"

    // ====== 照度 Preferred Illuminance Level ======
    sfData.append("00NOa00000GJH7B", data.illuminance || "");  // LUX

    // ====== 应急照明 Emergency Lighting ======
    sfData.append("00NOa00000GJGz7", data.emergency || "");      
    // 可能的值："Yes" / "No"

    // ====== 灯具型号 Preferred Luminaire Type(s) / Model(s) ======
    sfData.append("00NOa00000GJHQX", data.luminaireType || "");

    // ====== Lighting Standards 是否需要标准 ======
    sfData.append("00NOa00000GJG7t", data.standardRequired || ""); 
    // 可能的值："Yes" / "No"

    // ====== 控制方式 Control（必填） ======
    sfData.append("00NOa00000GJGPd", data.control || ""); 
    // 可能的值："Non Dim", "Phase Cut", "Dali", "Specify Dali System onsite"

    sfData.append("00NOa00000GJGe9", data.otherInfo);


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
    // onNext(data);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to submit to Salesforce.");
    }
    // onNext();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="min-h-screen bg-[#F8FAFC] flex justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            disabled={false}
            className="bg-[#00B388] hover:bg-[#00a177] text-white px-6 py-2 rounded-lg font-semibold"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
