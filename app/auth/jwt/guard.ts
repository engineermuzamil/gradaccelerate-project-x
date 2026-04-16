import jwt from 'jsonwebtoken'
import type { HttpContext } from '@adonisjs/core/http'
import { symbols, errors } from '@adonisjs/auth'
import type { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'

type JwtGuardOptions = {
  secret: string
}

type JwtGuardUser<RealUser> = {
  getId(): string | number | BigInt
  getOriginal(): RealUser
}

type JwtUserProviderContract<RealUser> = {
  [symbols.PROVIDER_REAL_USER]: RealUser
  createUserForGuard(user: RealUser): Promise<JwtGuardUser<RealUser>>
  findById(identifier: string | number | BigInt): Promise<JwtGuardUser<RealUser> | null>
}

export class JwtGuard<UserProvider extends JwtUserProviderContract<unknown>>
  implements GuardContract<UserProvider[typeof symbols.PROVIDER_REAL_USER]>
{
  declare [symbols.GUARD_KNOWN_EVENTS]: {}

  driverName = 'jwt' as const
  authenticationAttempted = false
  isAuthenticated = false
  user?: UserProvider[typeof symbols.PROVIDER_REAL_USER]

  #ctx: HttpContext
  #userProvider: UserProvider
  #options: JwtGuardOptions

  constructor(ctx: HttpContext, userProvider: UserProvider, options: JwtGuardOptions) {
    this.#ctx = ctx
    this.#userProvider = userProvider
    this.#options = options
  }

  async generate(user: UserProvider[typeof symbols.PROVIDER_REAL_USER]) {
    const providerUser = await this.#userProvider.createUserForGuard(user)
    const token = jwt.sign({ userId: providerUser.getId() }, this.#options.secret)

    return {
      type: 'bearer' as const,
      token,
    }
  }

  async authenticate(): Promise<UserProvider[typeof symbols.PROVIDER_REAL_USER]> {
    if (this.authenticationAttempted) {
      return this.getUserOrFail()
    }

    this.authenticationAttempted = true

    const authHeader = this.#ctx.request.header('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!token) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    const payload = jwt.verify(token, this.#options.secret)

    if (typeof payload !== 'object' || !('userId' in payload)) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    const providerUser = await this.#userProvider.findById(payload.userId as string | number | BigInt)

    if (!providerUser) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    this.user = providerUser.getOriginal()
    this.isAuthenticated = true

    return this.getUserOrFail()
  }

  async check() {
    try {
      await this.authenticate()
      return true
    } catch {
      return false
    }
  }

  getUserOrFail(): UserProvider[typeof symbols.PROVIDER_REAL_USER] {
    if (!this.user) {
      throw new errors.E_UNAUTHORIZED_ACCESS('Unauthorized access', {
        guardDriverName: this.driverName,
      })
    }

    return this.user
  }

  async authenticateAsClient(
    user: UserProvider[typeof symbols.PROVIDER_REAL_USER]
  ): Promise<AuthClientResponse> {
    const token = await this.generate(user)

    return {
      headers: {
        authorization: `Bearer ${token.token}`,
      },
    }
  }
}
