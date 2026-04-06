import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import FlashMessage from '../flash-message'

export default function Login() {
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props
  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
  })

  return (
    <>
      <Head title="Login" />
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
            <h1 className="text-3xl font-bold mb-6">Login</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                post('/auth/session/login')
              }}
            >
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 mb-4 bg-[#3A3A3C] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                required
              />
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
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
              Don&apos;t have an account? <Link href="/signup" className="text-[#0A84FF]">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
