import React from 'react'

function Education({ user }) {
  const educationTopics = [
    {
      title: 'Understanding Your Cycle',
      icon: '📅',
      content: 'Learn about the four phases of your menstrual cycle: Menstruation, Follicular, Ovulation, and Luteal phases. Each phase has unique characteristics and hormonal changes.'
    },
    {
      title: 'Common Symptoms',
      icon: '🌸',
      content: 'Discover what symptoms are normal during different cycle phases, including cramps, mood changes, bloating, and fatigue. Learn when to seek medical attention.'
    },
    {
      title: 'Nutrition & Wellness',
      icon: '🥗',
      content: 'Explore how nutrition affects your cycle. Learn about foods that can help with PMS symptoms, iron-rich foods for heavy periods, and maintaining hormonal balance.'
    },
    {
      title: 'Exercise & Movement',
      icon: '🏃‍♀️',
      content: 'Find out how different types of exercise can benefit you during various cycle phases. From gentle yoga during menstruation to high-intensity workouts during ovulation.'
    },
    {
      title: 'Mental Health',
      icon: '🧠',
      content: 'Understand the connection between your cycle and mental health. Learn coping strategies for PMS-related mood changes and when to seek professional help.'
    },
    {
      title: 'When to See a Doctor',
      icon: '🏥',
      content: 'Know the signs that indicate you should consult a healthcare professional, including irregular cycles, severe pain, or unusual symptoms.'
    }
  ]

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Health Education</h1>
        <p style={{ color: '#8b7a8f' }}>Learn about your menstrual health and wellness</p>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {educationTopics.map((topic, index) => (
          <div key={index} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '32px' }}>{topic.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{topic.title}</h3>
                <p style={{ color: '#8b7a8f', lineHeight: '1.5' }}>{topic.content}</p>
              </div>
              <div style={{ fontSize: '20px', color: '#d89fc2' }}>→</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '32px', backgroundColor: '#f6f0ff', border: 'none' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>💡 Quick Tips</h3>
        <ul style={{ color: '#2d2624', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Track your cycle for at least 3 months to understand your patterns</li>
          <li>Stay hydrated and maintain a balanced diet</li>
          <li>Regular exercise can help reduce PMS symptoms</li>
          <li>Get enough sleep (7-9 hours per night)</li>
          <li>Manage stress through meditation or relaxation techniques</li>
          <li>Keep a symptom journal to identify triggers</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: '16px', backgroundColor: '#fdecef', border: 'none' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>⚠️ Important Note</h3>
        <p style={{ color: '#2d2624', lineHeight: '1.5' }}>
          This educational content is for informational purposes only and is not a substitute for professional medical advice.
          Always consult with a healthcare provider for personalized medical guidance and treatment.
        </p>
      </div>
    </div>
  )
}

export default Education
