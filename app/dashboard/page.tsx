import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { sql } from '@/lib/db'
import Navbar from '@/components/Navbar'
import EventGrid from '@/components/EventGrid'
import { EventRow } from '@/app/actions'

const DEV_USER = { id: 'dev-user', email: 'dev@localhost', name: 'Dev User' }

const DEV_EVENTS: EventRow[] = [
  { id: '1', user_id: 'dev-user', title: 'Getting a car', emoji: '🚗', target_date: '2026-11-01', color: 'violet', note: null, created_at: '' },
  { id: '2', user_id: 'dev-user', title: 'Joji Concert Bangkok', emoji: '🎵', target_date: '2026-11-26', color: 'rose', note: 'Floor tickets!', created_at: '' },
  { id: '3', user_id: 'dev-user', title: 'Trip to Kyoto', emoji: '✈️', target_date: '2026-05-27', color: 'amber', note: null, created_at: '' },
  { id: '4', user_id: 'dev-user', title: 'New apartment', emoji: '🏠', target_date: '2027-01-15', color: 'emerald', note: null, created_at: '' },
]

export default async function DashboardPage() {
  const isDev = process.env.DEV_BYPASS_AUTH === 'true'

  let user: { id: string; email?: string | null; name?: string | null }
  let events: EventRow[]

  if (isDev) {
    user = DEV_USER
    events = DEV_EVENTS
  } else {
    const session = await auth()
    if (!session?.user?.id) redirect('/')
    user = session.user

    events = (await sql`
      SELECT * FROM events
      WHERE user_id = ${session.user.id}
      ORDER BY target_date ASC
    `) as EventRow[]
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar user={user} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-16">
        <EventGrid initialEvents={events} />
      </main>
    </div>
  )
}
