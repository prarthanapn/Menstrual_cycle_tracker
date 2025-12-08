import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api'

function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    age_group: 'adult',
    height_cm: '',
    weight_kg: '',
    blood_group: 'O+'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill the required fields')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.register(
        formData.name,
        formData.email,
        formData.password,
        formData.dob,
        formData.age_group,
        formData.height_cm ? parseInt(formData.height_cm) : null,
        formData.weight_kg ? parseInt(formData.weight_kg) : null,
        formData.blood_group
      )

      // If backend returns token + user, store and log in
      if (response?.data?.token && response?.data?.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUser && setUser(response.data.user)
        navigate('/dashboard')
      } else {
        // otherwise redirect to login page
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '900px', marginBottom: '40px', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '18px' }}>♀️</span>
            </div>
            <h1 style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: 700, margin: 0 }}>HarmonyCycle</h1>
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Home</Link>
            <Link to="/about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>About</Link>
            <Link to="/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>Login</Link>
          </nav>
        </div>
      </div>

      {/* Form Card */}
      <div style={{ width: '100%', maxWidth: '420px' }} className="card">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🌸</div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', margin: 0 }}>
            Create Account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Let's get to know you better
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px', marginBottom: '20px', color: 'var(--danger)', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Sarah Johnson"
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>8+ characters recommended</p>
          </div>

          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Age Group</label>
              <select
                name="age_group"
                value={formData.age_group}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              >
                <option value="teen">Teen</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Height (cm)</label>
              <input
                type="number"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                placeholder="165"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                placeholder="60"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '15px', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: 600, marginTop: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, cursor: 'pointer' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
