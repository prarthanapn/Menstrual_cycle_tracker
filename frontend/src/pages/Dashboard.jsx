import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cyclesAPI, symptomsAPI } from '../api'
import BottomNav from '../components/BottomNav'
import { Calendar, Heart, TrendingUp, AlertCircle, LogOut } from 'react-feather'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const daysBetween = (a, b) => {
  const diff = Math.abs(new Date(b) - new Date(a))
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate()
  const [cycles, setCycles] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(userData)

    const fetchCycles = async () => {
      setLoading(true)
      try {
        const res = await cyclesAPI.getAll()
        setCycles(res.data || [])
        // fetch symptoms for charts
        try {
          const s = await symptomsAPI.getAll()
          setSymptoms(s.data || [])
        } catch (e) {
          // ignore symptom fetch error
        }
      } catch (err) {
        setError('Failed to load cycles')
      } finally {
        setLoading(false)
      }
    }

    fetchCycles()
  }, [])

  const [symptoms, setSymptoms] = useState([])

  // Calculate statistics
  const cycleStarts = cycles
    .map((c) => c.start_date)
    .filter(Boolean)
    .map((d) => new Date(d))
    .sort((a, b) => a - b)

  const cycleLengths = []
  for (let i = 1; i < cycleStarts.length; i++) {
    cycleLengths.push(daysBetween(cycleStarts[i - 1], cycleStarts[i]))
  }

  // Chart data computations
  // Common Symptoms Chart (counts)
  const symptomCounts = symptoms.reduce((acc, s) => {
    if (s.symptoms && Array.isArray(s.symptoms)) {
      s.symptoms.forEach((sym) => {
        acc[sym] = (acc[sym] || 0) + 1
      })
    }
    return acc
  }, {})

  const symptomLabels = Object.keys(symptomCounts)
  const symptomValues = symptomLabels.map((k) => symptomCounts[k])

  // Cycle Frequency: group cycles by month (last 6 months)
  const cyclesByMonth = {}
  cycles
    .map((c) => c.start_date)
    .filter(Boolean)
    .forEach((d) => {
      const dt = new Date(d)
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
      cyclesByMonth[key] = (cyclesByMonth[key] || 0) + 1
    })

  const monthLabels = Object.keys(cyclesByMonth).sort()
  const monthValues = monthLabels.map((k) => cyclesByMonth[k])

  // Cycle Trend: labels are start dates (skip first) and values are cycleLengths
  const trendLabels = cycleStarts.slice(1).map((d) => d.toLocaleDateString())
  const trendValues = cycleLengths

  // Next predicted period representation: last start -> predicted date
  // nextMarkerLabels will be computed after nextPeriod is available

  const avgLength = cycleLengths.length
    ? Math.round(cycleLengths.reduce((s, v) => s + v, 0) / cycleLengths.length)
    : 28

  const variance =
    cycleLengths.length > 0
      ? Math.sqrt(cycleLengths.reduce((s, v) => s + Math.pow(v - avgLength, 2), 0) / cycleLengths.length)
      : 0

  const isIrregular = variance > 5

  // Predict next period
  let nextPeriod = null
  if (cycleStarts.length > 0) {
    const lastStart = cycleStarts[cycleStarts.length - 1]
    const pred = new Date(lastStart)
    pred.setDate(pred.getDate() + avgLength)
    nextPeriod = pred
  }

  // Next predicted period representation: last start -> predicted date
  const nextMarkerLabels = []
  const nextMarkerValues = []
  if (cycleStarts.length > 0 && nextPeriod) {
    const last = cycleStarts[cycleStarts.length - 1]
    nextMarkerLabels.push(last.toLocaleDateString())
    nextMarkerValues.push(0)
    nextMarkerLabels.push(nextPeriod.toLocaleDateString())
    nextMarkerValues.push(1)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>Loading...</div>
          <p style={{ color: 'var(--text-secondary)' }}>Getting your health data ready</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '100px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Welcome back, {user?.name || 'User'}!
            </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
        Let's track your health together
      </p>
    </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '8px',
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '20px' }}>
            {/* Charts Section */}
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Data Analysis
            </h2>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {/* Common Symptoms Chart */}
              <div className="card" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Common Symptoms</h3>
                {symptomLabels.length > 0 ? (
                  <Bar
                    data={{
                      labels: symptomLabels,
                      datasets: [
                        {
                          label: 'Reports',
                          data: symptomValues,
                          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#9B59B6', '#2ECC71'],
                        },
                      ],
                    }}
                    options={{ responsive: true, plugins: { legend: { display: false } } }}
                  />
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>No symptom data available</div>
                )}
              </div>

              {/* Cycle Frequency Chart */}
              <div className="card" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Cycle Frequency (by month)</h3>
                {monthLabels.length > 0 ? (
                  <Bar
                    data={{ labels: monthLabels, datasets: [{ label: 'Cycles', data: monthValues, backgroundColor: '#36A2EB' }] }}
                    options={{ responsive: true }}
                  />
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>No cycle data available</div>
                )}
              </div>

              {/* Next Predicted Period */}
              <div className="card" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Next Predicted Period</h3>
                {nextMarkerLabels.length > 0 ? (
                  <Line
                    data={{ labels: nextMarkerLabels, datasets: [{ label: 'Next', data: nextMarkerValues, fill: false, borderColor: '#FF6384', tension: 0.4, pointRadius: 6 }] }}
                    options={{ responsive: true, scales: { y: { display: false } }, plugins: { legend: { display: false } } }}
                  />
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>Not enough data to predict</div>
                )}
              </div>

              {/* Cycle Trend Chart */}
              <div className="card" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>Cycle Length Trend</h3>
                {trendLabels.length > 0 ? (
                  <Line
                    data={{ labels: trendLabels, datasets: [{ label: 'Cycle Length (days)', data: trendValues, borderColor: '#2ECC71', backgroundColor: 'rgba(46,204,113,0.2)', tension: 0.2 }] }}
                    options={{ responsive: true }}
                  />
                ) : (
                  <div style={{ color: 'var(--text-secondary)' }}>Not enough cycle history</div>
                )}
              </div>
            </div>
        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '20px',
              color: 'var(--danger)',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '32px' }}>
          <button
            onClick={() => navigate('/track')}
            className="card"
            style={{
              padding: '16px',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--bg-primary)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📅</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Track Cycle</div>
          </button>

          <button
            onClick={() => navigate('/symptoms')}
            className="card"
            style={{
              padding: '16px',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--bg-primary)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💭</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Log Symptoms</div>
          </button>

          <button
            onClick={() => navigate('/chatbot')}
            className="card"
            style={{
              padding: '16px',
              textAlign: 'center',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--bg-primary)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💬</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>Ask AI</div>
          </button>
        </div>

        {/* Stats Grid */}
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
          Your Cycle Overview
        </h2>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '32px' }}>
          {/* Average Cycle Length */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Calendar size={20} style={{ color: 'var(--primary)' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Avg. Cycle Length</div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-primary)' }}>{avgLength} days</div>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
              Based on {cycleLengths.length} cycles
            </p>
          </div>

          {/* Cycle Status */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Heart size={20} style={{ color: isIrregular ? 'var(--warning)' : 'var(--success)' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Cycle Status</div>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: isIrregular ? 'var(--warning)' : 'var(--success)' }}>
              {isIrregular ? 'Irregular' : 'Regular'}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
              {isIrregular ? 'Variation detected' : 'Consistent pattern'}
            </p>
          </div>

          {/* Next Period */}
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Next Period</div>
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {nextPeriod ? nextPeriod.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
              {nextPeriod
                ? `In ${daysBetween(new Date(), nextPeriod)} days`
                : 'Log cycles to predict'}
            </p>
          </div>
        </div>

        {/* Cycles List */}
        {cycles.length > 0 && (
          <>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Recent Cycles
            </h2>

            <div style={{ display: 'grid', gap: '12px' }}>
              {cycles.slice(-5).map((cycle) => (
                <div key={cycle.id || cycle._id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          marginBottom: '4px',
                        }}
                      >
                        {new Date(cycle.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                        Flow: {cycle.flow_level || 'Not logged'} | Pain: {cycle.pain_level || 'N/A'}
                      </p>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '12px' }}>
                      {cycle.cycle_length || '?'} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default Dashboard
