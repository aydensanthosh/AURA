import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <div className="Navbar">
      <div className="logo">
        <img id="logo" src="/logo.png" alt="logo" />
        <img id="Name" src="/Text.png" alt="Name" />
      </div>

      <div className="tags">
        <Link to="/">Home</Link>
        <Link to="/expenses">Expenses</Link>
        <Link to="/diary">Diary</Link>
        <Link to="/habits">Habits</Link>
        <Link to="/workout">Workouts</Link>
      </div>
    </div>
  )
}
