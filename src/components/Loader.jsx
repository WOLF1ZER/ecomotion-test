import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <BeatLoader 
        color="#2F8B3F"  
        size={15} 
        margin={4}
      />
    </div>
  );
};

export default Loader;