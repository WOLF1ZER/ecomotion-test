import React from "react";
import { FaWalking } from "react-icons/fa";
import { IoBicycle } from "react-icons/io5";
import { MdElectricScooter } from "react-icons/md";

const vehicleOptions = [
  { id: "foot", label: "Walk", icon: <FaWalking size={22} /> },
  { id: "bike", label: "Bike", icon: <IoBicycle size={22} /> },
  { id: "scooter", label: "E-Scooter", icon: <MdElectricScooter size={24} /> },
];

const VehicleTypeSelector = ({ mode, setMode }) => {
  return (
    <div className="mt-6 bg-white p-5 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-forest mb-3">Travel Mode</h2>

      <div className="grid grid-cols-3 gap-4">
        {vehicleOptions.map((v) => (
          <button
            key={v.id}
            onClick={() => setMode(v.id)}
            className={`flex flex-col justify-center items-center py-3 rounded-xl border 
              transition-all duration-200  cursor-pointer
              ${
                mode === v.id
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-gray-50 text-forest border-gray-200 hover:bg-gray-100"
              }
            `}
          >
            <div>{v.icon}</div>
            <span className="mt-1 text-sm font-medium">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VehicleTypeSelector;
