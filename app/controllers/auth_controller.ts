import type { HttpContext } from '@adonisjs/core/http'
import crypto from 'node:crypto'
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

  async googleRedirect({ ally, session, request }: HttpContext) {
    const previousUrl = request.header('referer')
    const redirectUrl = previousUrl && !['/login', '/signup'].includes(new URL(previousUrl).pathname)
      ? previousUrl
      : '/notes'

    session.put('redirect.previousUrl', redirectUrl)
    return ally.use('google').redirect()
  }

  async googleCallback({ ally, auth, response, session }: HttpContext) {
    const google = ally.use('google')

    if (google.accessDenied()) {
      session.flash('error', 'Google login was cancelled')
      return response.redirect('/login')
    }

    if (google.stateMisMatch()) {
      session.flash('error', 'Google login session expired. Please try again')
      return response.redirect('/login')
    }

    if (google.hasError()) {
      session.flash('error', google.getError() || 'Google login failed')
      return response.redirect('/login')
    }

    const googleUser = await google.user()

    if (!googleUser.email || googleUser.emailVerificationState !== 'verified') {
      session.flash('error', 'Google account email must be verified')
      return response.redirect('/login')
    }

    let user = await User.findBy('googleId', googleUser.id)

    if (!user) {
      user = await User.findBy('email', googleUser.email)
    }

    if (user) {
      user.merge({
        googleId: user.googleId || googleUser.id,
        fullName: user.fullName || googleUser.name || googleUser.nickName || 'Google User',
      })

      await user.save()
    } else {
      user = await User.create({
        googleId: googleUser.id,
        email: googleUser.email,
        fullName: googleUser.name || googleUser.nickName || 'Google User',
        password: crypto.randomUUID(),
      })
    }

    await auth.use('web').login(user)
    session.flash('success', 'Logged in with Google successfully')
    const previousUrl = session.get('redirect.previousUrl', '/notes')
    session.forget('redirect.previousUrl')
    return response.redirect(previousUrl)
  }
}
