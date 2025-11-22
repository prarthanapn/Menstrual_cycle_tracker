import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cyclesAPI } from '../api'

function Dashboard({ user }) {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadCycles()
  }, [])

  const loadCycles = async () => {
    try {
      const response = await cyclesAPI.getAll()
      setCycles(response.data)
    } catch (error) {
      console.error('Error loading cycles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getNextPeriodDate = () => {
    if (cycles.length === 0) return null
    const lastCycle = cycles[0]
    const lastStart = new Date(lastCycle.start_date)
    const nextStart = new Date(lastStart.getTime() + (28 * 24 * 60 * 60 * 1000))
    return nextStart.toLocaleDateString()
  }

  const getPhase = () => {
    if (cycles.length === 0) return 'Unknown'
    const lastCycle = cycles[0]
    const daysSinceStart = Math.floor((new Date() - new Date(lastCycle.start_date)) / (24 * 60 * 60 * 1000))
    if (daysSinceStart <= 5) return 'Menstruation'
    if (daysSinceStart <= 12) return 'Follicular'
    if (daysSinceStart <= 16) return 'Ovulation'
    if (daysSinceStart <= 28) return 'Luteal'
    return 'Menstruation'
  }

  return (
    <div className="container" style={{ marginBottom: '80px' }}>
      <div style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Hello, {user.name}!</h1>
        <p style={{ color: '#8b7a8f' }}>Welcome back to your health journey</p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/track-cycle')}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '20px',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <span style={{ fontSize: '24px' }}>📅</span>
          Track Your Cycle
        </button>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #f6f0ff 0%, #fdecef 100%)', marginBottom: '24px', border: 'none' }}>
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#8b7a8f', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Phase</h2>
          <p style={{ fontSize: '28px', fontWeight: '700', marginTop: '8px' }}>{getPhase()}</p>
        </div>
        <p style={{ color: '#8b7a8f', fontSize: '14px' }}>Based on your last cycle</p>
      </div>

      {cycles.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#8b7a8f', textTransform: 'uppercase' }}>Next Period</h2>
            <p style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px' }}>{getNextPeriodDate()}</p>
          </div>
          <p style={{ color: '#8b7a8f', fontSize: '14px' }}>Average cycle: 28 days</p>
        </div>
      )}

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Cycles</h3>
        {loading ? (
          <p>Loading cycles...</p>
        ) : cycles.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#8b7a8f' }}>No cycles tracked yet. Start tracking your cycle!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {cycles.slice(0, 3).map(cycle => (
              <div key={cycle.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{new Date(cycle.start_date).toLocaleDateString()}</p>
                  <p style={{ fontSize: '12px', color: '#8b7a8f' }}>{cycle.end_date ? 'Completed' : 'Ongoing'}</p>
                </div>
                <div style={{ fontSize: '24px' }}>📅</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
