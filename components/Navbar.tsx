'use client'

import { signOut } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface NavUser {
  id?: string
  email?: string | null
  name?: string | null
}

export default function Navbar({ user }: { user: NavUser }) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-white tracking-tight">Milestone</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400 hidden sm:block">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}
