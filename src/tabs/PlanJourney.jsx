import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleTypeSelector from "../components/VehicleTypeSelector";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";

const PlanJourney = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("walk");
  const [loading, setLoading] = useState(false);

  //save trip
  async function createPlannedTrip() {
    if (!name.trim()) {
      toast.error("Trip name cannot be empty");
      return;
    }

    if (!date) {
      toast.error("Please select date & time");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    try {
      const tripData = {
        name: name.trim(),
        date,
        mode,
        started: false,     
        completed: false,     
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "users", user.uid, "plannedtrips"),
        tripData
      );

      toast.success("Planned trip created!");
        //navigate when trip created
      navigate("/track", {
        state: {
          plannedTrip: { id: docRef.id, ...tripData }
        }
      });

    } catch (err) {
      console.error(err);
      toast.error("Failed to save planned trip");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 px-6 max-w-2xl mx-auto pb-10 mb-[70px]">
      <h1 className="text-4xl font-bold text-forest mb-6">Plan a Trip</h1>

      <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100">
        <label className="block text-forest mb-1 font-medium">Trip Name</label>
        <input
          type="text"
          maxLength={15}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Morning Ride, Gym Walk..."
          className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-primary" />
        <label className="block text-forest mb-1 font-medium">Date & Time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 mb-4 focus:outline-primary" />
        <label className="block text-forest mb-2 font-medium">
          Transport Mode
        </label>
        <VehicleTypeSelector mode={mode} setMode={setMode} />

        <button
          onClick={createPlannedTrip}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-2xl text-lg font-medium transition
            ${loading ? "bg-gray-400" : "bg-primary hover:bg-secondary text-white"}
          `}
        >
          {loading ? "Saving..." : "Start Planned Journey"}
        </button>
      </div>
    </div>
  );
};

export default PlanJourney;
