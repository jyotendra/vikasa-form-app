import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Stack } from "@mui/material";
import { Navigate, Route, Routes } from "react-router";
import { BasicFarmerDetailForm } from "./basic-details";
import { DetailedFarmerInfoForm } from "./farmer-details";
import {
  basicFarmerDetailType,
  farmerDetailCompleteType,
  farmerDetailFormType,
} from "./form-state";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { Step3 } from "./step3";

export interface FormContext {
  title: string;
  path: string;
}

const FarmerDetailStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const formMethods = useForm<farmerDetailCompleteType>();

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

  const handleSubmit = () => {};

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
                <Step3 stepBack={handleStepBack} stepNext={handleStepNext} />
              }
            />
          </Route>
        </Routes>
      </Stack>
    </Stack>
  );
};

export default FarmerDetailStepper;
