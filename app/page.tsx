import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AuthButtons from '@/components/AuthButtons'

const EXAMPLE_EVENTS = [
  {
    emoji: '🚗',
    title: 'Getting a car',
    days: 164,
    date: 'November 1, 2026',
    gradient: 'from-violet-500/10 to-transparent',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    badge: 'text-violet-400',
  },
  {
    emoji: '🎵',
    title: 'Joji Concert Bangkok',
    days: 189,
    date: 'November 26, 2026',
    gradient: 'from-rose-500/10 to-transparent',
    border: 'border-rose-500/20',
    accent: 'text-rose-300',
    badge: 'text-rose-400',
  },
  {
    emoji: '✈️',
    title: 'Trip to Kyoto',
    days: 312,
    date: 'March 29, 2027',
    gradient: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20',
    accent: 'text-amber-300',
    badge: 'text-amber-400',
  },
]

function formatUnits(days: number) {
  const years  = Math.floor(days / 365)
  const months = Math.floor((days - years * 365) / 30)
  const weeks  = Math.floor((days - years * 365 - months * 30) / 7)
  const rem    = days - years * 365 - months * 30 - weeks * 7
  return [
    { value: years,  unit: '年' },
    { value: months, unit: '月' },
    { value: weeks,  unit: '週' },
    { value: rem,    unit: '日' },
  ].filter(({ value }) => value > 0)
}

export default async function LandingPage() {
  if (process.env.DEV_BYPASS_AUTH === 'true') redirect('/dashboard')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        <section className="max-w-3xl mx-auto w-full pt-24 pb-12 flex flex-col items-center text-center gap-6 px-8">
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tighter leading-[0.95]">
            Your biggest{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 pr-1">
              moments,
            </span>{' '}
            counting down.
          </h1>
          <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
            Track life milestones with convenient live countdowns.
          </p>
          <AuthButtons prominent />
        </section>

        {/* Example cards */}
        <section className="max-w-3xl mx-auto w-full px-6 pb-24 flex flex-col gap-3">
          {EXAMPLE_EVENTS.map((event, i) => (
            <div
              key={i}
              className={`group flex items-center justify-between rounded-2xl bg-gradient-to-r ${event.gradient} bg-zinc-900/50 px-6 h-20`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-2xl flex-shrink-0">{event.emoji}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-white leading-tight truncate text-xl group-hover:text-base transition-all duration-500 ease-in-out">{event.title}</p>
                  <div className="overflow-hidden max-h-0 group-hover:max-h-8 transition-all duration-500 ease-in-out">
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${event.badge} opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150`}>{event.date}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-6">
                {formatUnits(event.days).map(({ value, unit }, i, arr) => (
                  <div key={unit} className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className={`text-4xl font-black tabular-nums leading-none ${event.accent}`}>{value}</span>
                      <span className="text-zinc-500 text-sm">{unit}</span>
                    </div>
                    {i < arr.length - 1 && <span className="text-zinc-700">·</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
