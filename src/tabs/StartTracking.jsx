import React from "react";
import { useLocation } from "react-router-dom";

import TrackingMap from "../components/TrackingMap";
import TrackStats from "../components/TrackStats";
import TrackControls from "../components/TrackControls";
import VehicleTypeSelector from "../components/VehicleTypeSelector";

import useTracker from "../hooks/useTracker";

const StartTracking = () => {
  const location = useLocation();
  const plannedTrip = location.state?.plannedTrip || null;

  const {
    recording,
    start,
    stop,
    position,
    path,
    duration,
    distance,
    co2Saved,
    mode,
    setMode,
  } = useTracker();

  /** Start tracking, optionally as a planned trip */
  function handleStart() {
    start(plannedTrip);
  }

  /** Stop tracking — saving is handled inside useTracker.stop() */
  function handleStop() {
    stop();
  }

  //trim the name 
  function trimName(name) {
    if (!name) return "";
    return name.length > 5 ? name.slice(0, 5) + "…" : name;
  }

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto pb-10 mb-[50px]">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-forest">
          {plannedTrip ? ( //for short names fir smaller devices
            <>
              <span className="block lg:hidden">
                {trimName(plannedTrip.name)}
              </span>
              <span className="hidden lg:block">
                {plannedTrip.name}
              </span>
            </>
          ) : (
            "Live Tracking"
          )}
        </h1>
        <p className="text-gray-600 mt-1">
          Track your eco-friendly journey in real time.
        </p>
      </div>

      {/* Map */}
      <div className="rounded-3xl overflow-hidden shadow-lg border border-gray-200">
        <TrackingMap position={position} path={path} />
      </div>

      {/* Mode Selector */}
      <VehicleTypeSelector mode={mode} setMode={setMode} />

      {/* Stats */}
      <TrackStats
        duration={duration}
        distance={distance}
        co2Saved={co2Saved}
      />

      {/* Controls */}
      <TrackControls
        recording={recording}
        start={handleStart}
        stop={handleStop}
      />
    </div>
  );
};

export default StartTracking;
