import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api'

function Profile({ user, onLogout }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      setProfile(response.data)
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfile(null) // Set to null to show error state
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="container" style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Your Profile</h1>

      {loading ? (
        <p>Loading profile...</p>
      ) : profile ? (
        <>
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>👤</div>
              <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{profile.name}</h2>
              <p style={{ color: '#8b7a8f' }}>{profile.email}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Age Group</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>{profile.age_group || 'Not specified'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Date of Birth</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Not specified'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Height</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>{profile.height_cm ? `${profile.height_cm} cm` : 'Not specified'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Weight</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>{profile.weight_kg ? `${profile.weight_kg} kg` : 'Not specified'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Blood Group</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>{profile.blood_group || 'Not specified'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#8b7a8f', textTransform: 'uppercase', marginBottom: '8px' }}>Member Since</p>
                <p style={{ fontSize: '20px', fontWeight: '700' }}>{new Date(profile.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '24px', backgroundColor: '#f6f0ff', border: 'none' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Health Tips</h3>
            <ul style={{ color: '#2d2624', lineHeight: '1.8', paddingLeft: '20px' }}>
              <li>Track your cycle regularly for better accuracy</li>
              <li>Stay hydrated throughout your cycle</li>
              <li>Log your symptoms daily for insights</li>
              <li>Chat with our AI for personalized advice</li>
              <li>Consider your nutrition during different phases</li>
            </ul>
          </div>

          <button onClick={handleLogout} className="btn" style={{ width: '100%', backgroundColor: '#ef4444', color: 'white' }}>
            Sign Out
          </button>
        </>
      ) : (
        <p>Error loading profile</p>
      )}
    </div>
  )
}

export default Profile
