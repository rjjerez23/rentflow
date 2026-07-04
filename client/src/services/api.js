const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed')
    error.status = response.status
    error.errors = data.errors || []
    throw error
  }

  return data
}

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  return parseResponse(response)
}

export const api = {
  getHealth: () => request('/health'),
  list: (endpoint) => request(`/${endpoint}`),
  create: (endpoint, payload) => request(`/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  update: (endpoint, id, payload) => request(`/${endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }),
  remove: (endpoint, id) => request(`/${endpoint}/${id}`, {
    method: 'DELETE',
  }),
}

export { API_BASE_URL }
