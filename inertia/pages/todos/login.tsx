import { Head, Link } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import FlashMessage from '../flash-message'
import GoogleAuthButton from '../auth/google-auth-button'
import { setTodoToken, todoRequest } from './auth'

export default function TodoLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)
  const [flash, setFlash] = useState<{ success?: string; error?: string }>({})

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setFlash({})

    try {
      const data = await todoRequest('/api/auth/todos/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!data?.token) {
        setFlash({ error: 'Login failed' })
        return
      }

      setTodoToken(data.token)
      window.location.href = '/todos'
    } catch (error) {
      setFlash({ error: error instanceof Error ? error.message : 'Login failed' })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <Head title="Todo Login" />
      <div className="min-h-screen bg-[#1C1C1E] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2C2C2E] border border-[#3A3A3C] hover:bg-[#3A3A3C] transition-colors duration-200"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
          <FlashMessage flash={flash} />
          <div className="bg-[#2C2C2E] rounded-xl p-6 border border-[#3A3A3C]">
            <h1 className="text-3xl font-bold mb-6">Todo Login</h1>
            <GoogleAuthButton href="/todos/google/redirect" />
            <form onSubmit={submit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 mb-4 bg-[#3A3A3C] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 mb-4 bg-[#3A3A3C] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-[#0A84FF] text-white px-4 py-3 rounded-lg hover:bg-[#0A74FF] disabled:opacity-50"
              >
                {processing ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="text-sm text-[#98989D] mt-4">
              Don&apos;t have an account? <Link href="/todos/signup" className="text-[#0A84FF]">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
