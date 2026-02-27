/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  passwordReset: {
    create: typeof routes['passwordReset.create']
    store: typeof routes['passwordReset.store']
    verify: typeof routes['passwordReset.verify']
    check: typeof routes['passwordReset.check']
    resetForm: typeof routes['passwordReset.resetForm']
    reset: typeof routes['passwordReset.reset']
  }
  dashboard: typeof routes['dashboard']
  admin: {
    dashboard: typeof routes['admin.dashboard']
  }
}
