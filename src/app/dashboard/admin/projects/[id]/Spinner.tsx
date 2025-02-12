import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div
        className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
