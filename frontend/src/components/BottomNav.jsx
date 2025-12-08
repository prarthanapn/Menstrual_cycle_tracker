import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Calendar, Edit, BookOpen, MessageCircle, FileText, User } from 'react-feather'

function BottomNav() {
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/symptoms', label: 'Log', icon: <Edit size={20} /> },
    { path: '/education', label: 'Learn', icon: <BookOpen size={20} /> },
    { path: '/chatbot', label: 'Chat', icon: <MessageCircle size={20} /> },
    { path: '/reports', label: 'Reports', icon: <FileText size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> }
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-color)',
        padding: '8px 0',
        display: 'grid',
        gridTemplateColumns: `repeat(${navItems.length}, 1fr)`,
        gap: '0',
        zIndex: 100,
        boxShadow: 'var(--shadow-md)'
      }}
    >
      {navItems.map((item) => (
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
            color: location.pathname === item.path ? 'var(--primary)' : 'var(--text-tertiary)',
            fontWeight: location.pathname === item.path ? '600' : '500',
            fontSize: '12px',
            borderTop: location.pathname === item.path ? '3px solid var(--primary)' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ marginBottom: '4px', color: 'inherit' }}>{item.icon}</div>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default BottomNav
