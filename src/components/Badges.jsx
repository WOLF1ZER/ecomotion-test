import React, { useEffect, useState } from "react";
import { FaWalking } from "react-icons/fa";
import { IoBicycle } from "react-icons/io5";
import { MdElectricScooter } from "react-icons/md";

import { auth, db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

const Badges = () => {

  const [usedModes, setUsedModes] = useState({
    walk: false,
    bike: false,
    scooter: false,
  });

  useEffect(() => {
    async function loadBadges() {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDocs(collection(db, "users", user.uid, "trips"));
      const trips = snap.docs.map((d) => d.data());

      // Detect used transportation modes
      const walkUsed = trips.some((t) => t.mode === "walk" || t.mode === "foot");
      const bikeUsed = trips.some((t) => t.mode === "bike");
      const scootUsed = trips.some((t) => t.mode === "scooter");

      setUsedModes({
        walk: walkUsed,
        bike: bikeUsed,
        scooter: scootUsed,
      });
    }

    loadBadges();
  }, []);

  const totalEarned = Object.values(usedModes).filter(Boolean).length;
  const progressPercent = (totalEarned / 3) * 100;


  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-forest mb-4">Badges</h2>

      <div className="flex gap-4 mb-6">
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm
          ${usedModes.walk ? "bg-green text-primary" : "bg-white text-gray-400 border"} `}
        >
          <FaWalking size={26} />
        </div>
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm
          ${usedModes.bike ? "bg-blue-100 text-blue-600" : "bg-white text-gray-400 border"} `}
        >
          <IoBicycle size={26} />
        </div>
         <div
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm
          ${usedModes.scooter ? "bg-yellow-100 text-yellow-700" : "bg-white text-gray-400 border"} `}
        >
          <MdElectricScooter size={28} />
        </div>

      </div>


      <p className="text-sm text-gray-700 mb-2">Progress Earned</p>
      <div className="w-full h-3 bg-gray-200 rounded-xl">
        <div className="h-full bg-primary rounded-xl" style={{ width: `${progressPercent}%` }}></div>
      </div>

      <p className="mt-2 text-sm text-gray-600">{totalEarned} / 3 badges earned</p>
    </div>
  );
};

export default Badges;
