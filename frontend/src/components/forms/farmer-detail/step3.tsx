import { Button, MenuItem, Select, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSetAtom } from "jotai";
import { atom } from "jotai";
import {
  farmerDetailFormSchema,
  FarmCategory,
  FarmerSocialCategory,
  farmerDetailFormAtom,
} from "./form-state"; // Assuming form-state.ts contains these

// Create type from schema
export type FarmerDetailFormType = z.infer<typeof farmerDetailFormSchema>;

interface DetailedFarmerInfoFormProps {
  stepBack: () => void;
  stepNext: () => void;
}

export const Step3 = (props: DetailedFarmerInfoFormProps) => {
  const setFormState = useSetAtom(farmerDetailFormAtom);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors },
  } = useForm<FarmerDetailFormType>({
    defaultValues: {
      farmCategory: FarmCategory.SMALL,
      farmerSocialCategory: FarmerSocialCategory.OC,
      totalFamilyMembers: 1,
      totalMaleMembers: 0,
    },
    resolver: zodResolver(farmerDetailFormSchema),
  });

  let navigate = useNavigate();

  const onSubmit = (data: FarmerDetailFormType) => {
    setFormState(data);
    if (props.stepNext) {
      props.stepNext();
    }
    navigate("/form/farmer-detail");
  };

  const handleBack = () => {
    props.stepBack();
    navigate("../step2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
        <TextField label="Just for test" />

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBack}
          sx={{ marginRight: 2 }}
        >
          Back
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Next
        </Button>
      </Stack>
    </form>
  );
};
