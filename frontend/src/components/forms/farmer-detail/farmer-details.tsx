import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const DetailedFarmerInfoForm = () => {
  const { register, handleSubmit } = useForm();
  let navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log(data);
    navigate("/step2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("fatherName")} />
      <input {...register("motherName")} />
      <input type="submit" />
    </form>
  );
};
