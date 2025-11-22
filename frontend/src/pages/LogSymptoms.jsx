import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { symptomsAPI, cyclesAPI } from '../api'

function LogSymptoms({ user }) {
  const [cycles, setCycles] = useState([])
  const [selectedCycleId, setSelectedCycleId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [flow, setFlow] = useState('light')
  const [mood, setMood] = useState('happy')
  const [symptoms, setSymptoms] = useState({
    cramping: false,
    headache: false,
    fatigue: false,
    bloating: false,
    acne: false,
    backpain: false
  })
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  React.useEffect(() => {
    loadCycles()
  }, [])

  const loadCycles = async () => {
    try {
      const response = await cyclesAPI.getAll()
      setCycles(response.data)
      if (response.data.length > 0) {
        setSelectedCycleId(response.data[0].id.toString())
      }
    } catch (error) {
      console.error('Error loading cycles:', error)
    }
  }

  const handleSymptomChange = (symptom) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: !prev[symptom]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCycleId) {
      setMessage('Please select a cycle')
      return
    }

    setLoading(true)
    try {
      const activeSymptoms = Object.keys(symptoms).filter(key => symptoms[key])
      await symptomsAPI.add(selectedCycleId, date, flow, mood, activeSymptoms, notes)
      setMessage('Symptoms logged successfully!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to log symptoms')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Log Your Symptoms</h1>
      <p style={{ color: '#8b7a8f', marginBottom: '32px' }}>How are you feeling today?</p>

      <form onSubmit={handleSubmit} className="card">
        <div className="input-group">
          <label>Select Cycle</label>
          <select value={selectedCycleId} onChange={(e) => setSelectedCycleId(e.target.value)} required>
            <option value="">Choose a cycle...</option>
            {cycles.map(cycle => (
              <option key={cycle.id} value={cycle.id}>
                {new Date(cycle.start_date).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Flow</label>
          <select value={flow} onChange={(e) => setFlow(e.target.value)}>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="heavy">Heavy</option>
            <option value="none">None</option>
          </select>
        </div>

        <div className="input-group">
          <label>Mood</label>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['happy', 'neutral', 'sad', 'anxious', 'energetic'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: mood === m ? '2px solid #d89fc2' : '1px solid #f0e8f5',
                  backgroundColor: mood === m ? '#fdecef' : 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px'
                }}
              >
                {m === 'happy' && '😊'} {m === 'neutral' && '😐'} {m === 'sad' && '😢'} {m === 'anxious' && '😰'} {m === 'energetic' && '⚡'}
                <span style={{ marginLeft: '8px' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Symptoms</label>
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.keys(symptoms).map(symptom => (
              <label key={symptom} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '12px', backgroundColor: '#faf9f7', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  checked={symptoms[symptom]}
                  onChange={() => handleSymptomChange(symptom)}
                  style={{ marginRight: '12px', width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: '500' }}>{symptom.charAt(0).toUpperCase() + symptom.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label>Notes (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about your symptoms..."
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #f0e8f5',
              borderRadius: '8px',
              fontSize: '16px',
              background: '#faf9f7',
              resize: 'vertical'
            }}
          />
        </div>

        {message && (
          <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#10b981', fontSize: '14px' }}>
            {message}
          </div>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Saving...' : 'Log Symptoms'}
        </button>
      </form>
    </div>
  )
}

export default LogSymptoms
