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
  farmerDetailCompleteType,
} from "./form-state"; // Assuming form-state.ts contains these
import { useAuthedAxiosClient } from "../../../utils/axiosClient";

// Create type from schema
export type FarmerDetailFormType = z.infer<typeof farmerDetailFormSchema>;

interface DetailedFarmerInfoFormProps {
  stepBack: () => void;
  finalFormData: farmerDetailCompleteType;
}

export const PreviewAndSubmit = (props: DetailedFarmerInfoFormProps) => {
  const [{ data: formSubmitResp, loading, error }, executePost] =
    useAuthedAxiosClient(
      {
        url: "/form/farmer-detail",
        method: "post",
      },
      {
        manual: true,
      }
    );
  const { finalFormData, stepBack } = props;
  let navigate = useNavigate();

  const handleBack = () => {
    stepBack();
    navigate("../step2");
  };

  const handleSubmit = () => {
    // Here you would typically send the finalFormData to your backend
    console.log("Submitting form data:", finalFormData);
    executePost({
      data: finalFormData,
    })
      .then((response) => {
        console.log("Form submitted successfully:", response);
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
      })
      .finally(() => {
        navigate("/form/farmer-detail", {
          replace: true,
          state: { remount: Date.now() },
        });
      });
  };

  return (
    <Stack direction="column" spacing={2} sx={{ width: "100%" }}>
      <h2>Preview and Submit</h2>

      <TextField
        label="Form Data Preview"
        value={JSON.stringify(finalFormData, null, 2)}
        multiline
        minRows={8}
        fullWidth
        disabled
        variant="outlined"
      />

      <Button
        variant="outlined"
        color="secondary"
        onClick={handleBack}
        sx={{ marginRight: 2 }}
      >
        Back
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Stack>
  );
};
