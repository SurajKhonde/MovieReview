import React from "react";

export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex justify-center items-center py-20">
      <div className="flex flex-col items-center space-y-3">
        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <p className="text-primary dark:text-white">{message}</p>
      </div>
    </div>
  );
}
