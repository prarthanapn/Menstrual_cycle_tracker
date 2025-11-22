import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: '🏠' },
    { path: '/track', label: 'Track', icon: '📅' },
    { path: '/symptoms', label: 'Log', icon: '📝' },
    { path: '/education', label: 'Learn', icon: '📚' },
    { path: '/chatbot', label: 'Chat', icon: '💬' },
    { path: '/profile', label: 'Profile', icon: '👤' }
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'white',
        borderTop: '1px solid #f0e8f5',
        padding: '8px 0',
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '0',
        zIndex: '100'
      }}
    >
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
            textDecoration: 'none',
            color: location.pathname === item.path ? '#d89fc2' : '#8b7a8f',
            fontWeight: location.pathname === item.path ? '600' : '500',
            fontSize: '12px',
            borderTop: location.pathname === item.path ? '2px solid #d89fc2' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default BottomNav
