import React, { useEffect, useRef, useState } from 'react'
import { chatbotAPI } from '../api'
import BottomNav from '../components/BottomNav'
import { Send } from 'react-feather'

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    try {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    } catch (e) {
      // ignore
    }
  }

  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return

    const userMsg = { id: Date.now() + '-u', sender: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setSending(true)

    try {
      const res = await chatbotAPI.sendMessage(text)
      const botText = res?.data?.bot_response ?? 'I could not process your message. Please try again.'
      const triage = res?.data?.triage_level ?? 'normal'

      const botMsg = { id: Date.now() + '-b', sender: 'bot', text: botText, triage }
      setMessages((prev) => [...prev, botMsg])
    } catch (err) {
      const errorText = err.response?.data?.error || 'Sorry, I encountered an error. Please try again.'
      const botMsg = { id: Date.now() + '-b', sender: 'bot', text: errorText, triage: 'normal' }
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setSending(false)
    }
  }

  const getBadgeStyle = (triage) => {
    switch (triage) {
      case 'urgent':
        return { background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }
      case 'see_doctor':
        return { background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }
      default:
        return { background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)', padding: '16px 0', stickyTop: 0 }}>
        <div className="container">
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            Health Assistant 💬
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Ask me anything about your health
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', overflowY: 'auto' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
            <p>Hi! I'm your health assistant. Ask me any questions about your menstrual health.</p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-primary)',
                color: msg.sender === 'user' ? 'white' : 'var(--text-primary)',
                fontSize: '14px',
                lineHeight: '1.5',
                boxShadow: msg.sender === 'user' ? 'var(--shadow-md)' : 'none',
                border: msg.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
              }}
            >
              <div>{msg.text}</div>
              {msg.sender === 'bot' && msg.triage && (
                <div
                  style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    ...getBadgeStyle(msg.triage),
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {msg.triage === 'urgent' ? '🚨 Urgent' : msg.triage === 'see_doctor' ? '⚠️ Consult Doctor' : '✅ Normal'}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          position: 'fixed',
          bottom: '70px',
          left: 0,
          right: 0,
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-color)',
          padding: '12px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            disabled={sending}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              fontSize: '14px',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="btn btn-primary"
            style={{
              padding: '10px 16px',
              minWidth: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default Chatbot

