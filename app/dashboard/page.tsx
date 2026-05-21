import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import EventGrid from '@/components/EventGrid'
import { EventRow } from '@/app/actions'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', user.id)
    .order('target_date', { ascending: true })

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar user={user} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your milestones</h1>
            <p className="text-zinc-500 text-sm mt-1">
              {events?.length
                ? `${events.length} upcoming ${events.length === 1 ? 'event' : 'events'}`
                : 'Start tracking what matters'}
            </p>
          </div>
        </div>
        <EventGrid initialEvents={(events as EventRow[]) || []} />
      </main>
    </div>
  )
}
