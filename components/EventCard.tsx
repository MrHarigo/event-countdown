'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { EventRow, EventColor } from '@/app/actions'

const colorThemes: Record<EventColor, {
  gradient: string
  border: string
  accent: string
  badge: string
}> = {
  violet: {
    gradient: 'from-violet-500/10 to-transparent',
    border: 'border-violet-500/20',
    accent: 'text-violet-300',
    badge: 'text-violet-400',
  },
  rose: {
    gradient: 'from-rose-500/10 to-transparent',
    border: 'border-rose-500/20',
    accent: 'text-rose-300',
    badge: 'text-rose-400',
  },
  amber: {
    gradient: 'from-amber-500/10 to-transparent',
    border: 'border-amber-500/20',
    accent: 'text-amber-300',
    badge: 'text-amber-400',
  },
  sky: {
    gradient: 'from-sky-500/10 to-transparent',
    border: 'border-sky-500/20',
    accent: 'text-sky-300',
    badge: 'text-sky-400',
  },
  emerald: {
    gradient: 'from-emerald-500/10 to-transparent',
    border: 'border-emerald-500/20',
    accent: 'text-emerald-300',
    badge: 'text-emerald-400',
  },
}

function getCountdown(targetDate: string) {
  const now = new Date()
  const target = new Date(targetDate + 'T00:00:00')
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) {
    const isPast = diff < -86400000
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast, isToday: !isPast }
  }

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isPast: false,
    isToday: false,
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })
}

interface EventCardProps {
  event: EventRow
  index: number
  onEdit: (event: EventRow) => void
}

export default function EventCard({ event, index, onEdit }: EventCardProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(event.target_date))
  const theme = colorThemes[event.color] || colorThemes.violet

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown(event.target_date)), 1000)
    return () => clearInterval(interval)
  }, [event.target_date])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
      className={`
        group relative flex items-center justify-between
        rounded-2xl border bg-gradient-to-r ${theme.gradient} ${theme.border}
        bg-zinc-900/50 backdrop-blur-sm px-6 py-5
        transition-all duration-200 hover:bg-zinc-900/70
      `}
    >
      {/* Left: emoji + title + meta */}
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-2xl flex-shrink-0">{event.emoji}</span>
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-base leading-tight truncate">{event.title}</h3>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-xs ${theme.badge}`}>{formatDate(event.target_date)}</span>
            {event.note && (
              <span className="text-xs text-zinc-600 truncate hidden sm:block">{event.note}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: countdown */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-6">
        {countdown.isToday ? (
          <span className="text-3xl font-black text-white">TODAY</span>
        ) : countdown.isPast ? (
          <span className="text-2xl font-bold text-zinc-600">Past</span>
        ) : (
          <>
            {[
              { value: Math.floor(countdown.days / 30), unit: '月' },
              { value: Math.floor(countdown.days / 7),  unit: '週' },
              { value: countdown.days,                  unit: '日' },
            ]
              .filter(({ value, unit }) => value > 0 || unit === '日')
              .map(({ value, unit }, i, arr) => (
                <div key={unit} className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className={`text-4xl font-black tabular-nums leading-none ${theme.accent}`}>
                      {value}
                    </span>
                    <span className="text-zinc-500 text-sm">{unit}</span>
                  </div>
                  {i < arr.length - 1 && <span className="text-zinc-700 leading-none">·</span>}
                </div>
              ))}
          </>
        )}

        {/* Pencil edit */}
        <button
          onClick={() => onEdit(event)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-zinc-300 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5"
          aria-label="Edit"
        >
          <PencilIcon />
        </button>
      </div>
    </motion.div>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
    </svg>
  )
}
