import React, { useEffect, useState } from 'react'
import { Download, FileText, AlertCircle, CheckCircle } from 'react-feather'
import { cyclesAPI } from '../api'
import api from '../api'
import BottomNav from '../components/BottomNav'

function Reports() {
  const [cycles, setCycles] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCyclesAndStats()
  }, [])

  const fetchCyclesAndStats = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await cyclesAPI.getAll()
      const cyclesData = res.data || []
      setCycles(cyclesData)

      // Calculate stats from cycles
      if (cyclesData.length > 0) {
        const completedCycles = cyclesData.filter(c => c.end_date)
        const avgCycleLength = completedCycles.length > 0
          ? Math.round(
              completedCycles.reduce((sum, c) => {
                const start = new Date(c.start_date)
                const end = new Date(c.end_date)
                return sum + (end - start) / (1000 * 60 * 60 * 24)
              }, 0) / completedCycles.length
            )
          : 0

        const lastCycle = cyclesData[0]
        const isRegular = completedCycles.length >= 2
          ? completedCycles.slice(0, 3).every(c => {
              const len = (new Date(c.end_date) - new Date(c.start_date)) / (1000 * 60 * 60 * 24)
              return Math.abs(len - avgCycleLength) <= 3
            })
          : null

        const nextPeriod = lastCycle && !lastCycle.end_date
          ? new Date(new Date(lastCycle.start_date).getTime() + (avgCycleLength * 24 * 60 * 60 * 1000))
          : null

        setStats({
          totalCycles: cyclesData.length,
          avgCycleLength,
          isRegular,
          nextPeriod,
          lastCycleStart: lastCycle?.start_date,
        })
      }
    } catch (err) {
      console.error(err)
      setError('Unable to fetch cycle data')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    setGenerating(true)
    setMessage('')
    setError('')
    try {
      // Call backend to generate report (requires auth)
      const res = await api.post('/reports/generate', {})
      const filename = res?.data?.filename
      if (!filename) {
        setMessage('📄 Report generated on server')
        setTimeout(() => setMessage(''), 5000)
      } else {
        // Attempt to download the generated file
        try {
          const dl = await api.get(`/reports/download/${encodeURIComponent(filename)}`, { responseType: 'blob' })
          const url = window.URL.createObjectURL(new Blob([dl.data]))
          const a = document.createElement('a')
          a.href = url
          a.download = filename
          document.body.appendChild(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(url)
          setMessage(`📄 Report downloaded: ${filename}`)
          setTimeout(() => setMessage(''), 5000)
        } catch (err) {
          console.error('Download failed:', err)
          setMessage(`📄 Report generated but download failed: ${filename}`)
          setTimeout(() => setMessage(''), 5000)
        }
      }
    } catch (err) {
      setError('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Health Reports 📊
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Track your cycle patterns and insights
            </p>
          </div>
          <button
            onClick={generateReport}
            disabled={generating}
            className="btn btn-primary btn-generate"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px', justifyContent: 'center' }}
          >
            {generating ? (
              <>
                <svg width="16" height="16" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="25" cy="25" r="20" stroke="white" strokeWidth="5" strokeLinecap="round" strokeDasharray="31.4 31.4" fill="none" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <FileText size={16} />
                Generate PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '20px' }}>
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
            Loading your data...
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Total Cycles
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                    {stats.totalCycles}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Avg Length
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--info)', marginTop: '4px' }}>
                    {stats.avgCycleLength} <span style={{ fontSize: '14px' }}>days</span>
                  </div>
                </div>

                <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Pattern
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    {stats.isRegular === null ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Need more data
                      </div>
                    ) : stats.isRegular ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)' }}>
                        <CheckCircle size={16} />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Regular</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning)' }}>
                        <AlertCircle size={16} />
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>Irregular</span>
                      </div>
                    )}
                  </div>
                </div>

                {stats.nextPeriod && (
                  <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      Next Period
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginTop: '4px' }}>
                      {formatDate(stats.nextPeriod)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cycles Table */}
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
                Cycle History
              </h2>

              {cycles.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '32px' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                  <p>No cycles tracked yet. Start tracking in the Track Cycle page.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Start Date
                        </th>
                        <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          End Date
                        </th>
                        <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Length
                        </th>
                        <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Flow
                        </th>
                        <th style={{ padding: '12px 0', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                          Pain
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cycles.map((c, idx) => {
                        const start = new Date(c.start_date)
                        const end = c.end_date ? new Date(c.end_date) : null
                        const length = end ? Math.round((end - start) / (1000 * 60 * 60 * 24)) : null
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                              {formatDate(c.start_date)}
                            </td>
                            <td style={{ padding: '12px 0', fontSize: '13px', color: 'var(--text-primary)' }}>
                              {c.end_date ? formatDate(c.end_date) : '🔴 Ongoing'}
                            </td>
                            <td style={{ padding: '12px 0', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>
                              {length ? `${length} days` : '—'}
                            </td>
                            <td style={{ padding: '12px 0', fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>
                              {c.flow_level ? c.flow_level.charAt(0).toUpperCase() + c.flow_level.slice(1) : '—'}
                            </td>
                            <td style={{ padding: '12px 0', fontSize: '13px', color: 'var(--text-primary)' }}>
                              {c.pain_level ? `${c.pain_level}/10` : '—'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Tips */}
            <div style={{ background: 'linear-gradient(135deg, rgba(230, 62, 156, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '12px', padding: '16px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                💡 Tips for Better Tracking
              </h3>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                <li>Log your symptoms daily for accurate patterns</li>
                <li>Note unusual changes in your cycle</li>
                <li>Track flow and pain levels consistently</li>
                <li>Use reports to discuss with your healthcare provider</li>
              </ul>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default Reports