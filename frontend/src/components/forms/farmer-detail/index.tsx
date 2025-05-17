import { Box } from "@mui/material";
import { FarmerDetailStepper, FormContext } from "./form-stepper";

const FarmerDetailForm = () => {
  const steps: FormContext[] = [
    {
      formKey: "farm-detail",
      title: "Farm Detail",
      formComponent: <div>Farm Detail Form</div>,
      currentStepValidator: () => true,
    },
    {
      formKey: "crop-detail",
      title: "Crop Detail",
      formComponent: <div>Crop Detail Form</div>,
      currentStepValidator: () => true,
    },
    {
      formKey: "review",
      title: "Review",
      formComponent: <div>Review Form</div>,
      currentStepValidator: () => true,
    },
  ];
  return (
    <Box>
      <FarmerDetailStepper steps={steps} />
    </Box>
  );
};

export default FarmerDetailForm;
