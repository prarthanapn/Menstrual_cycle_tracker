import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { cyclesAPI, symptomsAPI } from '../api'
import BottomNav from '../components/BottomNav'
import { Smile, Meh, Frown, Zap, AlertCircle, Activity, TrendingDown, Trash2 } from 'react-feather'

const moodOptions = [
  { value: 'happy', icon: Smile, label: 'Happy' },
  { value: 'neutral', icon: Meh, label: 'Neutral' },
  { value: 'sad', icon: Frown, label: 'Sad' },
  { value: 'irritable', icon: Zap, label: 'Irritable' },
  { value: 'tired', icon: AlertCircle, label: 'Tired' },
]

const dischargeOptions = [
  { value: 'clear', label: 'Clear' },
  { value: 'white', label: 'White' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'sticky', label: 'Sticky' },
  { value: 'none', label: 'None' },
]

const symptomBubbles = [
  { key: 'cramps', icon: Zap, label: 'Cramps' },
  { key: 'headache', icon: AlertCircle, label: 'Headache' },
  { key: 'bloating', icon: Activity, label: 'Bloating' },
  { key: 'nausea', icon: TrendingDown, label: 'Nausea' },
]

function LogSymptoms() {
  const [cycles, setCycles] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [cycleForDate, setCycleForDate] = useState(null)
  const [selectedCycleId, setSelectedCycleId] = useState(null)
  const [recentSymptoms, setRecentSymptoms] = useState([])

  const [symptoms, setSymptoms] = useState({
    cramps: false,
    headache: false,
    bloating: false,
    nausea: false,
  })
  const [mood, setMood] = useState('neutral')
  const [discharge, setDischarge] = useState('none')
  const [flow, setFlow] = useState('light')
  const [notes, setNotes] = useState('')
  const [isEndDate, setIsEndDate] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadCycles()
  }, [])

  const loadCycles = async () => {
    try {
      const res = await cyclesAPI.getAll()
      setCycles(res.data || [])
      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to load cycles')
    }
  }

  const loadSymptoms = async (cycleId) => {
    try {
      const res = await symptomsAPI.getByCycle(cycleId)
      setRecentSymptoms(res.data || [])
    } catch (err) {
      console.error('Load symptoms error:', err)
    }
  }

  const handleDeleteSymptom = async (symptomId) => {
    if (!window.confirm('Delete this symptom log?')) return
    try {
      // Note: You may need to add a deleteSymptom method to symptomsAPI
      // For now, we'll need to implement this in the API
      setError('Delete symptom feature coming soon')
    } catch (err) {
      console.error(err)
      setError('Failed to delete symptom')
    }
  }

  const handleEndDateUpdate = async (cycleId) => {
    if (!cycleId) return
    try {
      const today = new Date().toISOString().split('T')[0]
      await cyclesAPI.update(cycleId, { end_date: today })
      return true
    } catch (err) {
      console.error('Failed to update cycle end date:', err)
      setError('Failed to mark cycle end date')
      return false
    }
  }

  const startCycleForDate = async () => {
    setMessage('')
    setError('')
    if (!selectedDate) return setError('Select a date first')
    setLoading(true)
    try {
      const payload = {
        start_date: selectedDate.toISOString().split('T')[0],
        flow_level: flow || 'light',
        notes: 'Started from Log Symptoms'
      }

      await cyclesAPI.create(payload)
      // reload cycles and set the created cycle for date
      const res = await cyclesAPI.getAll()
      const updated = res.data || []
      setCycles(updated)
      const found = updated.find(c => c.start_date && c.start_date.startsWith(payload.start_date))
      setCycleForDate(found || null)
      setMessage('Cycle started for selected date ✅')
    } catch (err) {
      console.error('Start cycle error:', err)
      setError(err.response?.data?.error || err.message || 'Unable to start cycle')
    } finally {
      setLoading(false)
    }
  }

  const onDateSelect = (date) => {
    setMessage('')
    setError('')
    setSelectedDate(date)
    // find cycle that contains date
    const found = cycles.find(c => {
      if (!c.start_date) return false
      const s = new Date(c.start_date)
      const e = c.end_date ? new Date(c.end_date) : null
      const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s0 = new Date(s.getFullYear(), s.getMonth(), s.getDate())
      if (e) {
        const e0 = new Date(e.getFullYear(), e.getMonth(), e.getDate())
        return d0.getTime() >= s0.getTime() && d0.getTime() <= e0.getTime()
      }
      // ongoing cycle
      return d0.getTime() >= s0.getTime()
    })
    setCycleForDate(found || null)
    // reset symptoms when switching date
    setSymptoms({ cramps: false, headache: false, bloating: false, nausea: false })
    setMood('neutral')
    setDischarge('none')
    setFlow('light')
    setNotes('')
  }

  const toggleSymptom = (key) => {
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null
    // Mark dates that have symptoms logged with cyan/blue
    for (const s of recentSymptoms) {
      if (!s.log_date) continue
      const logDate = new Date(s.log_date)
      const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const ld = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate())
      if (d0.getTime() === ld.getTime()) return 'symptom-logged'
    }
    // Mark cycle dates
    if (cycleForDate) {
      const s = new Date(cycleForDate.start_date)
      const e = cycleForDate.end_date ? new Date(cycleForDate.end_date) : null
      const d0 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s0 = new Date(s.getFullYear(), s.getMonth(), s.getDate())
      if (d0.getTime() === s0.getTime()) return 'cycle-start'
      if (e) {
        const e0 = new Date(e.getFullYear(), e.getMonth(), e.getDate())
        if (d0.getTime() > s0.getTime() && d0.getTime() <= e0.getTime()) return 'cycle-range'
      } else {
        const today = new Date()
        const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        if (d0.getTime() > s0.getTime() && d0.getTime() <= t0.getTime()) return 'cycle-range'
      }
    }
    return null
  }

  const handleSave = async () => {
    setMessage('')
    setError('')
    // default log date to today if not selected
    const useDate = selectedDate || new Date()

    // prefer explicit cycle selected in dropdown, else use cycleForDate discovered from date
    let targetCycle = cycleForDate
    if (!targetCycle && selectedCycleId) {
      targetCycle = cycles.find(c => String(c.cycle_id) === String(selectedCycleId) || String(c.cycle_id) === String(selectedCycleId))
    }

    if (!targetCycle) {
      setError('Please select a cycle before logging symptoms')
      return
    }

    setLoading(true)
    try {
      const payload = {
        cycle_id: targetCycle.cycle_id || targetCycle.id || targetCycle._id,
        log_date: useDate.toISOString().split('T')[0],
        mood,
        cramps: symptoms.cramps ? 1 : 0,
        headache: symptoms.headache ? 1 : 0,
        bloating: symptoms.bloating ? 1 : 0,
        nausea: symptoms.nausea ? 1 : 0,
        discharge,
        notes,
      }

      await symptomsAPI.log(payload)
      
      // If end date toggle is checked, update cycle with end date
      if (isEndDate) {
        const success = await handleEndDateUpdate(targetCycle.cycle_id || targetCycle.id || targetCycle._id)
        if (success) {
          setMessage('Symptoms saved + Cycle end date updated! ✅')
        } else {
          setMessage('Symptoms saved! ✅ (Could not update end date)')
        }
      } else {
        setMessage('Symptoms logged successfully! ✅')
      }
      
      setTimeout(() => {
        setMessage('')
        setSelectedDate(null)
        setCycleForDate(null)
        setSymptoms({ cramps: false, headache: false, bloating: false, nausea: false })
        setMood('neutral')
        setDischarge('none')
        setFlow('light')
        setNotes('')
        setIsEndDate(false)
      }, 1500)
      
      await loadCycles()
    } catch (err) {
      console.error('Save error:', err)
      setError(err.response?.data?.error || err.message || 'Save failed - please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Log Symptoms 📝
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Track how you're feeling throughout your cycle
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '20px' }}>
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Calendar */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', margin: 0 }}>
            Select Date
          </h2>
          <style>{`
            .react-calendar {
              width: 100%;
              border: none;
              background: transparent;
              font-family: inherit;
            }
            .react-calendar__tile {
              padding: 8px !important;
              height: 44px;
              font-size: 13px;
              border-radius: 8px;
              color: var(--text-primary);
              transition: all 0.2s;
            }
            .react-calendar__tile:hover {
              background: var(--bg-secondary) !important;
            }
            .react-calendar__tile--active {
              background: var(--primary) !important;
              color: white !important;
            }
            .react-calendar__month-view__weekdays {
              color: var(--text-secondary);
              font-weight: 600;
              font-size: 12px;
              padding-bottom: 8px;
            }
            .react-calendar__navigation {
              margin-bottom: 12px;
            }
            .react-calendar__navigation__label {
              font-weight: 700;
              color: var(--text-primary);
            }
            .react-calendar__navigation button {
              color: var(--text-primary);
              border: 1px solid var(--border-color);
              background: var(--bg-secondary);
              border-radius: 6px;
              padding: 6px 10px;
              font-size: 13px;
              transition: all 0.2s;
            }
            .react-calendar__navigation button:hover {
              background: var(--primary);
              color: white;
              border-color: var(--primary);
            }
            .cycle-start {
              background: var(--primary) !important;
              color: white !important;
              font-weight: 700;
            }
            .cycle-range {
              background: rgba(230, 62, 156, 0.1) !important;
              color: var(--primary) !important;
            }
            .symptom-logged {
              background: rgba(59, 130, 246, 0.2) !important;
              color: #3B82F6 !important;
              font-weight: 600;
            }
          `}</style>
          <Calendar onClickDay={onDateSelect} tileClassName={tileClassName} />
          
          {/* Color Legend */}
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '12px' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>📚 Color Legend:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', background: 'var(--primary)', borderRadius: '3px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Cycle Start</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', background: 'rgba(230, 62, 156, 0.1)', border: '1px solid rgba(230, 62, 156, 0.3)', borderRadius: '3px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Cycle Range</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '3px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Has Symptoms</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '16px', height: '16px', background: 'rgba(20, 184, 166, 0.2)', border: '1px solid rgba(20, 184, 166, 0.4)', borderRadius: '3px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Ended</span>
              </div>
            </div>
          </div>
        </div>

        {/* Symptom Form */}
        {selectedDate && (
          <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Date</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              {!cycleForDate && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.06)', padding: '8px 12px', borderRadius: '6px' }}>
                    ⚠️ No active cycle for this date.
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button onClick={startCycleForDate} className="btn btn-primary" style={{ padding: '8px 12px' }} disabled={loading}>
                      {loading ? 'Starting...' : 'Start cycle for this date'}
                    </button>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Or go to <strong>Track Cycle</strong> to start and manage cycles.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cycle selector: allow choosing an existing cycle by start_date */}
            {cycles.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Choose Cycle</label>
                <select value={selectedCycleId || ''} onChange={(e) => {
                  const id = e.target.value || null
                  setSelectedCycleId(id)
                  const found = cycles.find(c => String(c.cycle_id) === String(id) || String(c.cycle_id) === String(id))
                  setCycleForDate(found || null)
                  if (found) {
                    loadSymptoms(found.cycle_id)
                  } else {
                    setRecentSymptoms([])
                  }
                }} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                  <option value="">-- Select cycle --</option>
                  {cycles.map(c => (
                    <option key={c.cycle_id} value={c.cycle_id}>{new Date(c.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {c.end_date ? '(Ended)' : '(Ongoing)'}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Cycle Info & Recent Symptoms */}
            {cycleForDate && (
              <div style={{ background: 'rgba(230, 62, 156, 0.06)', borderRadius: '8px', padding: '12px', marginBottom: '16px', border: '1px solid rgba(230, 62, 156, 0.2)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  📅 Cycle: {new Date(cycleForDate.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {cycleForDate.end_date && ` → ${new Date(cycleForDate.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                </div>
                {cycleForDate.flow_level && (
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Flow: <strong>{cycleForDate.flow_level}</strong>
                    {cycleForDate.discharge && ` • Discharge: ${cycleForDate.discharge}`}
                  </div>
                )}
                
                {/* Recent Symptoms List */}
                {recentSymptoms.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(230, 62, 156, 0.2)' }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      📊 Symptom Logs ({recentSymptoms.length})
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {recentSymptoms.map(s => (
                        <div key={s.symptom_id} style={{ background: 'var(--bg-primary)', padding: '8px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {new Date(s.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '2px' }}>
                              {s.mood && `Mood: ${s.mood}`}
                              {(s.cramps || s.headache || s.bloating || s.nausea) && (
                                <div style={{ marginTop: '2px' }}>
                                  {[s.cramps && 'Cramps', s.headache && 'Headache', s.bloating && 'Bloating', s.nausea && 'Nausea'].filter(Boolean).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteSymptom(s.symptom_id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0', opacity: 0.7, display: 'flex', alignItems: 'center' }}
                            onMouseEnter={(e) => e.parentElement.style.opacity = '1'}
                            onMouseLeave={(e) => e.parentElement.style.opacity = '0.7'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {cycleForDate && (
              <>
                {/* Symptoms Grid */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    How are you feeling?
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {symptomBubbles.map(({ key, icon: IconComponent, label }) => (
                      <button
                        key={key}
                        onClick={() => toggleSymptom(key)}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: '2px solid var(--border-color)',
                          background: symptoms[key] ? 'var(--primary)' : 'var(--bg-secondary)',
                          color: symptoms[key] ? 'white' : 'var(--text-primary)',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                        }}
                      >
                        <IconComponent size={18} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mood Section */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                    Mood
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {moodOptions.map(({ value, icon: IconComponent, label }) => (
                      <button
                        key={value}
                        onClick={() => setMood(value)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)',
                          background: mood === value ? 'var(--primary)' : 'var(--bg-secondary)',
                          color: mood === value ? 'white' : 'var(--text-primary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                        }}
                        title={label}
                      >
                        <IconComponent size={18} />
                        <span style={{ fontSize: '12px' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Flow & Discharge */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Flow
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                      {['light', 'medium', 'heavy'].map(f => (
                        <button
                          key={f}
                          onClick={() => setFlow(f)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: flow === f ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: flow === f ? 'white' : 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Discharge
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexDirection: 'column' }}>
                      {dischargeOptions.slice(0, 3).map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setDischarge(value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: discharge === value ? 'var(--primary)' : 'var(--bg-secondary)',
                            color: discharge === value ? 'white' : 'var(--text-primary)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    Notes (Optional)
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      minHeight: '80px',
                    }}
                  />
                </div>

                {/* End Date Toggle */}
                <div style={{ background: 'rgba(230, 62, 156, 0.1)', borderRadius: '12px', padding: '16px', marginBottom: '24px', border: '1px solid rgba(230, 62, 156, 0.2)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={isEndDate} 
                      onChange={(e) => setIsEndDate(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      🩷 Did your period end today?
                    </span>
                  </label>
                  {isEndDate && (
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px', marginLeft: '30px' }}>
                      The cycle will be marked as complete with today's date.
                    </div>
                  )}
                </div>

                {/* Message */}
                {message && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--success)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {message}
                  </div>
                )}

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '14px', fontWeight: 600, opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Saving...' : 'Save Symptoms'}
                </button>
              </>
            )}
          </div>
        )}

        {!selectedDate && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 20px' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
            <p>Select a date to log your symptoms</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default LogSymptoms