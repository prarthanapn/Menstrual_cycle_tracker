import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api'

function Register({ setUser }) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age_group: '',
    dob: '',
    height_cm: '',
    weight_kg: '',
    blood_group: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const questions = [
    { key: 'name', question: "Hi! What's your name?", type: 'text', placeholder: 'Enter your full name' },
    { key: 'email', question: "Great! What's your email address?", type: 'email', placeholder: 'Enter your email' },
    { key: 'password', question: "Create a secure password", type: 'password', placeholder: 'Enter password' },
    { key: 'confirmPassword', question: "Confirm your password", type: 'password', placeholder: 'Confirm password' },
    { key: 'age_group', question: "Are you a teen or adult?", type: 'select', options: ['teen', 'adult'] },
    { key: 'dob', question: "When were you born?", type: 'date' },
    { key: 'height_cm', question: "What's your height in cm?", type: 'number', placeholder: 'e.g., 165' },
    { key: 'weight_kg', question: "What's your weight in kg?", type: 'number', placeholder: 'e.g., 60' },
    { key: 'blood_group', question: "What's your blood group?", type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] }
  ]

  const handleChange = (value) => {
    setFormData(prev => ({
      ...prev,
      [questions[step].key]: value
    }))
  }

  const handleNext = () => {
    if (step === 2 && formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (step === 3 && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await authAPI.register(
        formData.name,
        formData.email,
        formData.password,
        formData.dob,
        formData.age_group,
        parseInt(formData.height_cm),
        parseInt(formData.weight_kg),
        formData.blood_group
      )
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setUser(response.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = questions[step]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FDECEF 0%, #F6F0FF 50%, #FFF3E4 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px 30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#FFE7EF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '24px'
          }}>
            💕
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#2d2624' }}>
            Welcome to HarmonyCycle
          </h1>
          <p style={{ color: '#8b7a8f', fontSize: '14px' }}>
            Let's get to know you better
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '20px',
            color: '#2d2624'
          }}>
            {currentQuestion.question}
          </h2>

          {currentQuestion.type === 'select' ? (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  onClick={() => handleChange(option)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '25px',
                    border: formData[currentQuestion.key] === option ? '2px solid #d89fc2' : '1px solid #f0e8f5',
                    background: formData[currentQuestion.key] === option ? '#fdecef' : 'white',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              ))}
            </div>
          ) : (
            <input
              type={currentQuestion.type}
              value={formData[currentQuestion.key]}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              style={{
                width: '100%',
                padding: '15px',
                border: '1px solid #f0e8f5',
                borderRadius: '12px',
                fontSize: '16px',
                background: '#faf9f7',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d89fc2'}
              onBlur={(e) => e.target.style.borderColor = '#f0e8f5'}
            />
          )}
        </div>

        {error && (
          <div style={{
            color: '#ef4444',
            fontSize: '14px',
            marginBottom: '20px',
            padding: '10px',
            background: '#fef2f2',
            borderRadius: '8px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                padding: '12px 24px',
                borderRadius: '25px',
                border: '1px solid #f0e8f5',
                background: 'white',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!formData[currentQuestion.key] || loading}
            style={{
              padding: '12px 24px',
              borderRadius: '25px',
              border: 'none',
              background: '#d89fc2',
              color: 'white',
              cursor: formData[currentQuestion.key] && !loading ? 'pointer' : 'not-allowed',
              fontWeight: '600',
              opacity: formData[currentQuestion.key] && !loading ? 1 : 0.6
            }}
          >
            {loading ? 'Creating...' : step === questions.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <span style={{ color: '#8b7a8f', fontSize: '14px' }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#d89fc2', textDecoration: 'none', fontWeight: '600' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
