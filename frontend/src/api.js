import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_BASE_URL || '').replace(/\/$/, '')
const API_URL = BASE_URL ? `${BASE_URL}/api` : '/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (name, email, password, dob, age_group, height_cm, weight_kg, blood_group) =>
    api.post('/auth/register', { name, email, password, dob, age_group, height_cm, weight_kg, blood_group }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    api.get('/users/profile'),
}

export const cyclesAPI = {
  create: (data) =>
    api.post('/cycles', data),
  // getAll will request cycles for the current logged-in user if available
  getAll: () => {
    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.user_id || user?.userId || null
      if (userId) return api.get(`/cycles/${userId}`)
    } catch (e) {
      // ignore parse errors and fallback
    }
    return api.get('/cycles')
  },
  update: (id, data) =>
    api.put(`/cycles/${id}`, data),
  delete: (id) =>
    api.delete(`/cycles/${id}`),
}

export const symptomsAPI = {
  log: (data) =>
    api.post('/symptoms', data),
  getByCycle: (cycle_id) =>
    api.get(`/symptoms/${cycle_id}`),
  getAll: () =>
    api.get('/symptoms'),
}

export const chatbotAPI = {
  sendMessage: (message) =>
    api.post('/chat', { user_message: message }),
}

export default api
