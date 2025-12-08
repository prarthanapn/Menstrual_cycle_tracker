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
    blood_group: 'O+',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required')
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

      if (response?.data?.token && response?.data?.user) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        setUser && setUser(response.data.user)
        navigate('/dashboard')
      } else {
        navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FEE2E2 0%, #FCE7F3 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          marginBottom: '32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>♀️</div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Create Your Account
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
          Join HarmonyCycle and take control of your health
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '32px',
        }}
      >
        {/* Error Message */}
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
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {/* Name */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              required
            />
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>At least 6 characters</p>
          </div>

          {/* Date of Birth */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Age Group and Blood Group */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
                Age Group
              </label>
              <select name="age_group" value={formData.age_group} onChange={handleChange}>
                <option value="teen">Teen (13-17)</option>
                <option value="adult">Adult (18+)</option>
              </select>
            </div>

            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
                Blood Group
              </label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          {/* Height and Weight */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
                Height (cm)
              </label>
              <input
                type="number"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleChange}
                placeholder="170"
              />
            </div>

            <div>
              <label style={{ marginBottom: '8px', display: 'block', fontSize: '14px', fontWeight: 500 }}>
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleChange}
                placeholder="65"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              fontWeight: 600,
              marginTop: '8px',
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '14px',
            color: 'var(--text-secondary)',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Register
