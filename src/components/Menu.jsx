import React from "react";
import logo from "../assets/logo.png";

import { FaCircleUser } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { TbRouteSquare2 } from "react-icons/tb";
import { MdHistory } from "react-icons/md";
import { GrPlan } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const Menu = () => {

const navigate = useNavigate();

    return (
        <div className="w-full bg-white shadow-sm rounded-b-3xl z-9999 fixed">
            <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="EcoMotion Logo" className="w-10 h-10" />
                    <h1 className="text-2xl font-semibold text-forest tracking-tight">
                        EcoMotion
                    </h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:block">
                    <ul className="flex gap-10 text-lg font-medium text-forest">

                        <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer" 
                        onClick={() => {navigate('/')}}
                        >
                            <IoMdHome className="text-xl" />
                            Home
                        </li>

                        <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer"
                        onClick={() => {navigate('/plan')}}
                        >
                            <GrPlan className="text-xl" />
                            Plan Journey
                        </li>

                        <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer"
                        onClick={() => {navigate('/track')}}
                        >
                            <TbRouteSquare2 className="text-xl" />
                            Start Tracking
                        </li>

                        <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer"
                        onClick={() => {navigate('/history')}}
                        >
                            <MdHistory className="text-xl" />
                            View History
                        </li>

                    </ul>
                </nav>
                <button className="hidden lg:flex p-2 rounded-full hover:bg-softgreen transition"
                onClick={() => {navigate('/profile')}}
                >
                    <FaCircleUser size={34} className="text-primary cursor-pointer" />
                </button>

            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 border border-primary shadow-lg px-7 py-3 rounded-3xl backdrop-blur-xl flex justify-center">

                <ul className="flex items-center gap-6 text-forest text-xs font-medium">

                    <li className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition"
                    onClick={() => {navigate('/')}}
                    >
                        <IoMdHome className="text-2xl hover:fill-primary" />
                        Home
                    </li>

                    <li className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition"
                    onClick={() => {navigate('/plan')}}
                    >
                        <GrPlan className="text-2xl hover:fill-primary" />
                        Plan
                    </li>

                    <li className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition"
                    onClick={() => {navigate('/track')}}
                    >
                        <TbRouteSquare2 className="text-2xl" />
                        Track
                    </li>

                    <li className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition"
                    onClick={() => {navigate('/history')}}
                    >
                        <MdHistory className="text-2xl" />
                        History
                    </li>

                    <li className="flex flex-col items-center gap-1 cursor-pointer hover:text-primary transition"
                    onClick={() => {navigate('/profile')}}
                    >
                        <FaCircleUser className="text-2xl" />
                        Profile
                    </li>

                </ul>
            </div>

        </div>
    );
};

export default Menu;
