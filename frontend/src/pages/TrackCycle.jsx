import React, { useEffect, useState, useRef, memo, useCallback } from 'react'
import ReactDOM from 'react-dom'
import { cyclesAPI } from '../api'
import BottomNav from '../components/BottomNav'
import { Calendar as CalendarIcon, Trash, Plus } from 'react-feather'

function ModalPortal({ isOpen, onClose, children, labelledBy }) {
  const elRef = useRef(null)
  const [mounted, setMounted] = useState(false)

  if (!elRef.current) {
    elRef.current = document.createElement('div')
  }

  useEffect(() => {
    const el = elRef.current
    document.body.appendChild(el)
    setMounted(true)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      try { document.body.removeChild(el) } catch (e) {}
    }
  }, [onClose])

  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }} role="presentation">
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={onClose} aria-hidden="true" />
      <div 
        style={{
          position: 'relative',
          background: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '400px',
          width: '90%',
          boxShadow: 'var(--shadow-lg)',
          animation: 'slideUp 0.3s ease-out'
        }}
        role="dialog" 
        aria-modal="true" 
        aria-labelledby={labelledBy}
      >
        {children}
      </div>
    </div>,
    elRef.current
  )
}

// Memoized form to prevent re-renders when parent state changes
const TrackCycleForm = memo(({
  selectedDate,
  flowLevel,
  setFlowLevel,
  painLevel,
  setPainLevel,
  discharge,
  setDischarge,
  notes,
  setNotes,
  onSave,
  onClose,
  loading,
  message,
  error,
}) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 id="track-title" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarIcon size={18} /> Start Cycle
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '20px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: 0,
          }}
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          Date: <strong style={{ color: 'var(--text-primary)' }}>{selectedDate?.toDateString()}</strong>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Flow Intensity
          </div>
          <select value={flowLevel} onChange={(e) => setFlowLevel(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option value="light">Low</option>
            <option value="medium">Medium</option>
            <option value="heavy">High</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Pain Level
            </div>
            <div style={{ fontSize: '13px', color: 'var(--warning)', fontWeight: 700 }}>
              {painLevel}/10
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            value={painLevel}
            onChange={(e) => setPainLevel(parseInt(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary)' }}
            aria-label="Pain level"
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Discharge
          </div>
          <select value={discharge} onChange={(e) => setDischarge(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
            <option value="none">None</option>
            <option value="spotting">Spotting</option>
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Notes (Optional)
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
            placeholder="Add any notes..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', minHeight: '60px' }}
          />
        </div>

        {message && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--success)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onSave}
          disabled={loading}
          className="btn btn-primary"
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            fontWeight: 600,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Saving...' : 'Start Cycle'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
})

function TrackCycle() {
  const [cycles, setCycles] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [flowLevel, setFlowLevel] = useState('light')
  const [painLevel, setPainLevel] = useState(3)
  const [discharge, setDischarge] = useState('none')
  const [notes, setNotes] = useState('')
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



  const handleDelete = async (cycleId) => {
    if (!window.confirm('Are you sure you want to delete this cycle and all associated symptoms?')) {
      return
    }
    try {
      await cyclesAPI.delete(cycleId)
      setMessage('Cycle deleted successfully ✅')
      await loadCycles()
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Delete failed')
    }
  }

  const handleSave = async () => {
    setError('')
    setMessage('')
    if (!selectedDate) return
    setLoading(true)
    try {
      const isoDate = selectedDate.toISOString().split('T')[0]

      // Create cycle with start date, flow level, pain level, and discharge
      await cyclesAPI.create({
        start_date: isoDate,
        flow_level: flowLevel,
        pain_level: painLevel,
        discharge: discharge,
        notes: notes
      })
      setMessage('Cycle started! ✅ Log symptoms daily to track your cycle.')
      setModalOpen(false)
      setFlowLevel('light')
      setPainLevel(3)
      setDischarge('none')
      setNotes('')
      await loadCycles()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const flowPills = ['light', 'medium', 'heavy']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Track Cycle <CalendarIcon size={24} />
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Click a date to start or close a cycle
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '20px' }}>
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Start New Cycle Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => {
              setSelectedDate(new Date())
              setModalOpen(true)
            }}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <Plus size={20} /> Start New Cycle
          </button>
        </div>

        {/* Recent Cycles */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            Recent Cycles
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {cycles.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '24px' }}>
                No cycles tracked yet. Click a date to start!
              </div>
            ) : (
              cycles.slice(0, 5).map(c => {
                const start = new Date(c.start_date)
                const end = c.end_date ? new Date(c.end_date) : null
                const length = end ? Math.round((end - start) / (1000 * 60 * 60 * 24)) : null
                return (
                  <div
                    key={c.id || c._id || c.cycle_id}
                    style={{
                      background: 'var(--bg-primary)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {end ? `Ended ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Ongoing'}
                        {length && ` • ${length} days`}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Flow</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginTop: '2px' }}>
                          {c.flow_level ? c.flow_level.charAt(0).toUpperCase() + c.flow_level.slice(1) : '-'}
                        </div>
                      </div>
                      {c.pain_level && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pain</div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--warning)', marginTop: '2px' }}>
                            {c.pain_level}/10
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleDelete(c.id || c._id || c.cycle_id)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--danger)',
                          background: 'transparent',
                          color: 'var(--danger)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                        onMouseEnter={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.1)' }}
                        onMouseLeave={(e) => { e.target.style.background = 'transparent' }}
                        title="Delete this cycle"
                      >
                        <Trash size={12} /> Delete
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <ModalPortal isOpen={modalOpen} onClose={() => setModalOpen(false)} labelledBy="track-title">
        <TrackCycleForm
          selectedDate={selectedDate}
          flowLevel={flowLevel}
          setFlowLevel={setFlowLevel}
          painLevel={painLevel}
          setPainLevel={setPainLevel}
          discharge={discharge}
          setDischarge={setDischarge}
          notes={notes}
          setNotes={setNotes}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
          loading={loading}
          message={message}
          error={error}
        />
      </ModalPortal>

      <BottomNav />
    </div>
  )
}

export default TrackCycle
