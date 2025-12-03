import React from "react";


const TrackControls = ({ recording, start, stop }) => {
  return (
    <div className="flex gap-4 mt-6 justify-center">
      {!recording ? (
        <button
          onClick={start}
          className="px-8 py-3 bg-primary font-semibold uppercase cursor-pointer text-white rounded-xl text-lg shadow hover:bg-secondary transition" >
          Start Tracking
        </button>
      ) : (
        <button
          onClick={stop}
          className="px-8 py-3 bg-red-500 font-semibold uppercase cursor-pointer text-white rounded-xl text-lg shadow hover:bg-red-600 transition" >
          Stop
        </button>
      )}
    </div>
  );
};

export default TrackControls;
