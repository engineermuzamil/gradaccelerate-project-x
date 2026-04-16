import { Head, usePage } from '@inertiajs/react'
import { useEffect } from 'react'
import { setTodoToken } from './auth'

export default function TodoGoogleCallback() {
  const { token } = usePage<{ token: string }>().props

  useEffect(() => {
    if (!token) {
      window.location.href = '/todos/login'
      return
    }

    setTodoToken(token)
    window.location.href = '/todos'
  }, [token])

  return (
    <>
      <Head title="Signing In" />
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center p-6">
        <p className="text-[#E5E5EA]">Signing you in to Todos...</p>
      </div>
    </>
  )
}
