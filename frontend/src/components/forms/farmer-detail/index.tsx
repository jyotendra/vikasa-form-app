import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Stack } from "@mui/material";
import { Route, Routes } from "react-router";
import { BasicFarmerDetailForm } from "./basic-details";
import { DetailedFarmerInfoForm } from "./farmer-details";

interface FarmerDetailStepperProps {
  steps: FormContext[];
}

export interface FormContext {
  title: string;
  path: string;
}

const FarmerDetailStepper = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => (stepValidator: () => boolean) => {
    if (stepValidator()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleSubmit = () => {};

  const steps: FormContext[] = [
    { title: "Basic Farmer Details", path: "basic-farmer-detail" },
    { title: "Detailed Farmer Information", path: "farmer-detail" },
  ];

  return (
    <Stack sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Routes>
        <Route index element={<BasicFarmerDetailForm />} />
        <Route path="farmer-detail" element={<DetailedFarmerInfoForm />} />
      </Routes>
      <Stack direction="row">
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </Stack>
    </Stack>
  );
};

export default FarmerDetailStepper;
