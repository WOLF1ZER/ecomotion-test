import React, { useEffect, useState } from "react";
import Map from "./Map";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../utils/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";

const Hero = () => {
  const navigate = useNavigate();
  
  const [todayDistance, setTodayDistance] = useState(0);
  const [todayCo2, setTodayCo2] = useState(0);
  const [lastTrip, setLastTrip] = useState(null);





  //fetching data from db 
  useEffect(() => {
    async function loadStats() {
      const user = auth.currentUser;
      if (!user) return;

      const tripsRef = collection(db, "users", user.uid, "trips");

      // ----------- TODAY'S DATE -----------
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch all trips
      const q = query(tripsRef, orderBy("startedAt", "desc"));
      const snap = await getDocs(q);

      const trips = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // ----------- TODAY’S STATS -----------
      const todayTrips = trips.filter((t) => {
        const tripDate = t.startedAt?.toDate
          ? t.startedAt.toDate()
          : new Date(t.startedAt);
        return tripDate >= today;
      });

      const dist = todayTrips.reduce((s, t) => s + (t.distance || 0), 0);
      const co2 = todayTrips.reduce((s, t) => s + (t.co2Saved || 0), 0);

      setTodayDistance(dist.toFixed(1));
      setTodayCo2(co2.toFixed(2));

      // ----------- LAST TRIP -----------
      setLastTrip(trips[0] || null);
    }

    loadStats();
  }, []);


  return (
    <div className="w-full px-6 pt-28 pb-16 bg-softgreen bg-cover bg-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
  <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
  <h1 className="text-4xl md:text-5xl font-bold text-forest leading-tight">
    Move Smarter. <br />
    <span className="text-primary">Live Greener.</span>
  </h1>

  <p className="mt-4 text-gray-700 text-lg max-w-md">
    Track your journeys, save CO₂ and choose sustainable routes with
    EcoMotion — your eco-friendly travel companion.
  </p>

  <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
    <button
      onClick={() => navigate("/track")}
      className="px-6 py-3 bg-primary text-white rounded-2xl text-lg font-medium hover:bg-secondary transition cursor-pointer"
    >
      Start Tracking
    </button>

    <button
      onClick={() => navigate("/plan")}
      className="px-6 py-3 border-2 border-primary text-primary rounded-2xl text-lg font-medium hover:bg-secondary hover:border-secondary hover:text-white transition cursor-pointer"
    >
      Plan Journey
    </button>
  </div>
</div>


        {/* RIGHT CARD */}
        <div className="relative w-full">
          <div className="absolute inset-0 bg-leaf/30 blur-2xl rounded-3xl hidden md:block"></div>

          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100 w-full max-w-lg mx-auto">
            <h3 className="text-xl font-semibold text-forest">Today’s Stats</h3>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-softgreen p-4 rounded-2xl text-center shadow-sm">
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-2xl font-bold text-primary">{todayDistance} km</p>
              </div>

              <div className="bg-highlight p-4 rounded-2xl text-center shadow-sm">
                <p className="text-sm text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-forest">{todayCo2} kg</p>
              </div>
            </div>

            <div
              onClick={() => navigate("/track")}
              className="mt-6 h-48 rounded-2xl overflow-hidden cursor-pointer"
            >
              <Map />
            </div>

            <p className="mt-3 text-gray-600 text-sm">
              {lastTrip
                ? `Last ${lastTrip.mode} · ${lastTrip.distance?.toFixed(1)} km · ${
                    Math.round(lastTrip.duration / 60)
                  } min`
                : "No recent trips"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
