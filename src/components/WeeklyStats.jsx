import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { auth, db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

ChartJS.register(ArcElement, Tooltip, Legend);

const WeeklyStats = () => {
  const [stats, setStats] = useState({
    walk: 0,
    bike: 0,
    scooter: 0,
  });

  useEffect(() => {
    async function loadWeeklyStats() {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await getDocs(collection(db, "users", user.uid, "trips"));
      const trips = snap.docs.map((d) => d.data());

      // Get Monday 00:00 of the current week
      const now = new Date();
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay() + 1); 
      firstDayOfWeek.setHours(0, 0, 0, 0);

      let walkKm = 0;
      let bikeKm = 0;
      let scootKm = 0;

      trips.forEach((t) => {
        const ts = t.startedAt?.toDate?.() || new Date(t.startedAt);
        if (ts < firstDayOfWeek) return;

        if (t.mode === "walk" || t.mode === "foot") walkKm += t.distance || 0;
        if (t.mode === "bike") bikeKm += t.distance || 0;
        if (t.mode === "scooter") scootKm += t.distance || 0;
      });

      setStats({
        walk: Number(walkKm.toFixed(1)),
        bike: Number(bikeKm.toFixed(1)),
        scooter: Number(scootKm.toFixed(1)),
      });
    }

    loadWeeklyStats();
  }, []);

  const total = stats.walk + stats.bike + stats.scooter;

  const data = {
    labels: ["Walk", "Bike", "Scooter"],
    datasets: [
      {
        data: [stats.walk, stats.bike, stats.scooter],
        backgroundColor: [
          "#4CAF50", // walk
          "#1E88E5", // bike
          "#FFC107", // scooter
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold text-forest mb-6">Weekly Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

        {/* LEFT SIDE LABELS */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#4CAF50]"></div>
            <p className="text-forest text-lg font-medium">
              Walking – {stats.walk} km
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#1E88E5]"></div>
            <p className="text-forest text-lg font-medium">
              Biking – {stats.bike} km
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-[#FFC107]"></div>
            <p className="text-forest text-lg font-medium">
              Scooter – {stats.scooter} km
            </p>
          </div>

          <p className="text-gray-600 mt-3">
            Total: <span className="font-semibold">{total} km</span> traveled this week
          </p>
        </div>

        {/* RIGHT SIDE PIE CHART */}
        <div className="h-56">
          <Pie data={data} options={{ maintainAspectRatio: false }} />
        </div>

      </div>
    </div>
  );
};

export default WeeklyStats;
