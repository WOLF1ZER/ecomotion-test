import React from 'react'
import logo from "../assets/logo.png"

const Header = () => {
  return (
    <div className="w-full bg-white shadow-sm rounded-b-3xl z-50 fixed">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="EcoMotion Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-semibold text-forest tracking-tight">
            EcoMotion
          </h1>
        </div>
      </div>
    </div>

  )
}

export default Header