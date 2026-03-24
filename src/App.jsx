import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import logo from './assets/basworld-logo.png'

function App() {
  return (
    <div className="page">
      <div className="card">
        <img src={logo} alt="BAS World" className="logo" />
        <p className="subtitle">Smart Solutions</p>
      </div>
    </div>
  )
}

export default App
