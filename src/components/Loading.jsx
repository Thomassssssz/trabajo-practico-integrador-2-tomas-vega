import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      <span className="ml-4 text-gray-700">Cargando...</span>
    </div>
  );
};

export default Loading;
