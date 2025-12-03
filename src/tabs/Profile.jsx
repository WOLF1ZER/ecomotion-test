import React, { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { AiOutlineDownload } from "react-icons/ai";
import { toast } from "react-toastify";
import usePWAInstall from "../hooks/usePWAInstall"; 

//firestore
import { signOut } from "firebase/auth";
import { auth,db } from "../utils/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";


const Profile = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const [showSettings, setShowSettings] = useState(false);

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ totalTrips: 0, totalDistance: 0, totalCo2: 0 });


  function handleLogout() {
    signOut(auth);
  }

  useEffect(() => {
    async function loadProfile() {
      const user = auth.currentUser;
      if (!user) return;

      // 1️⃣ Fetch user basic info
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserData(userSnap.data());
      } else {
        // fallback if user doc doesn't exist
        setUserData({
          displayName: user.displayName || "User",
          email: user.email
        });
      }

      //fetch data
      const tripsSnap = await getDocs(collection(db, "users", user.uid, "trips"));
      const trips = tripsSnap.docs.map((d) => d.data());

      const totalTrips = trips.length;
      const totalDistance = trips.reduce((s, t) => s + (t.distance || 0), 0);
      const totalCo2 = trips.reduce((s, t) => s + (t.co2Saved || 0), 0);

      setStats({
        totalTrips,
        totalDistance: Number(totalDistance.toFixed(1)),
        totalCo2: Number(totalCo2.toFixed(2)),
      });
    }

    loadProfile();
  }, []);


async function handlePasswordChange(e) {
  e.preventDefault();

  const user = auth.currentUser;
  if (!user) return toast.error("You must be logged in.");

  // 🔥 Block Google accounts
  if (user.providerData[0].providerId !== "password") {
    return toast.error("You signed in with Google. Password change is not available.");
  }

  try {
    // Reauthenticate
    const credential = EmailAuthProvider.credential(user.email, oldPass);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPass);

    toast.success("Password updated successfully!");
    setOldPass("");
    setNewPass("");

  } catch (err) {
    console.error("Password change error:", err);

    if (err.code === "auth/wrong-password") {
      toast.error("Incorrect current password.");
    } else if (err.code === "auth/weak-password") {
      toast.error("New password is too weak (min 6 characters).");
    } else if (err.code === "auth/invalid-credential") {
      toast.error("Reauthentication failed. Login again and retry.");
    } else {
      toast.error("Failed to change password.");
    }
  }
}

//pwa
const install = usePWAInstall();

  return (
    <div className="pt-28 px-6 max-w-3xl mx-auto mb-[70px]">
      <h1 className="text-4xl font-bold text-forest mb-6">Profile</h1>
      <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center text-primary text-3xl font-bold border border-forest">
            {userData?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-forest"> {userData?.displayName || "User"}</h2>
            <p className="text-gray-600 text-sm">{userData?.email || "example@gmail.com"}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-forest mb-3">Your Stats</h3>

        <div className="flex justify-between text-gray-700">
          <div>
            <p className="text-sm">Total Trips</p>
            <p className="text-xl font-bold text-primary">{stats.totalTrips}</p>
          </div>

          <div>
            <p className="text-sm">Distance Travelled</p>
            <p className="text-xl font-bold text-primary">{stats.totalDistance} km</p>
          </div>

          <div>
            <p className="text-sm">CO₂ Saved</p>
            <p className="text-xl font-bold text-primary">{stats.totalCo2} kg</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-md border border-gray-200 mb-8">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between px-6 py-5"
        >
          <h2 className="text-xl font-semibold text-forest">Account Settings</h2>

          <div
            className={`
              w-10 h-10 bg-softgreen/60 flex items-center justify-center 
              transition-transform duration-300 rounded-full bg-primary cursor-pointer
              ${showSettings ? "rotate-180" : ""}
            `}
          >
            <IoChevronDown size={22} className="text-white" />
          </div>
        </button>
        <div
          className={`
            overflow-hidden transition-all duration-300 px-6
            ${showSettings ? "max-h-[500px] pb-6" : "max-h-0 pb-0"}
          `}
        >
          <h3 className="bg-softgreen/40 px-3 py-2 rounded-xl font-medium text-forest mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Current password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="New password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />

            <button
              type="submit"
              className="bg-primary text-white py-3 rounded-xl text-lg font-medium hover:bg-secondary transition cursor-pointer"
            >
              Save New Password
            </button>
          </form>
        </div>

      </div>
      <div className="bg-white rounded-3xl mb-10 shadow-md p-6 border border-gray-200">
        <button
        onClick={install}
          className="w-full flex justify-between p-5 bg-primary hover:bg-secondary text-white py-3 rounded-xl text-lg font-medium transition cursor-pointer"
        >
          Download
          <AiOutlineDownload size={30} className="text-white" />

        </button>
      </div>
      <div className="bg-white rounded-3xl shadow-md p-6 border border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-lg font-medium transition cursor-pointer"
        >
          Log Out
        </button>
      </div>

    </div>
  );
};

export default Profile;
