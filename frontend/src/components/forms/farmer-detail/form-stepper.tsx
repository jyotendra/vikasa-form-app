import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { Stack } from "@mui/material";

export interface FormContext {
  formKey: string;
  title: string;
  formComponent: React.ReactNode;
  currentStepValidator: () => boolean;
}

interface FarmerDetailStepperProps {
  steps: FormContext[];
}

export const FarmerDetailStepper = (props: FarmerDetailStepperProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (props.steps[activeStep].currentStepValidator()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleSubmit = () => {};

  return (
    <Stack sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {props.steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Stack direction="column">{props.steps[activeStep].formComponent}</Stack>
      <Stack direction="row">
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep === props.steps.length - 1 ? (
          <Button onClick={handleSubmit}>Submit</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </Stack>
    </Stack>
  );
};
