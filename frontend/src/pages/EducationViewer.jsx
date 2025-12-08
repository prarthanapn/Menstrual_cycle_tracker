import React, { useEffect, useState } from 'react'

// Viewer shows one tip at a time with next/previous and transitions
export default function EducationViewer({ tips = [], initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex)
  const tip = tips[index]
  const [anim, setAnim] = useState('fade-in')

  useEffect(() => {
    setAnim('fade-in')
  }, [index])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index])

  const handleNext = () => {
    setAnim('slide-left')
    setTimeout(() => setIndex((i) => Math.min(i + 1, tips.length - 1)), 180)
  }
  const handlePrev = () => {
    setAnim('slide-right')
    setTimeout(() => setIndex((i) => Math.max(i - 1, 0)), 180)
  }

  if (!tip) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,6,8,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 900, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#fff6f9' }}>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: 16 }}>&larr; Back to All Tips</button>
          <div style={{ fontWeight: 700, color: '#ff5c77' }}>{tip.title}</div>
          <div style={{ width: 96, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={handlePrev} disabled={index === 0} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: index === 0 ? '#fee' : '#ffdce6' }}>← Prev</button>
            <button onClick={handleNext} disabled={index === tips.length - 1} style={{ padding: '8px 12px', borderRadius: 10, border: 'none', background: index === tips.length - 1 ? '#fee' : '#ff6b81', color: 'white' }}>Next →</button>
          </div>
        </div>

        <div style={{ background: 'white', padding: 20, minHeight: 420 }} className={anim}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
            <div>
              <p style={{ marginTop: 0, fontSize: 18, color: '#4a2a36' }}>{tip.description}</p>
              <ul style={{ lineHeight: 1.8, marginTop: 12 }}>
                {tip.points.map((p, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>• {p}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={tip.video}
                  title={tip.title}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 12 }}
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 220ms ease both; }
        .slide-left { animation: slideLeft 220ms ease both; }
        .slide-right { animation: slideRight 220ms ease both; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(16px) } to { opacity: 1; transform: none } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-16px) } to { opacity: 1; transform: none } }
      `}</style>
    </div>
  )
}
