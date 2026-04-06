import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class AuthController {
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  async showSignup({ inertia }: HttpContext) {
    return inertia.render('auth/signup')
  }

  async signup({ request, response, auth, session }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])

    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      session.flash('error', 'Email is already in use')
      return response.redirect().back()
    }

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    await auth.use('web').login(user)
    session.flash('success', 'Account created successfully')
    return response.redirect('/notes')
  }

  async login({ request, response, auth, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      session.flash('success', 'Logged in successfully')
      return response.redirect('/notes')
    } catch {
      session.flash('error', 'Invalid email or password')
      return response.redirect().back()
    }
  }

  async logout({ response, auth, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Logged out successfully')
    return response.redirect('/login')
  }
}
