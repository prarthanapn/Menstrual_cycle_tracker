import React, { useState, useEffect, useRef } from 'react'
import { chatbotAPI } from '../api'

function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m HarmonyCycle\'s AI companion. I\'m here to answer questions about your menstrual health, provide wellness tips, and support your health journey. What can I help you with today?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await chatbotAPI.sendMessage(input)
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.data.reply || response.data.bot_response || response.data.message || 'Thank you for your question. For personalized medical advice, please consult a healthcare professional.'
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'I apologize, I\'m having trouble responding right now. Please try again later.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#faf9f7' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid #f0e8f5', backgroundColor: 'white' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>Health Chat</h1>
        <p style={{ fontSize: '14px', color: '#8b7a8f' }}>Ask me anything about your health</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '80px' }}>
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: message.type === 'user' ? '#d89fc2' : 'white',
                color: message.type === 'user' ? 'white' : '#2d2624',
                border: message.type === 'user' ? 'none' : '1px solid #f0e8f5',
                lineHeight: '1.5'
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d89fc2', animation: 'bounce 1.4s infinite' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d89fc2', animation: 'bounce 1.4s infinite 0.2s' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d89fc2', animation: 'bounce 1.4s infinite 0.4s' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          position: 'fixed',
          bottom: '80px',
          left: '0',
          right: '0',
          padding: '16px 20px',
          backgroundColor: 'white',
          borderTop: '1px solid #f0e8f5',
          display: 'flex',
          gap: '12px'
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #f0e8f5',
            borderRadius: '24px',
            fontSize: '16px'
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn btn-primary"
          style={{ borderRadius: '24px', padding: '12px 24px' }}
        >
          Send
        </button>
      </form>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}

export default Chatbot
