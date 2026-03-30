import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import logo from './assets/basworld-logo.png'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'

function App() {
    const [page, setPage] = useState("landing")
    const [active, setActive] = useState("Dashboard")

    if (page === "dashboard") {
        return (
            <div style={{ display: "flex", height: "100vh", background: "#f4f6f4", fontFamily: "'DM Sans', sans-serif" }}>
                <Sidebar active={active} setActive={setActive} />
                <Dashboard />
            </div>
        )
    }

    return (
        <div className="page">
            <div className="card">
                <img src={logo} alt="BAS World" className="logo" />
                <p className="subtitle">Smart Solutions</p>
                <button onClick={() => setPage("dashboard")} style={{
                    marginTop: 20,
                    padding: "10px 24px",
                    background: "#2e7d32",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                }}>
                    Go to Dashboard
                </button>
            </div>
        </div>
    )
}

export default App