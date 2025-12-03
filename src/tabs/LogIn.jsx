import React, { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const LogIn = () => {
  const [reg, setReg] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const navigate = useNavigate();

 // LOGIN
  async function handleLogIn(e) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      toast.success("Logged in!");
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Wrong email or password");
    }
  }

  // REGISTER
  async function handleRegister(e) {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(auth, regEmail, regPassword);

      await updateProfile(userCred.user, {
        displayName: regUsername
      });

      toast.success("Account created!");
      setReg(false);
    } catch (err) {
      console.log(err);
      toast.error("Registration failed");
    }
  }

  return (
    <>
      <Header />

      <div className="w-full flex justify-center items-center py-16 px-4 bg-softgreen min-h-screen">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-forest mb-6">
            {reg ? "Create an Account" : "Welcome Back"}
          </h2>

          {/* Login Form */}
          {!reg && (
            <form className="space-y-4">
              <div>
                <label className="text-forest text-sm font-medium">Email</label>
                <input
                  onChange={(e) => setEmailInput(e.target.value)}
                  value={emailInput}
                  type="email"
                  className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-forest text-sm font-medium">
                  Password
                </label>
                <input
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  type="password"
                  className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="•••••••"
                />
              </div>

              <button
              onClick={handleLogIn}
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium hover:bg-secondary transition cursor-pointer"
              >
                Sign in
              </button>
            </form>
          )}

          {/* Registration Form */}
          {reg && (
            <form className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-forest text-sm font-medium">
                  Username
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="Your username"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-forest text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-forest text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full mt-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-primary"
                  placeholder="Create a password"
                  required
                />
              </div>

              <button
                onClick={handleRegister}
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-xl text-lg font-medium hover:bg-secondary transition cursor-pointer"
              >
                Sign up
              </button>
            </form>
          )}

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            {!reg ? (
              <p className="text-sm text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={() => setReg(true)}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Register
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already registered?{" "}
                <span
                  onClick={() => setReg(false)}
                  className="text-primary font-medium cursor-pointer hover:underline"
                >
                  Log in
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
