import React, { useEffect, useState } from 'react'
import api from '../services/api'
import BottomNav from '../components/BottomNav'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

const daysBetween = (a, b) => {
  const diff = Math.abs(new Date(b) - new Date(a))
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

const Dashboard = () => {
  const [cycles, setCycles] = useState([])
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        const userId = user?.id || user?._id || null

        const cyclesRes = userId ? await api.get(`/cycles/${userId}`) : await api.get('/cycles')
        const symptomsRes = await api.get('/symptoms/recent')

        const cyclesData = cyclesRes.data || []
        const symptomsData = symptomsRes.data || []

        setCycles(cyclesData)
        setSymptoms(symptomsData)
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Compute cycle statistics
  const cycleStarts = cycles
    .map(c => c.start_date)
    .filter(Boolean)
    .map(d => new Date(d))
    .sort((a, b) => a - b)

  const cycleLengths = []
  for (let i = 1; i < cycleStarts.length; i++) {
    cycleLengths.push(daysBetween(cycleStarts[i - 1], cycleStarts[i]))
  }

  const avg = cycleLengths.length ? Math.round(cycleLengths.reduce((s, v) => s + v, 0) / cycleLengths.length) : null
  const shortest = cycleLengths.length ? Math.min(...cycleLengths) : null
  const longest = cycleLengths.length ? Math.max(...cycleLengths) : null

  const variance = cycleLengths.length
    ? Math.sqrt(cycleLengths.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / cycleLengths.length)
    : 0

  const irregular = variance > 5

  // Prediction: use last cycle start + avg
  let prediction = null
  if (cycleStarts.length) {
    const lastStart = cycleStarts[cycleStarts.length - 1]
    const predictedDays = avg || 28
    const pred = new Date(lastStart)
    pred.setDate(pred.getDate() + predictedDays)
    prediction = pred
  }

  // Process symptoms into frequency map for chart
  const symptomCounts = {}
  symptoms.forEach(s => {
    // assume symptom entry might have `symptoms` array or `name`
    if (Array.isArray(s.symptoms)) {
      s.symptoms.forEach(name => {
        symptomCounts[name] = (symptomCounts[name] || 0) + 1
      })
    } else if (s.name) {
      symptomCounts[s.name] = (symptomCounts[s.name] || 0) + 1
    }
  })

  const chartData = Object.entries(symptomCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  return (
    <div style={{ background: '#fff7f9', minHeight: '100vh', paddingBottom: 100 }} className="p-4">
      <div className="container mx-auto max-w-3xl">
        <header className="flex items-center justify-between mb-4">
          <h2 style={{ color: '#ff5c77' }} className="text-2xl font-bold">Dashboard</h2>
          <div className="text-sm text-gray-500">Welcome back</div>
        </header>

        {loading ? (
          <div className="card rounded-2xl p-6">Loading dashboard...</div>
        ) : error ? (
          <div className="card rounded-2xl p-6 text-red-600">{error}</div>
        ) : (
          <>
            <section className="card rounded-2xl shadow-lg p-4 mb-4">
              <h3 style={{ color: '#ff5c77' }} className="font-semibold">Prediction</h3>
              <div className="mt-2">
                {prediction ? (
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{prediction.toDateString()}</div>
                ) : (
                  <div className="text-muted">Add more cycles to get predictions</div>
                )}
              </div>
            </section>

            {irregular && (
              <section className="card rounded-2xl shadow-lg p-4 mb-4" style={{ borderLeft: '4px solid #ff5c77' }}>
                <strong style={{ color: '#ff5c77' }}>Irregular cycle warning:</strong> Your cycle variance is high (greater than 5 days). Consider logging consistently and consulting a clinician.
              </section>
            )}

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="card rounded-2xl shadow-lg p-4">
                <div className="text-small">Average cycle length</div>
                <div className="text-2xl font-bold" style={{ color: '#ff5c77' }}>{avg ?? '—'}</div>
              </div>
              <div className="card rounded-2xl shadow-lg p-4">
                <div className="text-small">Shortest cycle</div>
                <div className="text-2xl font-bold" style={{ color: '#ff7a8a' }}>{shortest ?? '—'}</div>
              </div>
              <div className="card rounded-2xl shadow-lg p-4">
                <div className="text-small">Longest cycle</div>
                <div className="text-2xl font-bold" style={{ color: '#ff5c77' }}>{longest ?? '—'}</div>
              </div>
            </section>

            <section className="card rounded-2xl shadow-lg p-4 mb-4">
              <h3 style={{ color: '#ff5c77' }} className="font-semibold mb-2">Most common symptoms</h3>
              <div style={{ width: '100%', height: 240 }}>
                {chartData.length ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#ff7a8a" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-muted">No symptoms logged recently.</div>
                )}
              </div>
            </section>

            <section className="card rounded-2xl shadow-lg p-4 mb-8">
              <h3 style={{ color: '#ff5c77' }} className="font-semibold">Reminder</h3>
              <p style={{ color: '#8b7a8f', marginTop: 8 }}>
                Hormonal imbalance can cause irregular periods. Track consistently for better insights.
              </p>
            </section>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default Dashboard
