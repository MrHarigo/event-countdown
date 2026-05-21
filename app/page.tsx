import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthButtons from '@/components/AuthButtons'

const EXAMPLE_EVENTS = [
  {
    emoji: '🚗',
    title: 'Getting a car',
    days: 164,
    color: 'from-violet-500/20 to-purple-500/5 border-violet-500/25',
    accent: 'text-violet-300',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    date: 'November 1, 2026',
  },
  {
    emoji: '🎵',
    title: 'Joji Concert Bangkok',
    days: 189,
    color: 'from-rose-500/20 to-pink-500/5 border-rose-500/25',
    accent: 'text-rose-300',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
    date: 'November 26, 2026',
  },
  {
    emoji: '✈️',
    title: 'Trip to Kyoto',
    days: 312,
    color: 'from-amber-500/20 to-orange-500/5 border-amber-500/25',
    accent: 'text-amber-300',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
    date: 'March 29, 2027',
  },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">⏳</span>
            <span className="font-semibold text-white tracking-tight">Milestone</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col">
        <section className="max-w-6xl mx-auto w-full px-6 pt-32 pb-20 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Count down to what matters
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter leading-[0.95] max-w-3xl">
            Your biggest{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              moments,
            </span>{' '}
            counting down.
          </h1>
          <p className="text-zinc-400 text-lg sm:text-xl max-w-xl leading-relaxed">
            Track concerts, trips, milestones, and life goals with beautiful live countdowns.
            Never lose track of what you&apos;re looking forward to.
          </p>
          <AuthButtons prominent />
        </section>

        {/* Example cards */}
        <section className="max-w-6xl mx-auto w-full px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {EXAMPLE_EVENTS.map((event, i) => (
              <div
                key={i}
                className={`rounded-2xl border bg-gradient-to-br ${event.color} bg-zinc-900/60 backdrop-blur-sm p-6 flex flex-col gap-4`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{event.emoji}</span>
                  <h3 className="font-semibold text-white text-base leading-tight">{event.title}</h3>
                </div>
                <div className="flex flex-col items-center justify-center py-4 gap-1">
                  <div className={`text-8xl font-black tracking-tighter leading-none ${event.accent}`}>
                    {event.days}
                  </div>
                  <div className="text-zinc-400 text-sm font-medium uppercase tracking-widest">days</div>
                </div>
                <div>
                  <span className={`text-xs border rounded-full px-2.5 py-1 ${event.badge}`}>
                    {event.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-600 text-sm mt-4">
            Example milestones — yours will count down in real time ✨
          </p>
        </section>
      </main>
    </div>
  )
}
