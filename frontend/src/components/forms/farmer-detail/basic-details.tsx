import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export const BasicFarmerDetailForm = () => {
  const { register, handleSubmit } = useForm();
  let navigate = useNavigate();

  const onSubmit = (data: any) => {
    console.log(data);
    navigate("/step2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <input type="submit" />
    </form>
  );
};
