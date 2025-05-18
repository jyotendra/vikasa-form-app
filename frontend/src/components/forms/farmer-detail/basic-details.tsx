import { Button, Input, Select, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  basicFarmerDetailAtom,
  basicFarmerDetailsSchema,
  basicFarmerDetailType,
  RelationType,
} from "./form-state";
import { zodResolver } from "@hookform/resolvers/zod";

interface BasicFarmerDetailFormProps {
  stepNext: () => void;
  formData: basicFarmerDetailType | null;
  setFormData: React.Dispatch<
    React.SetStateAction<basicFarmerDetailType | null>
  >;
}

export const BasicFarmerDetailForm = (props: BasicFarmerDetailFormProps) => {
  const { formData, setFormData, stepNext } = props;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors: formErrors },
  } = useForm<basicFarmerDetailType>({
    defaultValues: {
      farmerName: formData?.farmerName || "",
      relationType: formData?.relationType || RelationType.SO,
      relationName: formData?.relationName || "",
      cluster: formData?.cluster || "",
      village: formData?.village || "",
      mobileNumber: formData?.mobileNumber || "",
    },
    resolver: zodResolver(basicFarmerDetailsSchema),
  });

  let navigate = useNavigate();

  const onSubmit = (data: any) => {
    setFormData(data);
    stepNext();
    navigate("../step2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
        <TextField
          {...register("farmerName")}
          placeholder="First Name"
          error={!!formErrors.farmerName}
          helperText={formErrors.farmerName?.message}
          fullWidth
        />
        <Controller
          name="relationType"
          control={control}
          render={({ field }) => (
            <>
              <Select
                {...field}
                defaultValue={RelationType.SO}
                error={!!formErrors.relationType}
              >
                <option value={RelationType.SO}>s/o</option>
                <option value={RelationType.WO}>w/o</option>
                <option value={RelationType.DO}>d/o</option>
              </Select>
              {formErrors.relationType && (
                <span style={{ color: "red" }}>
                  {formErrors.relationType.message}
                </span>
              )}
            </>
          )}
        />
        <TextField
          {...register("relationName")}
          placeholder="Relation Name"
          error={!!formErrors.relationName}
          helperText={formErrors.relationName?.message}
        />
        <TextField
          {...register("cluster")}
          placeholder="Cluster"
          error={!!formErrors.cluster}
          helperText={formErrors.cluster?.message}
        />
        <TextField
          {...register("village")}
          placeholder="Village"
          error={!!formErrors.village}
          helperText={formErrors.village?.message}
        />
        <TextField
          {...register("mobileNumber")}
          placeholder="Mobile Number"
          error={!!formErrors.mobileNumber}
          helperText={formErrors.mobileNumber?.message}
          type="tel"
        />
        <Button type="submit">Next</Button>
      </Stack>
    </form>
  );
};
