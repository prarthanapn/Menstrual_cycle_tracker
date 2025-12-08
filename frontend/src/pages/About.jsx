import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Shield, Users, Zap, Mail, ArrowRight } from 'react-feather'
import BottomNav from '../components/BottomNav'

function About() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, rgba(230, 62, 156, 0.8) 100%)', color: 'white', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0 }}>About MHT</h1>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: '8px 0 0 0' }}>
            Empowering your menstrual health journey
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '140px', maxWidth: '700px' }}>
        {/* Mission Section */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '28px' }}>💚</div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Our Mission</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: '1.6' }}>
                To empower individuals with comprehensive, personalized menstrual health tracking that integrates modern technology with health wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Why Track Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Why Track Your Cycle?</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>🎯</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Better Health Insights</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Understand your body patterns and predict cycles with accuracy.
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>📊</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Symptom Awareness</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Track symptoms and identify patterns unique to your body.
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>👨‍⚕️</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Doctor Conversations</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Share detailed reports with healthcare providers for better care.
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '24px', minWidth: '32px', textAlign: 'center' }}>🧠</div>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Cycle Syncing</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Align your activities with your cycle for optimal energy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Key Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(230, 62, 156, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📅</div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Cycle Tracking</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Track start & end dates</p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💊</div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Symptom Logging</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Record daily symptoms</p>
            </div>

            <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🤖</div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>AI Assistant</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>24/7 health guidance</p>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📊</div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Analytics</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Detailed reports & insights</p>
            </div>

            <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📚</div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Education</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Learn about your health</p>
            </div>

            <div style={{ background: 'rgba(6, 182, 212, 0.1)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔒</div>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Privacy</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Your data is protected</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Our Values</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>🛡️ Privacy First</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                Your health data is encrypted and never shared without your consent.
              </p>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>🤝 User-Centric</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                We build features based on your feedback and needs.
              </p>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>🌍 Inclusive</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                Available to all, regardless of background or circumstances.
              </p>
            </div>

            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>📖 Educational</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
                We empower with knowledge to understand your body better.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ background: 'linear-gradient(135deg, rgba(230, 62, 156, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', margin: 0 }}>Get in Touch</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '12px 0 0 0' }}>
            Have questions or feedback? We'd love to hear from you.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} style={{ color: 'var(--primary)' }} />
            <a href="mailto:support@mht.app" style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
              support@mht.app
            </a>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-secondary)', fontSize: '12px', borderTop: '1px solid var(--border-color)' }}>
          <p style={{ margin: 0 }}>
            © 2025 Menstrual Health Tracker. All rights reserved.
          </p>
          <p style={{ margin: '8px 0 0 0' }}>
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', marginRight: '16px', fontWeight: 600 }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', marginRight: '16px', fontWeight: 600 }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Contact</a>
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default About
