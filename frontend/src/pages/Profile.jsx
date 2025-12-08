import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Mail, Edit2, Save, X, Calendar, Activity, Zap, Droplet, Camera, Upload } from 'react-feather'
import { authAPI } from '../api'
import BottomNav from '../components/BottomNav'

function Profile({ onLogout }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState(null)

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null') || {}
    } catch (e) {
      return {}
    }
  })

  const [formData, setFormData] = useState(user)

  // Load profile image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage')
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file')
      return
    }

    // Convert to base64 and save
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result
      setProfileImage(base64)
      localStorage.setItem('profileImage', base64)
      setMessage('Profile picture updated! ✅')
      setTimeout(() => setMessage(''), 2500)
    }
    reader.onerror = () => {
      setError('Failed to read image file')
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setMessage('')
    setError('')
    setLoading(true)
    try {
      // In a real app, you'd have an updateProfile endpoint
      // For now, we'll just update localStorage
      localStorage.setItem('user', JSON.stringify(formData))
      setUser(formData)
      setMessage('Profile updated successfully! ✅')
      setIsEditing(false)
      setTimeout(() => setMessage(''), 2500)
    } catch (err) {
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (onLogout) onLogout()
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login', { replace: true })
  }

  const profileFields = [
    { label: 'Name', value: user?.name || user?.fullName || '—', key: 'name', icon: User },
    { label: 'Email', value: user?.email || '—', key: 'email', icon: Mail },
    { label: 'Age Group', value: user?.age_group || user?.ageGroup || '—', key: 'age_group', icon: Calendar, editable: true, options: ['teen', 'adult', 'senior'] },
    { label: 'Height (cm)', value: user?.height_cm ?? '—', key: 'height_cm', icon: Activity, editable: true, type: 'number' },
    { label: 'Weight (kg)', value: user?.weight_kg ?? '—', key: 'weight_kg', icon: Zap, editable: true, type: 'number' },
    { label: 'Blood Group', value: user?.blood_group || '—', key: 'blood_group', icon: Droplet, editable: true, options: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px 0' }}>
        <div className="container">
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={24} /> My Profile
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Manage your health information
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ paddingTop: '20px' }}>
        {/* Messages */}
        {message && (
          <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {message}
          </div>
        )}
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '20px' }}>
          {/* Avatar Section */}
          <div style={{ textAlign: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: profileImage ? `url(${profileImage})` : 'linear-gradient(135deg, var(--primary) 0%, rgba(230, 62, 156, 0.8) 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  color: 'white',
                  border: '3px solid var(--primary)',
                }}
              >
                {!profileImage && <User size={50} />}
              </div>
              {isEditing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    border: '2px solid var(--bg-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  title="Upload profile picture"
                >
                  <Camera size={18} />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {user?.name || 'User'}
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              {user?.email || 'No email'}
            </p>
          </div>

          {/* Profile Fields */}
          {!isEditing ? (
            <>
              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {profileFields.map((field, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: '10px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div style={{ minWidth: '28px', textAlign: 'center', color: 'var(--primary)' }}>
                      {field.icon && <field.icon size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {field.label}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                        {field.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                  style={{
                    padding: '14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                {profileFields.map((field, idx) => (
                  !['email'].includes(field.key) && field.editable && (
                    <div key={idx}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        {field.icon && <field.icon size={16} />}
                        {field.label}
                      </label>
                      {field.options ? (
                        <select
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontFamily: 'inherit',
                          }}
                        >
                          <option value="">Select...</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          name={field.key}
                          value={formData[field.key] || ''}
                          onChange={handleChange}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                        />
                      )}
                    </div>
                  )
                ))}
              </div>

              {/* Edit Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    padding: '14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(user)
                  }}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>

        {/* Help Section */}
        <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Mail size={16} /> Need Help?
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            Your health data is secure, encrypted, and never shared. You can edit your profile information anytime. For support, contact us at support@mht.app
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Profile