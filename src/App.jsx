import { useState, useEffect } from "react";
import Dashboard from "./tabs/Dashboard.jsx";
import LogIn from './tabs/LogIn'
import { Routes, Route } from "react-router-dom";
import Menu from "./components/Menu"

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PlanJourney from "./tabs/PlanJourney";
import StartTracking from "./tabs/StartTracking";
import History from "./tabs/History";
import Profile from "./tabs/Profile";

//firebase
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebase";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setLoggedIn(!!user);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-green w-full">

      {!loggedIn ? (
        <LogIn />   
      ) : (
        <>
          <Menu />

          <div className="max-w-6xl mx-auto px-4 py-6 w-full">
            <ToastContainer />

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/plan" element={<PlanJourney />} />
              <Route path="/track" element={<StartTracking />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </>
      )}

    </div>
  )
}

export default App;
