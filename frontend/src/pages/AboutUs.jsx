import React from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const PersonCard = ({ name, role }) => (
  <div className="card" style={{ borderRadius: 24, padding: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
    <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ffe4ec', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(255,92,119,0.08)' }}>
      <span style={{ color: '#ff5c77', fontWeight: 700, fontSize: 20 }}>{name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
    </div>
    <div>
      <div style={{ color: '#ff5c77', fontWeight: 700 }}>{name}</div>
      <div style={{ color: '#8b7a8f' }}>{role}</div>
    </div>
  </div>
)

const AboutUs = () => {
  return (
    <div style={{ background: '#fff7f9', minHeight: '100vh' }} className="py-6 px-4">
      <header className="container mx-auto flex items-center justify-between mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" fill="#ff5c77" />
            <path d="M12 2c1 3 4 4 7 4s4 3 4 6-3 6-6 6-6-3-7-6-4-4-7-4  -4-3-4-6 3-6 6-6 6 3 7 6z" fill="#ffe4ec" opacity="0.9" />
          </svg>
          <h1 style={{ color: '#ff5c77', fontSize: 22, fontWeight: 700 }}>HarmonyCycle</h1>
        </div>
        <nav className="hidden sm:flex" style={{ display: 'flex', gap: 12 }}>
          <Link to="/" style={{ color: '#ff5c77', fontWeight: 600 }}>Home</Link>
          <Link to="/education" style={{ color: '#ff7a8a' }}>About</Link>
          <Link to="/login" style={{ color: '#2d2624' }}>Login</Link>
          <Link to="/register" style={{ color: '#2d2624' }}>Register</Link>
        </nav>
      </header>

      <main className="container mx-auto">
        <section className="card rounded-2xl shadow-lg mb-6" style={{ background: 'linear-gradient(180deg,#fff,#fff4f7)', borderRadius: 24 }}>
          <h2 style={{ color: '#ff5c77', fontSize: 20, fontWeight: 700 }}>Who built this project</h2>
          <p className="text-muted" style={{ marginTop: 8, color: '#8b7a8f' }}>A student-led initiative from Sahyadri College of Engineering, guided by our faculty mentor.</p>
          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            <PersonCard name="Prarthana PN" role="Developer" />
            <PersonCard name="Poorvi Rai K" role="Developer" />
            <PersonCard name="CSE, Sahyadri College of Engineering" role="Affiliation" />
            <PersonCard name="Guided by Ashwini Ma’am" role="Assistant Professor" />
          </div>
        </section>

        <section className="card rounded-2xl shadow-lg mb-6 p-4" style={{ borderRadius: 24 }}>
          <h3 style={{ color: '#ff5c77', fontSize: 18, fontWeight: 700 }}>Purpose of the app</h3>
          <p className="text-muted" style={{ marginTop: 10, color: '#8b7a8f' }}>This app helps teens and adults understand hormonal imbalance, recognise patterns, and take early steps to manage menstrual health through gentle tracking and education.</p>
        </section>

        <section className="card rounded-2xl shadow-lg p-4 mb-12" style={{ borderRadius: 24 }}>
          <h3 style={{ color: '#ff5c77', fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Developer photos</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#ffe4ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#ff5c77', fontWeight: 700 }}>PP</span>
            </div>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#ffe4ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#ff5c77', fontWeight: 700 }}>PR</span>
            </div>
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#ffe4ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#ff5c77', fontWeight: 700 }}>SC</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AboutUs
