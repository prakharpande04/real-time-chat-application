import React from "react";
import { HashLoader } from "react-spinners";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <HashLoader color="#36d7b7" />
    </div>
  );
};

export default Loader;