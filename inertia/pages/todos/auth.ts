const TODO_TOKEN_KEY = 'todo_token'

function getXsrfToken() {
  if (typeof document === 'undefined') {
    return null
  }

  const xsrfCookie = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('XSRF-TOKEN='))

  if (!xsrfCookie) {
    return null
  }

  return decodeURIComponent(xsrfCookie.split('=').slice(1).join('='))
}

export function getTodoToken() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(TODO_TOKEN_KEY)
}

export function setTodoToken(token: string) {
  window.localStorage.setItem(TODO_TOKEN_KEY, token)
}

export function clearTodoToken() {
  window.localStorage.removeItem(TODO_TOKEN_KEY)
}

export async function todoRequest(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getTodoToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const xsrfToken = getXsrfToken()
  if (xsrfToken) {
    headers.set('x-xsrf-token', xsrfToken)
  }

  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed')
  }

  return data
}
