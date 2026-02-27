/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home', {}).as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])

    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])

    router.get('forgot-password', [controllers.PasswordReset, 'create']).as('passwordReset.create')
    router.post('forgot-password', [controllers.PasswordReset, 'store']).as('passwordReset.store')
    router
      .get('forgot-password/verify', [controllers.PasswordReset, 'verify'])
      .as('passwordReset.verify')
    router
      .post('forgot-password/verify', [controllers.PasswordReset, 'check'])
      .as('passwordReset.check')
    router
      .get('forgot-password/reset', [controllers.PasswordReset, 'resetForm'])
      .as('passwordReset.resetForm')
    router
      .post('forgot-password/reset', [controllers.PasswordReset, 'reset'])
      .as('passwordReset.reset')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])
    router.get('dashboard', [controllers.Dashboard, 'show']).as('dashboard')
  })
  .use(middleware.auth())

router
  .group(() => {
    router.get('admin/dashboard', [controllers.AdminDashboard, 'show']).as('admin.dashboard')
  })
  .use([middleware.auth(), middleware.admin()])
