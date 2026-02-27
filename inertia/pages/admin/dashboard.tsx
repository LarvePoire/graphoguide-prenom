import type { InertiaProps } from '~/types'

export default function AdminDashboard({ user }: InertiaProps) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.fullName ?? user?.email}.</p>
    </div>
  )
}
