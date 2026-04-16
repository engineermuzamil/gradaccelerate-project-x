import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import FlashMessage from '../flash-message'
import GoogleAuthButton from './google-auth-button'

export default function Signup() {
  const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props
  const { data, setData, post, processing } = useForm({
    fullName: '',
    email: '',
    password: '',
  })

  return (
    <>
      <Head title="Sign Up" />
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
            <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
            <GoogleAuthButton />
            <form
              onSubmit={(e) => {
                e.preventDefault()
                post('/auth/session/signup')
              }}
            >
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => setData('fullName', e.target.value)}
                placeholder="Full name"
                className="w-full px-4 py-3 mb-4 bg-[#3A3A3C] text-white rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:outline-none"
                required
              />
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
                {processing ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-sm text-[#98989D] mt-4">
              Already have an account? <Link href="/login" className="text-[#0A84FF]">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
