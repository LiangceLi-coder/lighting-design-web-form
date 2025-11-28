import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const areaTypesWithSubSelection = [
  "Sports Lighting - Outdoors",
  "Sports Lighting - Indoors",
];

const sportsAreaOptions = [
  "Aquatic Centres",
  "Baseball/Softball",
  "Bowling Greens",
  "Cricket",
  "Hockey",
  "Football (All Codes)",
  "Multi Purpose Sports Hall",
  "External Carpark",
  "Tennis",
  "Internal Carpark",
  "Squash",
  "Netball/Basketball",
  "Other Areas [PLEASE SPECIFY]",

  // Newly added from Layout
  "Commercial Office – Ceiling",
  "Commercial Office – Task",
  "Commercial – Common Areas",
  "Multi-Residential",
  "Industrial – High Bay",
  "Industrial – Low Bay",
  "Education – Classroom",
  "Education – Lecture Theatres",
  "Medical – Clean Room",
  "Sports Lighting – Recreational",
  "Sports Lighting – Training",
  "Sports Lighting – Professional",
];

export default function Step2Transport({ onNext, onBack }) {
  const {
    register,
    trigger,
    setValue,          
    control,
    formState: { errors },
  } = useFormContext();

  const [showOpportunityFields, setShowOpportunityFields] = useState(false);
  const [isExistingOpportunity, setIsExistingOpportunity] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any | null>(null);

  const linkToOpportunity = useWatch({ control, name: "linkToOpportunity" });
  const opportunityExists = useWatch({ control, name: "opportunityExists" });
  const selectedAreaType = useWatch({ control, name: "dropdown" });

  useEffect(() => {
    setShowOpportunityFields(linkToOpportunity === "Yes");
  }, [linkToOpportunity]);

  useEffect(() => {
    setIsExistingOpportunity(opportunityExists || null);
  }, [opportunityExists]);

  const businessdivision = ["Haneco", "Lucesco", "Kasta"];

  const handleNextClick = async () => {
    const fieldsToValidate: string[] = [
      "contractor",
      "activeTender",
      "salesTerritory",
      "estimatedValue",
      "estimatedSupplyDate",
      "dropdown",
    ];

    // 如果是 sports lighting，要校验 LDR Category
    if (areaTypesWithSubSelection.includes(selectedAreaType)) {
      fieldsToValidate.push("sportsArea");
    }

    // 如果要 link Opportunity，再加上相关字段
    if (linkToOpportunity === "Yes") {
      fieldsToValidate.push("linkToOpportunity", "opportunityExists");

      if (opportunityExists === "Yes") {
        fieldsToValidate.push("opportunityId");
      } else if (opportunityExists === "No") {
        fieldsToValidate.push(
          "businessdivision",
          "opportunityname",
          "closedate",
          "stage",
          "probability"
        );
      }
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-start py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8 w-full max-w-3xl bg-white p-10 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-[#13294B] mb-6">
          Step 2 - Sales-related Information
        </h2>

        {/* Contractor */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Contractor <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("contractor", { required: true })}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00B388]"
          />
          {errors.contractor && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Active Tender */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Active Tender <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="Yes"
                {...register("activeTender", { required: true })}
                className="mr-2"
              />{" "}
              Yes
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="No"
                {...register("activeTender", { required: true })}
                className="mr-2"
              />{" "}
              No
            </label>
          </div>
          {errors.activeTender && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Link to Salesforce Opportunity */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Link to Salesforce Opportunity <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="Yes"
                {...register("linkToOpportunity", { required: true })}
                className="mr-2"
              />{" "}
              Yes
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="No"
                {...register("linkToOpportunity", { required: true })}
                className="mr-2"
              />{" "}
              No
            </label>
          </div>
          {errors.linkToOpportunity && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Conditional Opportunity Fields */}
        {showOpportunityFields && (
          <div className="space-y-4">
            {/* 先选：这个 Opportunity 是否已存在 */}
            <div>
              <label className="block text-sm font-medium text-[#13294B] mb-2">
                The opportunity is existing
              </label>
              <select
                {...register("opportunityExists", { required: true })}
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
              >
                <option value="" className="text-gray-400">
                  Select option
                </option>
                <option value="Yes">Yes</option>
                <option value="No">
                  No, I want to create a new opportunity automatically
                </option>
              </select>
              {errors.opportunityExists && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>

            {/* 情况一：已有 Opportunity -> 搜索 + 选择 */}
            {opportunityExists === "Yes" && (
              <div className="relative">
                <label className="block text-sm font-medium text-[#13294B] mb-2">
                  Search Opportunity
                </label>

                <input
                  type="text"
                  placeholder="Type keyword to search..."
                  className="w-full border border-gray-300 p-3 rounded-lg"
                  onChange={async (e) => {
                    const keyword = e.target.value.trim();
                    setSearchKeyword(keyword);

                    if (keyword.length < 2) {
                      setSearchResults([]);
                      return;
                    }

                    try {
                      const res = await fetch(
                        `https://lighting-design-web-form.onrender.com/api/opportunities?q=${encodeURIComponent(
                          keyword
                        )}`
                      );
                      const data = await res.json();
                      setSearchResults(data || []);
                    } catch (err) {
                      console.error("Search opportunities error:", err);
                      setSearchResults([]);
                    }
                  }}
                />

                {searchResults.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-300 w-full rounded-md mt-1 max-h-64 overflow-y-auto shadow-lg">
                    {searchResults.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setValue("opportunityId", opp.id);
                          setSelectedOpportunity(opp);
                          setSearchResults([]);
                        }}
                      >
                        <p className="font-medium text-[#13294B]">{opp.name}</p>
                        <p className="text-sm text-gray-500">
                          Stage: {opp.stageName} · Close: {opp.closeDate}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedOpportunity && (
                  <div className="mt-3 p-3 bg-[#F1F5F9] rounded-lg border border-gray-300">
                    <p className="font-semibold text-[#13294B]">
                      Selected Opportunity:
                    </p>
                    <p className="text-sm text-gray-700">
                      {selectedOpportunity.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {selectedOpportunity.id}
                    </p> 

                    <button
                      type="button"
                      onClick={()=>{setSelectedOpportunity(null)}}
                      className="text-white font-semibold rounded-full bg-[#00b388] hover:bg-[#045542] w-20 h-8 mt-4"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* 隐藏字段：真正提交到后端的值 */}
                <input
                  type="hidden"
                  {...register("opportunityId", { required: true })}
                />
                {errors.opportunityId && (
                  <p className="text-red-500 text-sm mt-1">
                    This field is required
                  </p>
                )}
              </div>
            )}

            {/* 情况二：要自动创建新的 Opportunity */}
            {opportunityExists === "No" && (
              <div>
                <label className="block text-sm font-medium text-[#13294B] mb-2">
                  Business Division<span className="text-red-500"> *</span>
                </label>
                <select
                  {...register("businessdivision", { required: true })}
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                >
                  {businessdivision.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                {errors.businessdivision && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label className="block text-sm font-medium text-[#13294B] mb-2 mt-2">
                  Opportunity Name<span className="text-red-500"> *</span>
                </label>
                <input
                  type="text"
                  {...register("opportunityname", { required: true })}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
                {errors.opportunityname && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label className="block text-sm font-medium text-[#13294B] mb-2 mt-2">
                  Close Date<span className="text-red-500"> *</span>
                </label>
                <input
                  type="date"
                  {...register("closedate", { required: true })}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
                {errors.closedate && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label className="block text-sm font-medium text-[#13294B] mb-2 mt-2">
                  Stage<span className="text-red-500"> *</span>
                </label>
                <select
                    {...register("stage")}
                    className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
                  >
                    <option value="" className="text-gray-400">
                      Select option
                    </option>
                    <option value="Request">Request</option>
                    <option value="Quote Sent">Quote Sent</option>
                    <option value="Customer Querying Quote">Customer Querying Quote</option>
                    <option value="Order Received">Order Received</option>
                    <option value="Closed">Closed</option>
               </select>
                {errors.stage && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label className="block text-sm font-medium text-[#13294B] mb-2 mt-2">
                  Probability (%)<span className="text-red-500"> *</span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  {...register("probability", { required: true })}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />
                {errors.probability && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Sales Territory and Estimated Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#13294B] mb-2">
              Sales Territory
            </label>
            <select
              {...register("salesTerritory")}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
            >
              <option value="" className="text-gray-400">
                Select option
              </option>
              <option value="SA">SA</option>
              <option value="VIC">VIC</option>
              <option value="NSW">NSW</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="TAS">TAS</option>
              <option value="NT">NT</option>
              <option value="ACT">ACT</option>
              <option value="FNQ">FNQ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#13294B] mb-2">
              Estimated Value (Haneco)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("estimatedValue")}
              className="w-full border border-gray-300 p-3 rounded-lg"
            />
          </div>
        </div>

        {/* Estimated Supply Date */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Estimated Supply Date
          </label>
          <input
            type="date"
            {...register("estimatedSupplyDate")}
            className="w-full border border-gray-300 p-3 rounded-lg"
          />
        </div>

        {/* Area Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-[#13294B] mb-2">
            Please select area type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("dropdown", { required: true })}
            className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
          >
            <option value="" className="text-gray-400">
              Select option
            </option>
            <option value="Office Areas with ceiling lights only">
              Office Areas with ceiling lights only
            </option>
            <option value="Office Areas with individual Task Lights at desk">
              Office Areas with individual Task Lights at desk
            </option>
            <option value="Warehouse areas">Warehouse areas</option>
            <option value="Industrial Task Areas/Workshops">
              Industrial Task Areas/Workshops
            </option>
            <option value="Entry Foyer/Reception">Entry Foyer/Reception</option>
            <option value="Plant Rooms">Plant Rooms</option>
            <option value="External Carpark">External Carpark</option>
            <option value="Internal Carpark">Internal Carpark</option>
            <option value="Corridors & Circulation Areas">
              Corridors & Circulation Areas
            </option>
            <option value="Conference/Meeting Rooms">
              Conference/Meeting Rooms
            </option>
            <option value="Medical - Wards">Medical - Wards</option>
            <option value="Other Areas [PLEASE SPECIFY]">
              Other Areas [PLEASE SPECIFY]
            </option>
            <option value="Sports Lighting - Outdoors">
              Sports Lighting - Outdoors
            </option>
            <option value="Sports Lighting - Indoors">
              Sports Lighting - Indoors
            </option>
          </select>
          {errors.dropdown && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {/* Secondary Dropdown for Sports Area */}
        {areaTypesWithSubSelection.includes(selectedAreaType) && (
          <div>
            <label className="block text-sm font-medium text-[#13294B] mb-2">
              LDR Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("sportsArea", { required: true })}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-700"
            >
              <option value="" className="text-gray-400">
                --- Please select area type ---
              </option>
              {sportsAreaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            {errors.sportsArea && (
              <p className="text-red-500 text-sm">This field is required</p>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNextClick}
            className="bg-[#00B388] hover:bg-[#00a177] text-white px-6 py-2 rounded-lg font-semibold"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
