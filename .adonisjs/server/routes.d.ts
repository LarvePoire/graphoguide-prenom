import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'passwordReset.create': { paramsTuple?: []; params?: {} }
    'passwordReset.store': { paramsTuple?: []; params?: {} }
    'passwordReset.verify': { paramsTuple?: []; params?: {} }
    'passwordReset.check': { paramsTuple?: []; params?: {} }
    'passwordReset.resetForm': { paramsTuple?: []; params?: {} }
    'passwordReset.reset': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'passwordReset.create': { paramsTuple?: []; params?: {} }
    'passwordReset.verify': { paramsTuple?: []; params?: {} }
    'passwordReset.resetForm': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'passwordReset.create': { paramsTuple?: []; params?: {} }
    'passwordReset.verify': { paramsTuple?: []; params?: {} }
    'passwordReset.resetForm': { paramsTuple?: []; params?: {} }
    'dashboard': { paramsTuple?: []; params?: {} }
    'admin.dashboard': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'passwordReset.store': { paramsTuple?: []; params?: {} }
    'passwordReset.check': { paramsTuple?: []; params?: {} }
    'passwordReset.reset': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}