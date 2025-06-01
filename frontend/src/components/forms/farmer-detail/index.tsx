import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { BasicFarmerDetailForm } from "./basic-details";
import { DetailedFarmerInfoForm } from "./farmer-details";
import {
  basicFarmerDetailType,
  farmerDetailCompleteType,
  farmerDetailFormType,
} from "./form-state";
import { useCallback } from "react";
import { PreviewAndSubmit } from "./step3";

export interface FormContext {
  title: string;
  path: string;
}

const FarmerDetailStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  /** form states */
  const [basicFormState, setBasicFormState] =
    useState<basicFarmerDetailType | null>(null);

  const [detailedFarmerFormState, setDetailedFarmerFormState] =
    useState<farmerDetailFormType | null>(null);

  const handleStepBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, [setActiveStep]);

  const handleStepNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, [setActiveStep]);

  const finalFormState = useMemo<farmerDetailCompleteType>(() => {
    return {
      basicFarmerDetails: basicFormState!,
      detailedFarmerInfo: detailedFarmerFormState!,
    };
  }, [basicFormState, detailedFarmerFormState]);

  const location = useLocation();

  useEffect(() => {
    const { remount } = location.state || {};
    if (remount) {
      console.log("Renewing form state");
      // reset all form states
      setBasicFormState(null);
      setDetailedFarmerFormState(null);
      setActiveStep(0);
    }
  }, [location.state]);

  const steps: FormContext[] = [
    { title: "Basic Farmer Details", path: "basic-farmer-detail" },
    { title: "Detailed Farmer Information", path: "farmer-detail" },
  ];

  return (
    <Stack>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack direction="column" sx={{ mt: 8, width: "100%" }}>
        <Routes>
          <Route path="">
            <Route path="" element={<Navigate to="step1" replace />} />
            <Route
              path="step1"
              element={
                <BasicFarmerDetailForm
                  stepNext={handleStepNext}
                  formData={basicFormState}
                  setFormData={setBasicFormState}
                />
              }
            />
            <Route
              path="step2"
              element={
                <DetailedFarmerInfoForm
                  stepBack={handleStepBack}
                  stepNext={handleStepNext}
                  formData={detailedFarmerFormState}
                  setFormData={setDetailedFarmerFormState}
                />
              }
            />
            <Route
              path="step3"
              element={
                <PreviewAndSubmit
                  stepBack={handleStepBack}
                  finalFormData={finalFormState}
                />
              }
            />
          </Route>
        </Routes>
      </Stack>
    </Stack>
  );
};

export default FarmerDetailStepper;
