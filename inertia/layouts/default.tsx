import { ReactElement } from 'react'
import { Data } from '@generated/data'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
  return <main>{children}</main>
}
