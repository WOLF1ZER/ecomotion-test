import React from "react";

function formatTime(ms = 0) { //format time correctly
  if (!ms || ms < 0) return "0m 0s";

  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hrs = Math.floor(min / 60);

  return `${hrs}h ${min % 60}m ${sec % 60}s`;
}

const TrackStats = ({ distance = 0, duration = 0, co2Saved = 0 }) => {
  const safeDistance = Number(distance) || 0;
  const safeCo2 = Number(co2Saved) || 0;

  return (
    <div className="mt-6 grid grid-cols-3 gap-4 text-center">
      <div className="bg-softgreen p-4 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-600">Distance</p>
        <p className="text-xl font-bold text-primary">
          {safeDistance.toFixed(2)} km
        </p>
      </div>
      <div className="bg-highlight p-4 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-600">Duration</p>
        <p className="text-xl font-bold text-forest">
          {formatTime(duration)}
        </p>
      </div>
      <div className="bg-yellow-100 p-4 rounded-2xl shadow-sm">
        <p className="text-sm text-gray-600">CO₂ Saved</p>
        <p className="text-xl font-bold text-green-700">
          {safeCo2.toFixed(2)} kg
        </p>
      </div>

    </div>
  );
};

export default TrackStats;
