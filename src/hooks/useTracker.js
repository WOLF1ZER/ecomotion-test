import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

//firebase
import { db, auth } from "../utils/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";


//Haversine formula to count 
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

//keep point only if distance >= X meters
function shouldKeepPoint(last, point, minMeters = 5) {
  if (!last) return true;
  const km = haversineKm(last, point);
  return km * 1000 >= minMeters;
}

//co2 calc
const CO2_CAR = 0.192; 

const MODE_CO2 = {
  walk: CO2_CAR,
  bike: CO2_CAR,
  scooter: CO2_CAR * 0.6,
};


export default function useTracker() {
  const [recording, setRecording] = useState(false);
  const [path, setPath] = useState([]);
  const [position, setPosition] = useState(null);

  const [duration, setDuration] = useState(0); // ms
  const [distance, setDistance] = useState(0); // km
  const [co2Saved, setCo2Saved] = useState(0);

  const [mode, setMode] = useState("walk");
//refs for getting data
  const watchIdRef = useRef(null);
  const startTimeRef = useRef(null);
  const distanceRef = useRef(0);

  const plannedTripRef = useRef(null); //{ id, name, date, mode }

//get current position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        toast.error("Enable GPS to start tracking.");
        setPosition({ lat: 0, lng: 0 });
      },
      { enableHighAccuracy: true }
    );
  }, []);

  //start track
  function start(plannedTrip = null) {
    if (recording) return;

    setRecording(true);
    setPath([]);
    setDistance(0);
    setDuration(0);
    setCo2Saved(0);

    distanceRef.current = 0;
    startTimeRef.current = Date.now();
    plannedTripRef.current = plannedTrip; // save planned trip if any
  }

 //stop track
  async function stop() {
    if (!recording) return;
    setRecording(false);

    if (watchIdRef.current)
      navigator.geolocation.clearWatch(watchIdRef.current);

    const user = auth.currentUser;
    if (!user) return toast.error("Not logged in.");

    const distanceKm = Number(distanceRef.current.toFixed(2));
    const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const co2 = Number(co2Saved.toFixed(2));
   
    //iso time 
    const nowIso = new Date().toISOString();
    const startIso = new Date(startTimeRef.current).toISOString();

    const trip = {
      distance: distanceKm,
      duration: seconds,
      path,
      mode,
      co2Saved: co2,
      startedAt: startIso,
      endedAt: nowIso,
      createdAt: serverTimestamp(),
      plannedId: plannedTripRef.current?.id || null,
      planned: !!plannedTripRef.current,
    };

    //save trip
    await addDoc(collection(db, "users", user.uid, "trips"), trip);

    //mark planned trip completed
    if (plannedTripRef.current?.id) {
      const ref = doc(
        db,
        "users",
        user.uid,
        "plannedtrips",
        plannedTripRef.current.id
      );

      await updateDoc(ref, { completed: true });
    }

    toast.success("Trip saved!");

    //reset
    setPath([]);
    setDistance(0);
    setDuration(0);
    setCo2Saved(0);
    distanceRef.current = 0;
    plannedTripRef.current = null;
  }

//time
  useEffect(() => {
    if (!recording) return;

    const interval = setInterval(() => {
      setDuration(Date.now() - startTimeRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [recording]);

//trip recording 
  useEffect(() => {
    if (!recording) return;

    if (watchIdRef.current)
      navigator.geolocation.clearWatch(watchIdRef.current);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const point = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setPosition(point);

        setPath((prev) => {
          const last = prev[prev.length - 1];

          if (!shouldKeepPoint(last, point, 5)) {
            return prev; // ignore noise
          }

          if (last) {
            const inc = haversineKm(last, point);
            distanceRef.current += inc;
          }

          const total = distanceRef.current;
          setDistance(total);
          setCo2Saved(total * (MODE_CO2[mode] || CO2_CAR));

          return [...prev, point];
        });
      },
      (err) => console.log("GPS error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [recording, mode]);

  return {
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
  };
}
