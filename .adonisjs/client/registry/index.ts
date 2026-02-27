/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'passwordReset.create': {
    methods: ["GET","HEAD"],
    pattern: '/forgot-password',
    tokens: [{"old":"/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['passwordReset.create']['types'],
  },
  'passwordReset.store': {
    methods: ["POST"],
    pattern: '/forgot-password',
    tokens: [{"old":"/forgot-password","type":0,"val":"forgot-password","end":""}],
    types: placeholder as Registry['passwordReset.store']['types'],
  },
  'passwordReset.verify': {
    methods: ["GET","HEAD"],
    pattern: '/forgot-password/verify',
    tokens: [{"old":"/forgot-password/verify","type":0,"val":"forgot-password","end":""},{"old":"/forgot-password/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['passwordReset.verify']['types'],
  },
  'passwordReset.check': {
    methods: ["POST"],
    pattern: '/forgot-password/verify',
    tokens: [{"old":"/forgot-password/verify","type":0,"val":"forgot-password","end":""},{"old":"/forgot-password/verify","type":0,"val":"verify","end":""}],
    types: placeholder as Registry['passwordReset.check']['types'],
  },
  'passwordReset.resetForm': {
    methods: ["GET","HEAD"],
    pattern: '/forgot-password/reset',
    tokens: [{"old":"/forgot-password/reset","type":0,"val":"forgot-password","end":""},{"old":"/forgot-password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['passwordReset.resetForm']['types'],
  },
  'passwordReset.reset': {
    methods: ["POST"],
    pattern: '/forgot-password/reset',
    tokens: [{"old":"/forgot-password/reset","type":0,"val":"forgot-password","end":""},{"old":"/forgot-password/reset","type":0,"val":"reset","end":""}],
    types: placeholder as Registry['passwordReset.reset']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard']['types'],
  },
  'admin.dashboard': {
    methods: ["GET","HEAD"],
    pattern: '/admin/dashboard',
    tokens: [{"old":"/admin/dashboard","type":0,"val":"admin","end":""},{"old":"/admin/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['admin.dashboard']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
