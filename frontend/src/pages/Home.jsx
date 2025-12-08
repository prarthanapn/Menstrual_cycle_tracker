import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Calendar, TrendingUp, MessageCircle, Award, Shield, UserPlus, Edit3 } from 'react-feather'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav
        style={{
          padding: '16px 0',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-primary)',
          zIndex: 40,
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ♀️ HarmonyCycle
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '100px 0', textAlign: 'center', background: 'linear-gradient(135deg, #FEE2E2 0%, #FCE7F3 100%)' }}>
        <div className="container">
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 700,
              marginBottom: '16px',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            Your Period, <span style={{ color: 'var(--primary)' }}>Your Insights</span>
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}
          >
            Track your menstrual cycle with confidence. Get AI-powered insights, predict patterns, and take control of your health with HarmonyCycle.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/register')}
              style={{ fontSize: '16px', padding: '12px 32px' }}
            >
              Get Started Free →
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/login')}
              style={{ fontSize: '16px', padding: '12px 32px' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 700,
              marginBottom: '48px',
              textAlign: 'center',
              color: 'var(--text-primary)',
            }}
          >
            Everything You Need
          </h2>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {[
              {
                icon: <Calendar size={32} style={{ color: 'var(--primary)' }} />,
                title: 'Smart Cycle Tracking',
                description: 'Easy calendar to log periods, predict cycles, and understand your patterns in real-time.',
              },
              {
                icon: <Heart size={32} style={{ color: 'var(--primary)' }} />,
                title: 'Symptom Logging',
                description: 'Track mood, flow, cramps, and symptoms. Identify triggers and patterns unique to you.',
              },
              {
                icon: <TrendingUp size={32} style={{ color: 'var(--primary)' }} />,
                title: 'AI Insights',
                description: 'Get personalized health insights and predictions powered by advanced AI analysis.',
              },
              {
                icon: <MessageCircle size={32} style={{ color: 'var(--primary)' }} />,
                title: 'Health Chatbot',
                description: 'Chat with our intelligent assistant for health advice, answers, and guidance 24/7.',
              },
              {
                icon: <Award size={32} style={{ color: 'var(--primary)' }} />,
                title: 'Health Reports',
                description: 'Generate detailed reports and share with your healthcare provider securely.',
              },
              {
                icon: <Shield size={32} style={{ color: 'var(--primary)' }} />,
                title: 'Privacy Protected',
                description: 'Your data is encrypted and secure. We never share your personal health information.',
              },
            ].map((feature, idx) => (
              <div key={idx} className="card" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-start' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 700,
              marginBottom: '48px',
              textAlign: 'center',
              color: 'var(--text-primary)',
            }}
          >
            Simple 4-Step Process
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '32px',
            }}
          >
            {[
              { step: '01', title: 'Create Account', icon: UserPlus },
              { step: '02', title: 'Log Your Cycle', icon: Calendar },
              { step: '03', title: 'Track Symptoms', icon: Edit3 },
              { step: '04', title: 'Get Insights', icon: TrendingUp },
            ].map((item, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '48px',
                    marginBottom: '16px',
                  }}
                >
                  {(() => {
                    const Icon = item.icon;
                    return <Icon size={48} color={'var(--primary)'} />;
                  })()}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginBottom: '8px',
                  }}
                >
                  {item.step}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '48px',
              textAlign: 'center',
            }}
          >
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50M+', label: 'Cycles Tracked' },
              { number: '99%', label: 'User Satisfaction' },
              { number: '24/7', label: 'AI Support' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div
                  style={{
                    fontSize: '44px',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginBottom: '8px',
                  }}
                >
                  {stat.number}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2
            style={{
              fontSize: '40px',
              fontWeight: 700,
              marginBottom: '48px',
              textAlign: 'center',
              color: 'var(--text-primary)',
            }}
          >
            Common Questions
          </h2>

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {[
              {
                q: 'Is my data secure?',
                a: 'Yes! All your health data is encrypted with industry-standard security. We never share your information.',
              },
              {
                q: 'Can I access it on mobile?',
                a: 'Yes! HarmonyCycle is fully responsive and works on all devices - phone, tablet, and desktop.',
              },
              {
                q: 'Do I need an account?',
                a: 'Yes, you need an account to track and access your data. It takes less than 2 minutes to sign up.',
              },
              {
                q: 'Is there a cost?',
                a: 'HarmonyCycle is free! Premium features may be available in the future.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="card" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {faq.q}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #FEE2E2 0%, #FCE7F3 100%)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '44px',
              fontWeight: 700,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Ready to Take Control?
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '32px',
            }}
          >
            Join thousands of women tracking their health with HarmonyCycle today
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/register')}
            style={{ fontSize: '16px', padding: '12px 32px' }}
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '32px 0',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-primary)',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '14px',
        }}
      >
        <div className="container">
          <p>&copy; 2025 HarmonyCycle. Your health, your control.</p>
        </div>
      </footer>
    </div>
  )
}
