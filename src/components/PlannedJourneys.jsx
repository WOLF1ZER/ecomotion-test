import React, { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { FaWalking } from "react-icons/fa";
import { IoBicycle } from "react-icons/io5";
import { MdElectricScooter } from "react-icons/md";

//mode selected
const MODE_ICON = {
  walk: <FaWalking className="text-primary text-2xl" />,
  bike: <IoBicycle className="text-blue-600 text-2xl" />,
  scooter: <MdElectricScooter className="text-yellow-600 text-2xl" />,
};
//badge
const MODE_BADGE = {
  walk: "bg-green-100 text-primary",
  bike: "bg-blue-100 text-blue-600",
  scooter: "bg-yellow-100 text-yellow-700",
};

//normalize DB modes
function normalizeMode(mode) {
  if (mode === "foot") return "walk";
  return mode;
}

const PlannedJourneys = () => {
  const navigate = useNavigate();
  const [planned, setPlanned] = useState([]);

  async function loadPlanned() {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "plannedtrips"),
      where("completed", "==", false)
    );

    const snap = await getDocs(q);
    const trips = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        mode: normalizeMode(data.mode),
      };
    });

    setPlanned(trips);
  }

  useEffect(() => {
    loadPlanned();
  }, []);

  function formatDateTime(dtString) {
    if (!dtString) return "";
    const date = new Date(dtString);

    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} • ${formattedTime}`;
  }

  function startPlannedTrip(trip) {
    navigate("/track", { state: { plannedTrip: trip } });
  }


  //trim the name 
  function trimName(name) {
    if (!name) return "";
    return name.length > 5 ? name.slice(0, 5) + "…" : name;
  }

  return (
    <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-forest mb-4">Planned Trips</h2>

      {planned.length === 0 ? (
        <p className="text-gray-600 text-sm mb-6">No planned trips.</p>
      ) : (
        <div className="space-y-4">
          {planned.map((trip) => (
            <div
              key={trip.id}
              className="p-4 rounded-2xl bg-softgreen/60 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 hover:shadow-md transition cursor-pointer bg-green">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow">
                  {MODE_ICON[trip.mode]}
                </div>
                <div className="flex flex-col">
                  {/* for name triming */}
                  <h3 className="text-lg font-semibold text-forest">
                    <span className="block lg:hidden">
                      {trimName(trip.name)}
                    </span>
                    <span className="hidden lg:block">
                      {trip.name}
                    </span></h3>

                  <p className="text-sm text-gray-700">{formatDateTime(trip.date)}</p>

                  <span
                    className={`mt-1 w-fit inline-block px-2 py-1 rounded-lg text-xs font-medium ${MODE_BADGE[trip.mode]}`}
                  >
                    {trip.mode}
                  </span>
                </div>
              </div>
              <button
                onClick={() => startPlannedTrip(trip)}
                className="w-full sm:w-auto py-2 px-4 rounded-xl bg-primary text-white font-medium text-sm cursor-pointer hover:bg-secondary transition">
                Start
              </button>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default PlannedJourneys;
