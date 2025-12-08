import React, { useEffect, useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { cyclesAPI, symptomsAPI } from '../api'
import { X, Smile, Meh, Frown, Zap, AlertCircle, Heart } from 'react-feather'
import '../styles/CalendarPage.css'

function DetailModal({ isOpen, onClose, dateInfo }) {
  const elRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    const el = elRef.current
    if (mounted) {
      document.body.appendChild(el)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      try { document.body.removeChild(el) } catch (e) {}
    }
  }, [mounted, onClose])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} role="presentation">
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} aria-hidden="true" />
      <div 
        style={{
          position: 'relative',
          background: 'var(--bg-primary)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '480px',
          width: '90%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.3s ease-out'
        }}
        role="dialog" 
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s'
          }}
        >
          <X size={24} />
        </button>

        {/* Date Header */}
        <div style={{ marginBottom: '20px', paddingTop: '8px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
            📅 {dateInfo.date}
          </h2>
          <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-tertiary)' }}>
            {dateInfo.dayName}
          </p>
        </div>

        {/* No Data State */}
        {!dateInfo.cycleInfo && !dateInfo.symptoms?.length ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-tertiary)' }}>
            <p style={{ fontSize: '14px', margin: '0' }}>No cycle or symptom data for this date</p>
          </div>
        ) : (
          <>
            {/* Cycle Info Section */}
            {dateInfo.cycleInfo && (
              <div style={{
                background: 'rgba(230, 62, 156, 0.06)',
                border: '2px solid rgba(230, 62, 156, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: 'var(--primary)' }}>
                  {dateInfo.cycleInfo.type}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Cycle Duration */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>📅 Cycle Period:</span>
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                      {dateInfo.cycleInfo.startDate} → {dateInfo.cycleInfo.endDate || 'Ongoing'}
                    </span>
                  </div>

                  {/* Cycle Length */}
                  {dateInfo.cycleInfo.length && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>⏱️ Cycle Length:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {dateInfo.cycleInfo.length} days
                      </span>
                    </div>
                  )}

                  {/* Flow Level */}
                  {dateInfo.cycleInfo.flowLevel && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>💧 Flow Level:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {dateInfo.cycleInfo.flowLevel}
                      </span>
                    </div>
                  )}

                  {/* Discharge */}
                  {dateInfo.cycleInfo.discharge && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>💧 Discharge:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {dateInfo.cycleInfo.discharge}
                      </span>
                    </div>
                  )}

                  {/* Pain Level */}
                  {dateInfo.cycleInfo.painLevel && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>🩹 Pain Level:</span>
                      <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {dateInfo.cycleInfo.painLevel}/10
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {dateInfo.cycleInfo.notes && (
                    <div style={{ borderTop: '1px solid rgba(230, 62, 156, 0.1)', paddingTop: '10px', marginTop: '8px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        📝 Notes:
                      </p>
                      <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                        {dateInfo.cycleInfo.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Symptoms Section */}
            {dateInfo.symptoms && dateInfo.symptoms.length > 0 && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.06)',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={16} /> Symptom Logs ({dateInfo.symptoms.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dateInfo.symptoms.map((symptom, idx) => (
                    <div 
                      key={idx}
                      style={{
                        background: 'rgba(59, 130, 246, 0.03)',
                        border: '1px solid rgba(59, 130, 246, 0.1)',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    >
                      {/* Mood */}
                      {symptom.mood && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '14px' }}>
                          {symptom.mood === 'happy' && <Smile size={18} />}
                          {symptom.mood === 'neutral' && <Meh size={18} />}
                          {symptom.mood === 'sad' && <Frown size={18} />}
                          {symptom.mood === 'irritable' && <Zap size={18} />}
                          {symptom.mood === 'tired' && <AlertCircle size={18} />}
                          <span style={{ color: 'var(--text-secondary)' }}>
                            Mood: <strong style={{ color: 'var(--text-primary)' }}>{symptom.mood}</strong>
                          </span>
                        </div>
                      )}

                      {/* Symptoms List */}
                      {symptom.symptoms && symptom.symptoms.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Heart size={14} /> Symptoms:
                          </p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {symptom.symptoms.map((sym, idx) => (
                              <span
                                key={idx}
                                style={{
                                  display: 'inline-block',
                                  background: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  padding: '4px 10px',
                                  borderRadius: '16px',
                                  fontSize: '12px',
                                  fontWeight: '500'
                                }}
                              >
                                {sym}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Flow & Discharge */}
                      {(symptom.flow || symptom.discharge) && (
                        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', marginTop: '8px' }}>
                          {symptom.flow && (
                            <span style={{ color: 'var(--text-secondary)' }}>
                              Flow: <strong style={{ color: 'var(--text-primary)' }}>{symptom.flow}</strong>
                            </span>
                          )}
                          {symptom.discharge && (
                            <span style={{ color: 'var(--text-secondary)' }}>
                              Discharge: <strong style={{ color: 'var(--text-primary)' }}>{symptom.discharge}</strong>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes */}
                      {symptom.notes && (
                        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(59, 130, 246, 0.1)' }}>
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                            📝 Notes:
                          </p>
                          <p style={{ margin: '0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                            {symptom.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    elRef.current
  )
}

function CalendarPage() {
  const [cycles, setCycles] = useState([])
  const [allSymptoms, setAllSymptoms] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [dateInfo, setDateInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cyclesRes, symptomsRes] = await Promise.all([
        cyclesAPI.getAll(),
        symptomsAPI.getAll()
      ])
      setCycles(cyclesRes.data || [])
      setAllSymptoms(symptomsRes.data || [])
      setError('')
    } catch (err) {
      console.error(err)
      setError('Unable to load calendar data')
    } finally {
      setLoading(false)
    }
  }

  const tileClassName = ({ date }) => {
    let classes = []

    // Find cycle containing this date
    const cycle = cycles.find(c => {
      const start = new Date(c.start_date)
      const end = c.end_date ? new Date(c.end_date) : null
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const e = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null

      return d.getTime() === s.getTime() || (e && d.getTime() === e.getTime()) || 
             (d.getTime() > s.getTime() && e && d.getTime() <= e.getTime())
    })

    // Mark cycle dates
    if (cycle) {
      const start = new Date(cycle.start_date)
      const end = cycle.end_date ? new Date(cycle.end_date) : null
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const e = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null

      if (d.getTime() === s.getTime()) {
        classes.push('calendar-cycle-start')
      } else if (e && d.getTime() === e.getTime()) {
        classes.push('calendar-cycle-ended')
      } else if (d.getTime() > s.getTime() && e && d.getTime() <= e.getTime()) {
        classes.push('calendar-cycle-range')
      }
    }

    // Mark symptom dates
    const hasSymptom = allSymptoms.some(s => {
      if (!s.log_date) return false
      const logDate = new Date(s.log_date)
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const ld = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate())
      return d.getTime() === ld.getTime()
    })

    if (hasSymptom) {
      classes.push('calendar-symptom-logged')
    }

    return classes.join(' ')
  }

  const onDateClick = (date) => {
    const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    
    // Find cycle info for this date
    const cycle = cycles.find(c => {
      const start = new Date(c.start_date)
      const end = c.end_date ? new Date(c.end_date) : null
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const e = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null

      return d.getTime() === s.getTime() || (e && d.getTime() === e.getTime()) || 
             (d.getTime() > s.getTime() && e && d.getTime() <= e.getTime())
    })

    // Find symptoms for this date
    const dateSymptoms = allSymptoms.filter(s => {
      if (!s.log_date) return false
      const logDate = new Date(s.log_date)
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const ld = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate())
      return d.getTime() === ld.getTime()
    })

    // Determine cycle info type
    let cycleInfo = null
    if (cycle) {
      const start = new Date(cycle.start_date)
      const end = cycle.end_date ? new Date(cycle.end_date) : null
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const s = new Date(start.getFullYear(), start.getMonth(), start.getDate())
      const e = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null

      let type = ''
      if (d.getTime() === s.getTime()) {
        type = '🎉 Cycle Start Date'
      } else if (e && d.getTime() === e.getTime()) {
        type = '✅ Cycle End Date'
      } else {
        type = '📍 During Cycle'
      }

      const startDateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endDateStr = end ? end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null

      const cycleLength = end ? Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1 : null

      cycleInfo = {
        type,
        startDate: startDateStr,
        endDate: endDateStr,
        length: cycleLength,
        flowLevel: cycle.flow_level ? (cycle.flow_level.charAt(0).toUpperCase() + cycle.flow_level.slice(1)) : null,
        discharge: cycle.discharge ? (cycle.discharge.charAt(0).toUpperCase() + cycle.discharge.slice(1)) : null,
        painLevel: cycle.pain_level,
        notes: cycle.notes
      }
    }

    setDateInfo({
      date: dateStr,
      dayName,
      cycleInfo,
      symptoms: dateSymptoms.map(s => ({
        mood: s.mood,
        symptoms: s.symptoms ? s.symptoms.split(',').map(sy => sy.trim()) : [],
        flow: s.flow_level ? (s.flow_level.charAt(0).toUpperCase() + s.flow_level.slice(1)) : null,
        discharge: s.discharge ? (s.discharge.charAt(0).toUpperCase() + s.discharge.slice(1)) : null,
        notes: s.notes
      }))
    })
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh', paddingBottom: '100px' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading calendar...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '16px', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>
          📅 Calendar
        </h1>
        <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-tertiary)' }}>
          Click on any date to view cycle and symptom details
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Calendar */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Calendar
          value={selectedDate}
          onClickDay={onDateClick}
          tileClassName={tileClassName}
        />
      </div>

      {/* Color Legend */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
          📌 Legend
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {/* Cycle Start */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#E63E9C',
              flexShrink: 0
            }} />
            <div style={{ fontSize: '13px' }}>
              <p style={{ margin: '0', fontWeight: '600', color: 'var(--text-primary)' }}>Cycle Start</p>
              <p style={{ margin: '0', color: 'var(--text-tertiary)', fontSize: '12px' }}>First day</p>
            </div>
          </div>

          {/* Cycle Range */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(230, 62, 156, 0.2)',
              border: '2px solid #E63E9C',
              flexShrink: 0
            }} />
            <div style={{ fontSize: '13px' }}>
              <p style={{ margin: '0', fontWeight: '600', color: 'var(--text-primary)' }}>Cycle Range</p>
              <p style={{ margin: '0', color: 'var(--text-tertiary)', fontSize: '12px' }}>During cycle</p>
            </div>
          </div>

          {/* Cycle Ended */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '2px solid #22C55E',
              flexShrink: 0
            }} />
            <div style={{ fontSize: '13px' }}>
              <p style={{ margin: '0', fontWeight: '600', color: 'var(--text-primary)' }}>Cycle End</p>
              <p style={{ margin: '0', color: 'var(--text-tertiary)', fontSize: '12px' }}>Last day</p>
            </div>
          </div>

          {/* Symptom Logged */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '2px solid #3B82F6',
              flexShrink: 0
            }} />
            <div style={{ fontSize: '13px' }}>
              <p style={{ margin: '0', fontWeight: '600', color: 'var(--text-primary)' }}>Symptoms</p>
              <p style={{ margin: '0', color: 'var(--text-tertiary)', fontSize: '12px' }}>Logged symptoms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
