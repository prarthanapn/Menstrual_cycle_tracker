import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cyclesAPI } from '../api'

function TrackCycle({ user }) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [flowLevel, setFlowLevel] = useState('')
  const [painLevel, setPainLevel] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const flowOptions = [
    { value: 'low', label: 'Low', icon: '💧', description: 'Spotting or light flow' },
    { value: 'medium', label: 'Medium', icon: '🌊', description: 'Normal flow' },
    { value: 'high', label: 'High', icon: '🌊🌊', description: 'Heavy flow' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!startDate) {
      setMessage('Please select a start date')
      return
    }
    if (!flowLevel) {
      setMessage('Please select a flow level')
      return
    }

    setLoading(true)
    try {
      await cyclesAPI.add(startDate, endDate || null, flowLevel, painLevel, notes)
      setMessage('Cycle tracked successfully!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to track cycle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FDECEF 0%, #F6F0FF 50%, #FFF3E4 100%)',
      padding: '20px',
      paddingBottom: '100px'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', color: '#2d2624' }}>
            Track Your Cycle
          </h1>
          <p style={{ color: '#8b7a8f' }}>Record your period details</p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2d2624'
              }}>
                Period Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '1px solid #f0e8f5',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#faf9f7'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2d2624'
              }}>
                Period End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '1px solid #f0e8f5',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#faf9f7'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#2d2624'
              }}>
                Flow Level *
              </label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {flowOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFlowLevel(option.value)}
                    style={{
                      flex: '1',
                      minWidth: '120px',
                      padding: '20px 16px',
                      borderRadius: '16px',
                      border: flowLevel === option.value ? '2px solid #d89fc2' : '1px solid #f0e8f5',
                      background: flowLevel === option.value ? '#fdecef' : 'white',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{option.icon}</div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{option.label}</div>
                    <div style={{ fontSize: '12px', color: '#8b7a8f' }}>{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '12px',
                color: '#2d2624'
              }}>
                Pain Level: {painLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: '#f0e8f5',
                  outline: 'none',
                  appearance: 'none'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '12px', color: '#8b7a8f' }}>Mild</span>
                <span style={{ fontSize: '12px', color: '#8b7a8f' }}>Severe</span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#2d2624'
              }}>
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about your cycle..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '15px',
                  border: '1px solid #f0e8f5',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: '#faf9f7',
                  resize: 'vertical'
                }}
              />
            </div>

            {message && (
              <div style={{
                marginBottom: '20px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: message.includes('successfully') ? '#f0fdf4' : '#fef2f2',
                color: message.includes('successfully') ? '#10b981' : '#ef4444',
                fontSize: '14px'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: '#d89fc2',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Saving...' : 'Save Cycle'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TrackCycle
