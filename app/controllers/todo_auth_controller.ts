import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class TodoAuthController {
  async signup({ request, response }: HttpContext) {
    const data = request.only(['fullName', 'email', 'password'])

    const existingUser = await User.findBy('email', data.email)
    if (existingUser) {
      return response.badRequest({ message: 'Email is already in use' })
    }

    const user = await User.create({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    })

    const token = await User.accessTokens.create(user)

    return response.created({
      message: 'Signup successful',
      token: token.value!.release(),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      const token = await User.accessTokens.create(user)

      return response.ok({
        message: 'Login successful',
        token: token.value!.release(),
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } catch {
      return response.unauthorized({ message: 'Invalid email or password' })
    }
  }

  async logout({ auth, response }: HttpContext) {
    const user = auth.use('api').getUserOrFail()
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return response.ok({ message: 'Logout successful' })
  }
}
