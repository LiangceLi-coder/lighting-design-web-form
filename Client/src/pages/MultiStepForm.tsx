import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Step1BasicInfo from "../components/Step1BasicInfo";
import Step2Transport from "../components/Step2BasicInfo";
import Step3LightingDesign from "../components/Step3LightingInfo";
import PreSubmissionChecklist from "../components/PreSubmissionChecklist";
import FinishPage from "./FinishPage";

const DRAFT_STORAGE_KEY = "lighting-design-form-draft";

const defaultValues = {
  role: "",
  wholesaler: "",
  address: "",
  contact: "",
  contractor: "",
  activeTender: "",
  linkToOpportunity: "",
  opportunityExists: "",
  opportunityId: "",
  opportunitySearchName: "",
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
};

function loadDraft() {
  try {
    const savedDraft = JSON.parse(localStorage.getItem(DRAFT_STORAGE_KEY));
    const step = Number(savedDraft?.step);

    return {
      step: step >= 1 && step <= 4 ? step : 1,
      values: savedDraft?.values ? { ...defaultValues, ...savedDraft.values } : defaultValues,
    };
  } catch {
    return { step: 1, values: defaultValues };
  }
}

function saveDraft(step, values) {
  try {
    const serializableValues = { ...values };
    delete serializableValues.drawingFiles;
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ step, values: serializableValues })
    );
  } catch (error) {
    console.error("Unable to save form draft:", error);
  }
}

export default function MultiStepForm() {
  const [initialDraft] = useState(loadDraft);
  const methods = useForm({
    defaultValues: initialDraft.values,
  });

  const [step, setStep] = useState(initialDraft.step);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    saveDraft(step, methods.getValues());
  }, [methods, step]);

  useEffect(() => {
    const subscription = methods.watch((values) => saveDraft(step, values));
    return () => subscription.unsubscribe();
  }, [methods, step]);

  const nextStep = () => setStep((prev) => prev + 1);

  const prevStep = () => setStep((prev) => prev - 1);

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  const resetForm = () => {
    clearDraft();
    methods.reset(defaultValues);
    setSubmissionResult(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleSubmissionComplete = (result) => {
    clearDraft();
    methods.reset(defaultValues);
    setSubmissionResult(result);
    setStep(5);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <FormProvider {...methods}>
      {step === 1 && <Step1BasicInfo onNext={nextStep} />}
      {step === 2 && <Step2Transport onNext={nextStep} onBack={prevStep} />}
      {step === 3 && (
        <Step3LightingDesign onNext={nextStep} onBack={prevStep} />
      )}
      {step === 4 && (
        <PreSubmissionChecklist
          onSubmissionComplete={handleSubmissionComplete}
          onBack={prevStep}
        />
      )}
      {step === 5 && (
        <FinishPage result={submissionResult} onReturnHome={resetForm} />
      )}
    </FormProvider>
  );
}
