import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role from '#models/role'

export default class AdminSeeder extends BaseSeeder {
  async run() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const fullName = process.env.ADMIN_FULL_NAME ?? null

    if (!email || !password) {
      console.log('Skipping admin seeder: ADMIN_EMAIL or ADMIN_PASSWORD not set')
      return
    }

    await Role.updateOrCreateMany('name', [{ name: 'user' }, { name: 'admin' }])

    const adminRole = await Role.findByOrFail('name', 'admin')

    await User.updateOrCreate(
      { email },
      {
        fullName,
        password,
        roleId: adminRole.id,
      }
    )

    console.log(`Admin user seeded: ${email}`)
  }
}
