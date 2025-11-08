// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || '/api'

export const getApiUrl = (endpoint) => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}${endpoint}`
  }
  return endpoint
}
