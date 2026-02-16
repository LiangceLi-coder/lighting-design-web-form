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
  "Commercial Office - Ceiling",
  "Commercial Office - Task",
  "Commercial - Common Areas",
  "Multi-Residential",
  "Industrial - High Bay",
  "Industrial - Low Bay",
  "Education - Classroom",
  "Education - Lecture Theatres",
  "Medical - Clean Room",
  "Sports Lighting - Recreational",
  "Sports Lighting - Training",
  "Sports Lighting - Professional",
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
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const linkToOpportunity = useWatch({ control, name: "linkToOpportunity" });
  const opportunityExists = useWatch({ control, name: "opportunityExists" });
  const selectedAreaType = useWatch({ control, name: "dropdown" });

  useEffect(() => {
    setShowOpportunityFields(linkToOpportunity === "Yes");
  }, [linkToOpportunity]);

  const businessdivision = ["Haneco", "Lucesco", "Kasta"];

  const handleNextClick = async () => {
    const fieldsToValidate = [
      "contractor",
      "activeTender",
      "salesTerritory",
      "estimatedValue",
      "estimatedSupplyDate",
      "dropdown",
    ];

    if (areaTypesWithSubSelection.includes(selectedAreaType)) {
      fieldsToValidate.push("sportsArea");
    }

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
    <div className="form-page">
      <div className="form-panel animate-fade">
        <h2 className="section-title">Step 2 Sales-related Information</h2>

        <div>
          <label>
            Contractor <span className="badge-required">Required</span>
          </label>
          <input type="text" {...register("contractor", { required: true })} />
          {errors.contractor && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        <div>
          <label>
            Active Tender <span className="badge-required">Required</span>
          </label>
          <div className="form-grid grid-2">
            <label>
              <input type="radio" value="Yes" {...register("activeTender", { required: true })} />
              Yes
            </label>
            <label>
              <input type="radio" value="No" {...register("activeTender", { required: true })} />
              No
            </label>
          </div>
          {errors.activeTender && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        <div>
          <label>
            Link to Salesforce Opportunity <span className="badge-required">Required</span>
          </label>
          <div className="form-grid grid-2">
            <label>
              <input type="radio" value="Yes" {...register("linkToOpportunity", { required: true })} />
              Yes
            </label>
            <label>
              <input type="radio" value="No" {...register("linkToOpportunity", { required: true })} />
              No
            </label>
          </div>
          {errors.linkToOpportunity && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {showOpportunityFields && (
          <div className="form-grid">
            <div>
              <label>The opportunity is existing</label>
              <select {...register("opportunityExists", { required: true })}>
                <option value="" className="text-gray-400">
                  Select option
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No, create a new opportunity</option>
              </select>
              {errors.opportunityExists && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>

            {opportunityExists === "Yes" && (
              <div className="relative">
                <label>Search Opportunity</label>
                <div className="input-with-spinner">
                  <input
                    type="text"
                    placeholder="Type keyword to search..."
                    onChange={async (e) => {
                      const keyword = e.target.value.trim();

                      if (keyword.length < 2) {
                        setSearchResults([]);
                        setIsSearching(false);
                        return;
                      }

                      setIsSearching(true);
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
                      } finally {
                        setIsSearching(false);
                      }
                    }}
                  />
                  {isSearching && <span className="loading-spinner" aria-label="Loading" />}
                </div>

                {searchResults.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-200 w-full rounded-xl mt-2 max-h-64 overflow-y-auto shadow-lg">
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
                        <p className="font-medium text-gray-900">{opp.name}</p>
                        <p className="text-sm text-gray-500">
                          Stage: {opp.stageName} � Close: {opp.closeDate}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {selectedOpportunity && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="font-semibold">Selected Opportunity:</p>
                    <p className="text-sm text-gray-700">{selectedOpportunity.name}</p>
                    <p className="text-xs text-gray-500">ID: {selectedOpportunity.id}</p>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOpportunity(null);
                      }}
                      className="btn-outline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <input type="hidden" {...register("opportunityId", { required: true })} />
                {errors.opportunityId && (
                  <p className="text-red-500 text-sm mt-1">This field is required</p>
                )}
              </div>
            )}

            {opportunityExists === "No" && (
              <div>
                <label>
                  Business Division <span className="badge-required">Required</span>
                </label>
                <select {...register("businessdivision", { required: true })}>
                  {businessdivision.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
                {errors.businessdivision && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label>
                  Opportunity Name <span className="badge-required">Required</span>
                </label>
                <input type="text" {...register("opportunityname", { required: true })} />
                {errors.opportunityname && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label>
                  Close Date <span className="badge-required">Required</span>
                </label>
                <input type="date" {...register("closedate", { required: true })} />
                {errors.closedate && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}

                <label>
                  Stage <span className="badge-required">Required</span>
                </label>
                <select {...register("stage")}>
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

                <label>
                  Probability (%) <span className="badge-required">Required</span>
                </label>
                <input type="number" min={0} max={100} {...register("probability", { required: true })} />
                {errors.probability && (
                  <p className="text-red-500 text-sm">This field is required</p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="form-grid grid-2">
          <div>
            <label>Sales Territory</label>
            <select {...register("salesTerritory")}>
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
            <label>Estimated Value (Haneco)</label>
            <input type="number" step="0.01" {...register("estimatedValue")} />
          </div>
        </div>

        <div>
          <label>Estimated Supply Date</label>
          <input type="date" {...register("estimatedSupplyDate")} />
        </div>

        <div>
          <label>
            Please select area type <span className="badge-required">Required</span>
          </label>
          <select {...register("dropdown", { required: true })}>
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
            <option value="Conference/Meeting Rooms">Conference/Meeting Rooms</option>
            <option value="Medical - Wards">Medical - Wards</option>
            <option value="Other Areas [PLEASE SPECIFY]">Other Areas [PLEASE SPECIFY]</option>
            <option value="Sports Lighting - Outdoors">Sports Lighting - Outdoors</option>
            <option value="Sports Lighting - Indoors">Sports Lighting - Indoors</option>
          </select>
          {errors.dropdown && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}
        </div>

        {areaTypesWithSubSelection.includes(selectedAreaType) && (
          <div>
            <label>
              LDR Category <span className="badge-required">Required</span>
            </label>
            <select {...register("sportsArea", { required: true })}>
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

        <div className="action-row">
          <button type="button" onClick={onBack} className="btn-outline">
            Back
          </button>
          <button type="button" onClick={handleNextClick} className="btn-accent">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
