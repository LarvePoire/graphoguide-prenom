import type User from '#models/user'
import type Role from '#models/role'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserTransformer extends BaseTransformer<User> {
  toObject() {
    const role = this.resource.role as Role | null | undefined
    return {
      ...this.pick(this.resource, [
        'id',
        'fullName',
        'email',
        'createdAt',
        'updatedAt',
        'initials',
      ]),
      role: role ? { id: role.id, name: role.name } : null,
    }
  }
}
