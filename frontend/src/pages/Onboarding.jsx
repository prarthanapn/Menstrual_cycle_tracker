import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Calendar, MessageSquare, Zap, MessageCircle } from 'react-feather'

function Onboarding({ setUser }) {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  const steps = [
    {
      title: 'Welcome to HarmonyCycle',
      content: 'Your safe space for tracking menstrual health',
      icon: Star
    },
    {
      title: 'Track Your Cycle',
      content: 'Monitor your menstrual cycle and understand your patterns',
      icon: Calendar
    },
    {
      title: 'Log Your Symptoms',
      content: 'Record how you feel with mood, flow, and symptoms',
      icon: MessageSquare
    },
    {
      title: 'Get Insights',
      content: 'Receive AI-powered insights and health recommendations',
      icon: Zap
    },
    {
      title: 'Chat with Our AI',
      content: 'Ask questions and get personalized health guidance',
      icon: MessageCircle
    }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      navigate('/dashboard')
    }
  }

  const handleSkip = () => {
    navigate('/dashboard')
  }

  return (
    <div className="container" style={{ maxWidth: '500px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px', animation: 'float 3s ease-in-out infinite' }}>
          {React.createElement(steps[step].icon, { size: 80, color: 'var(--primary)' })}
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px' }}>
          {steps[step].title}
        </h1>
        <p style={{ fontSize: '18px', color: '#8b7a8f', marginBottom: '40px' }}>
          {steps[step].content}
        </p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px' }}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: idx === step ? '#d89fc2' : '#f0e8f5',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={handleSkip}>
            Skip
          </button>
          <button className="btn btn-primary" onClick={handleNext}>
            {step === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  )
}

export default Onboarding
