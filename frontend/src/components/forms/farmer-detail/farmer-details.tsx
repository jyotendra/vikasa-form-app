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

export const DetailedFarmerInfoForm = (props: DetailedFarmerInfoFormProps) => {
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
    navigate("../step3");
  };

  const handleBack = () => {
    props.stepBack();
    navigate("../step1");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
        <Controller
          name="farmCategory"
          control={control}
          render={({ field }) => (
            <>
              <Select
                {...field}
                defaultValue={FarmCategory.SMALL}
                error={!!formErrors.farmCategory}
                fullWidth
              >
                {Object.values(FarmCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.farmCategory && (
                <span style={{ color: "red" }}>
                  {formErrors.farmCategory.message}
                </span>
              )}
            </>
          )}
        />

        <Controller
          name="farmerSocialCategory"
          control={control}
          render={({ field }) => (
            <>
              <Select
                {...field}
                defaultValue={FarmerSocialCategory.OC}
                error={!!formErrors.farmerSocialCategory}
                fullWidth
              >
                {Object.values(FarmerSocialCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.farmerSocialCategory && (
                <span style={{ color: "red" }}>
                  {formErrors.farmerSocialCategory.message}
                </span>
              )}
            </>
          )}
        />

        <TextField
          {...register("totalFamilyMembers", { valueAsNumber: true })}
          placeholder="Total Family Members"
          type="number"
          error={!!formErrors.totalFamilyMembers}
          helperText={formErrors.totalFamilyMembers?.message}
          fullWidth
        />

        <TextField
          {...register("totalMaleMembers", { valueAsNumber: true })}
          placeholder="Total Male Members"
          type="number"
          error={!!formErrors.totalMaleMembers}
          helperText={formErrors.totalMaleMembers?.message}
          fullWidth
        />

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
