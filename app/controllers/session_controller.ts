import User from '#models/user'
import { errors as authErrors } from '@adonisjs/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    return inertia.render('auth/login', {})
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.all()

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      await user.load('role')

      if (user.isAdmin) {
        return response.redirect().toRoute('admin.dashboard')
      }
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
        session.flash('errorsBag', { E_INVALID_CREDENTIALS: 'Invalid email or password.' })
        return response.redirect().back()
      }
      throw error
    }
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
