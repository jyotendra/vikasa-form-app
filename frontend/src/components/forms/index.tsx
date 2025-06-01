import { Link, Route, Routes } from "react-router";
import FarmerDetailForm from "./farmer-detail";

const AppForms = () => {
  return (
    <Routes>
      <Route path="farmer-detail/*" element={<FarmerDetailForm />} />
    </Routes>
  );
};

export default AppForms;
