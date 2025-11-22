import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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
  add: (start_date, end_date, flow_level, pain_level, notes) =>
    api.post('/cycles', { start_date, end_date, flow_level, pain_level, notes }),
  getAll: () =>
    api.get('/cycles'),
}

export const symptomsAPI = {
  add: (cycle_id, date, flow, mood, symptoms, notes) =>
    api.post('/symptoms', { cycle_id, date, flow, mood, symptoms, notes }),
  getByCycle: (cycle_id) =>
    api.get(`/symptoms/${cycle_id}`),
}

export const chatbotAPI = {
  sendMessage: (message) =>
    api.post('/chat', { user_message: message }),
}

export default api
