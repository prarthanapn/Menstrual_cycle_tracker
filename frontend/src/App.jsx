import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import TrackCycle from './pages/TrackCycle'
import LogSymptoms from './pages/LogSymptoms'
import CalendarPage from './pages/CalendarPage'
import Reports from './pages/Reports'
import Chatbot from './pages/Chatbot'
import Profile from './pages/Profile'
import Education from './pages/Education'
import BottomNav from './components/BottomNav'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>Loading...</div>
  }

  return (
    <Router>
      <div style={{ minHeight: '100vh', paddingBottom: user ? '80px' : '0' }}>
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="/onboarding" element={<Onboarding setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard user={user} onLogout={handleLogout} />} />
              <Route path="/track" element={<TrackCycle user={user} />} />
              <Route path="/calendar" element={<CalendarPage user={user} />} />
              <Route path="/symptoms" element={<LogSymptoms user={user} />} />
              <Route path="/reports" element={<Reports user={user} />} />
              <Route path="/chatbot" element={<Chatbot user={user} />} />
              <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
              <Route path="/education" element={<Education user={user} />} />
              <Route path="/about" element={<About />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </>
          )}
        </Routes>
        {user && <BottomNav />}
      </div>
    </Router>
  )
}

export default App
