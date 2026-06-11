import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Step1BasicInfo from "../components/Step1BasicInfo";
import Step2Transport from "../components/Step2BasicInfo";
import Step3LightingDesign from "../components/Step3LightingInfo";
import PreSubmissionChecklist from "../components/PreSubmissionChecklist";

export default function MultiStepForm() {
  const methods = useForm({
    defaultValues: {
      role: "",
      wholesaler: "",
      address: "",
      contact: "",
      contractor: "",
      activeTender: "",
      linkToOpportunity: "",
      opportunityExists: "",
      opportunityId: "",
      salesEmployee: "",
      probability: "",
      salesTerritory: "",
      estimatedValue: "",
      estimatedSupplyDate: "",
      dropdown: "",
      size: { length: "", width: "", height: "" },
      reflectance: { ceiling: "70", wall: "50", floor: "20" },
      workplaneHeight: "",
      illuminance: "",
      emergency: "",
      spacing: { row: "", col: "" },
      luminaireType: "",
      preferredWholesaler: "",
      standardRequired: "",
      control: "",
      products: [{ itemNo: "" }],
      otherInfo: "",
    },
  });

  const [step, setStep] = useState(1);
  const [collectedData, setCollectedData] = useState({});

  const nextStep = (stepData) => {
    setCollectedData((prev) => ({ ...prev, ...stepData }));
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleFinalSubmit = (data) => {
    const final = { ...collectedData, ...data };
    console.log("Final Submission JSON:", final);
  };

  return (
    <FormProvider {...methods}>
      {step === 1 && <Step1BasicInfo onNext={nextStep} />}
      {step === 2 && <Step2Transport onNext={nextStep} onBack={prevStep} />}
      {step === 3 && (
        <Step3LightingDesign
          onNext={nextStep}
          onBack={prevStep}
          transportData={collectedData}
        />
      )}
      {step === 4 && <PreSubmissionChecklist onSubmit={handleFinalSubmit} onBack={prevStep} />}
    </FormProvider>
  );
}
