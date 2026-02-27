import type { InertiaProps } from '~/types'

export default function Dashboard({ user }: InertiaProps) {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.fullName ?? user?.email}.</p>
    </div>
  )
}
