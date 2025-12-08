import React, { useEffect, useState } from "react";
import TripListItem from "../components/TripListItem";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import Loader from "../components/Loader"
import { deleteDoc, doc } from "firebase/firestore";

const History = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  //load trips
  useEffect(() => {
    async function loadTrips() {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const snap = await getDocs(collection(db, "users", uid, "trips"));
       //correct sorting
        const tripsArr = snap.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .sort((a, b) => {
    const dateA =
      a.startedAt instanceof Date
        ? a.startedAt
        : new Date(a.startedAt);

    const dateB =
      b.startedAt instanceof Date
        ? b.startedAt
        : new Date(b.startedAt);

    return dateB - dateA;
  });

        setTrips(tripsArr);
      } catch (err) {
        console.log("Failed to load trips:", err);
      }

      setLoading(false);
    }

    loadTrips();
  }, []);

//delete trip from history 
 async function deleteTrip(id) {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    await deleteDoc(doc(db, "users", uid, "trips", id));
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }



  return (
    <div className="pt-24 px-6 max-w-3xl mx-auto mb-[70px]">
      <h1 className="text-4xl font-bold text-forest mb-6">History</h1>
      {loading && (
        <Loader />
      )}
      {!loading && trips.length === 0 && (
        <p className="text-gray-600 text-lg">No trips recorded yet.</p>
      )}
      {!loading && trips.length > 0 && (
        <ul className="flex flex-col gap-3">
          {trips.map((trip) => (
            <TripListItem key={trip.id} trip={trip}  onDelete={deleteTrip}  />
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
