import React, { useState, useEffect } from 'react'
import { cyclesAPI } from '../api'

function Reports({ user }) {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)

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

  const getStats = () => {
    if (cycles.length === 0) return null
    
    const totalCycles = cycles.length
    const avgCycleLength = Math.round(
      cycles.reduce((sum, c) => {
        const start = new Date(c.start_date)
        const end = c.end_date ? new Date(c.end_date) : new Date()
        return sum + Math.floor((end - start) / (24 * 60 * 60 * 1000))
      }, 0) / cycles.length
    )

    return { totalCycles, avgCycleLength }
  }

  const stats = getStats()

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Your Health Reports</h1>
      <p style={{ color: '#8b7a8f', marginBottom: '32px' }}>Insights from your tracked data</p>

      {loading ? (
        <p>Loading reports...</p>
      ) : stats ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div className="card">
              <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Total Cycles</p>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>{stats.totalCycles}</p>
            </div>
            <div className="card">
              <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Avg Cycle Length</p>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>{stats.avgCycleLength}d</p>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Cycle History</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {cycles.map(cycle => {
                const start = new Date(cycle.start_date)
                const end = cycle.end_date ? new Date(cycle.end_date) : new Date()
                const duration = Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1
                
                return (
                  <div key={cycle.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <p style={{ fontWeight: '600' }}>Started: {start.toLocaleDateString()}</p>
                        <p style={{ fontSize: '14px', color: '#8b7a8f' }}>Duration: {duration} days</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {cycle.end_date && <p style={{ fontSize: '12px', backgroundColor: '#f0fdf4', color: '#10b981', padding: '4px 12px', borderRadius: '6px', display: 'inline-block' }}>Completed</p>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <p style={{ textAlign: 'center', color: '#8b7a8f' }}>No cycle data to generate reports. Start tracking your cycle!</p>
        </div>
      )}
    </div>
  )
}

export default Reports
