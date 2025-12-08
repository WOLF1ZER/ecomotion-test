import React, { useState } from "react";
import { FaWalking } from "react-icons/fa";
import { IoBicycle } from "react-icons/io5";
import { MdElectricScooter } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

const modeIcons = {
  walk: <FaWalking className="text-primary text-xl" />,
  bike: <IoBicycle className="text-blue-600 text-xl" />,
  scooter: <MdElectricScooter className="text-yellow-600 text-xl" />,
};

const TripListItem = ({ trip, onDelete }) => {
  const [showBin, setShowBin] = useState(false);

  const date = trip.startedAt?.toDate
    ? trip.startedAt.toDate()
    : new Date(trip.startedAt || Date.now());

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = date.toLocaleDateString();

  const durationMin = trip.duration ? Math.round(trip.duration / 60) : 0;

  function toggleBin() {
    setShowBin((prev) => !prev);
  }

  return (
    <li className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition cursor-pointer mb-3"
        onClick={toggleBin}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-softgreen flex items-center justify-center">
            {modeIcons[trip.mode] ?? <FaWalking className="text-primary" />}
          </div>
          <div>
            <p className="text-xl font-semibold text-forest">
              {trip.distance?.toFixed(1)} km
            </p>
            <p className="text-sm text-gray-600">
              {durationMin} min • {formattedDate} {formattedTime}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">CO₂ Saved</p>
          <p className="text-lg font-bold text-primary">
            {(trip.co2Saved ?? trip.co2 ?? 0).toFixed(2)} kg
          </p>
        </div>
      </div>
      {showBin && (
        <button
          onClick={(e) => {
            e.stopPropagation(); //dont close the menu
            onDelete(trip.id);
          }}
          className="
            w-full mt-3 h-12 flex items-center justify-center rounded-xl
            bg-red-100 hover:bg-red-200 transition text-red-600
            shadow cursor-pointer
          "
        >
          <FaTrash size={18} />
        </button>
      )}
    </li>
  );
};

export default TripListItem;
