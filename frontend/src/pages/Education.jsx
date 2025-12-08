import React, { useState } from 'react'
import { Play, BookOpen, Video, Zap, Award, Calendar, Droplet, Coffee, Activity, Heart } from 'react-feather'
import BottomNav from '../components/BottomNav'

export default function Education() {
  const [expandedSection, setExpandedSection] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)

  const videoContent = [
    {
      id: 1,
      title: 'Understanding Your Menstrual Cycle',
      description: 'Learn about the four phases of your cycle and what happens in your body.',
      duration: '12:34',
      thumbnail: '📅',
      videoId: '7HlHGLr1hTA', // Proper YouTube video ID
    },
    {
      id: 2,
      title: 'Managing PMS Naturally',
      description: 'Natural strategies and lifestyle changes to manage premenstrual syndrome.',
      duration: '8:45',
      thumbnail: '🌿',
      videoId: '4Zxep0PBnsM',
    },
    {
      id: 3,
      title: 'Nutrition & Your Cycle',
      description: 'How to eat right during different phases of your menstrual cycle.',
      duration: '15:20',
      thumbnail: '🥗',
      videoId: 'DUYgzSZViyQ',
    },
    {
      id: 4,
      title: 'Exercise & Menstruation',
      description: 'Best workouts for each phase of your cycle and when to rest.',
      duration: '10:15',
      thumbnail: '💪',
      videoId: 'jBnf12rYBKg',
    },
    {
      id: 5,
      title: 'Mental Health & Your Cycle',
      description: 'How hormonal changes affect mood and mental well-being.',
      duration: '11:22',
      thumbnail: '🧠',
      videoId: 'x5Oj_z4CGMU',
    },
    {
      id: 6,
      title: 'Fertility Awareness',
      description: 'Understanding ovulation and fertility signs.',
      duration: '14:10',
      thumbnail: '🌸',
      videoId: 'N2m6ydIZ8XE',
    },
  ]

  const articles = [
    {
      category: '📚 Cycle Basics',
      items: [
        'What is a normal cycle?',
        'Understanding cycle phases',
        'Irregular cycles explained',
        'When to see a doctor',
        'Cycle length variations',
        'First period guidance',
      ],
    },
    {
      category: '💊 Symptoms & Health',
      items: [
        'Cramps: Causes & relief',
        'Mood changes during cycle',
        'Heavy flow management',
        'Endometriosis insights',
        'PMS vs PMDD',
        'Managing migraines',
      ],
    },
    {
      category: '🧘 Wellness & Lifestyle',
      items: [
        'Yoga for menstrual health',
        'Sleep and your cycle',
        'Stress management tips',
        'Sexual wellness guide',
        'Meditation practices',
        'Journaling benefits',
      ],
    },
    {
      category: '🏥 Medical Information',
      items: [
        'Birth control options',
        'PCOS explained',
        'Hormonal changes',
        'When to consult a doctor',
        'Fertility tracking',
        'Menstrual disorders',
      ],
    },
  ]

  const tips = [
    { icon: null, iconComponent: Activity, title: 'Stay Hydrated', description: 'Drink 8-10 glasses of water daily, especially during menstruation.' },
    { icon: null, iconComponent: Calendar, title: 'Track Your Cycle', description: 'Monitor patterns for 3 months to understand your unique cycle.' },
    { icon: null, iconComponent: Activity, title: 'Practice Yoga', description: 'Gentle yoga can help reduce cramps and improve circulation.' },
    { icon: null, iconComponent: Activity, title: 'Get Rest', description: 'Aim for 7-9 hours of quality sleep each night.' },
    { icon: null, iconComponent: Coffee, title: 'Eat Well', description: 'Include iron-rich foods during your period.' },
    { icon: null, iconComponent: Activity, title: 'Exercise Mindfully', description: 'Light to moderate exercise can ease symptoms.' },
    { icon: null, iconComponent: Droplet, title: 'Use Heat Therapy', description: 'Apply a warm compress to your lower abdomen for cramp relief.' },
    { icon: null, iconComponent: BookOpen, title: 'Educate Yourself', description: 'Learn about your body to reduce anxiety and improve self-care.' },
    { icon: null, iconComponent: Heart, title: 'Seek Support', description: 'Talk to friends, family, or professionals about your experiences.' },
    { icon: null, iconComponent: Zap, title: 'Skincare Routine', description: 'Adjust your skincare based on hormonal changes throughout your cycle.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #e63e9c 0%, #6366f1 100%)', color: 'white', padding: '48px 0', position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Learn & Grow</h1>
          <p style={{ fontSize: '16px', opacity: 0.95, margin: '12px 0 0 0', fontWeight: 300 }}>
            Evidence-based information about menstrual health and wellness
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Featured Video Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #e63e9c 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={18} style={{ color: 'white' }} />
            </div>
            Featured Videos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {videoContent.map(video => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Video Thumbnail */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #e63e9c 0%, #6366f1 100%)',
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Gradient overlay with pattern */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }}
                  />
                  
                  {/* Background circle */}
                  <div
                    style={{
                      position: 'absolute',
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  
                  {/* Play button */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 10,
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <Play size={28} fill="white" style={{ color: '#e63e9c', marginLeft: '2px' }} />
                  </div>
                </div>

                {/* Video Info */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: '6px', lineHeight: '1.4' }}>
                    {video.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, marginBottom: '8px', lineHeight: '1.4' }}>
                    {video.description}
                  </p>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    ⏱️ {video.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Grid */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #e63e9c 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} style={{ color: 'white' }} />
            </div>
            Daily Tips & Wellness
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {tips.map((tip, idx) => {
              const IconComponent = tip.iconComponent
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid var(--border-color)',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(230, 62, 156, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                    }}
                  >
                    <IconComponent size={24} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
                    {tip.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                    {tip.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Articles Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #e63e9c 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={18} style={{ color: 'white' }} />
            </div>
            Knowledge Base
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {articles.map((section, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {section.category}
                  </h3>
                </div>
                {expandedSection === idx && (
                  <div style={{ padding: '16px' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)' }}>
                      {section.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          style={{
                            fontSize: '13px',
                            marginBottom: '8px',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            color: 'var(--text-secondary)',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Myths & Facts Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.5px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #e63e9c 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={18} style={{ color: 'white' }} />
            </div>
            Common Myths & Facts
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { myth: 'Myth: You can\'t get pregnant during your period.', fact: 'Fact: While less likely, it\'s possible to ovulate early and conceive during menstruation.' },
              { myth: 'Myth: PMS is just in your head.', fact: 'Fact: PMS is a real hormonal condition affecting mood, energy, and physical symptoms.' },
              { myth: 'Myth: Menstruation stops during pregnancy.', fact: 'Fact: Some women experience light bleeding early in pregnancy, but true periods stop.' },
              { myth: 'Myth: Exercise worsens menstrual cramps.', fact: 'Fact: Light exercise can actually help reduce cramps by releasing endorphins.' },
              { myth: 'Myth: All women have 28-day cycles.', fact: 'Fact: Normal cycles range from 21-35 days; variations are common and usually normal.' },
              { myth: 'Myth: Tampons can get lost inside you.', fact: 'Fact: Tampons cannot travel beyond the vagina; they stay in place until removed.' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(230, 62, 156, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.background = 'var(--bg-primary)'
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '8px', color: '#ef4444', fontWeight: 600 }}>✗ {item.myth}</div>
                <div style={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>✓ {item.fact}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', marginBottom: '40px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--warning)', margin: '0 0 12px 0' }}>
            ⚠️ Medical Disclaimer
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
            This educational content is for informational purposes only and is not a substitute for professional medical advice. Always consult with a healthcare provider for personalized medical guidance. If you experience severe symptoms or have medical concerns, please contact a doctor immediately.
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px',
          }}
          onClick={() => setSelectedVideo(null)}
        >
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: '12px',
              overflow: 'hidden',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Container */}
            <div style={{ aspectRatio: '16/9', background: 'black', position: 'relative' }}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
              />
            </div>

            {/* Video Info */}
            <div style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0' }}>
                {selectedVideo.title}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                {selectedVideo.description}
              </p>
              <button
                onClick={() => setSelectedVideo(null)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Close Video
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}

