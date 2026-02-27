import type { HttpContext } from '@adonisjs/core/http'

export default class AdminDashboardController {
  async show({ inertia }: HttpContext) {
    return inertia.render('admin/dashboard', {})
  }
}
