'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { EventRow, EventColor } from '@/app/actions'

const colorThemes: Record<EventColor, {
  gradient: string
  border: string
  shadow: string
  accent: string
  badge: string
}> = {
  violet: {
    gradient: 'from-violet-500/15 to-purple-500/5',
    border: 'border-violet-500/25',
    shadow: 'hover:shadow-violet-500/15',
    accent: 'text-violet-300',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  },
  rose: {
    gradient: 'from-rose-500/15 to-pink-500/5',
    border: 'border-rose-500/25',
    shadow: 'hover:shadow-rose-500/15',
    accent: 'text-rose-300',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
  },
  amber: {
    gradient: 'from-amber-500/15 to-orange-500/5',
    border: 'border-amber-500/25',
    shadow: 'hover:shadow-amber-500/15',
    accent: 'text-amber-300',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
  },
  sky: {
    gradient: 'from-sky-500/15 to-blue-500/5',
    border: 'border-sky-500/25',
    shadow: 'hover:shadow-sky-500/15',
    accent: 'text-sky-300',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
  },
  emerald: {
    gradient: 'from-emerald-500/15 to-teal-500/5',
    border: 'border-emerald-500/25',
    shadow: 'hover:shadow-emerald-500/15',
    accent: 'text-emerald-300',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20',
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

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, isPast: false, isToday: false }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

interface EventCardProps {
  event: EventRow
  index: number
  onEdit: (event: EventRow) => void
  onDelete: (id: string) => void
}

export default function EventCard({ event, index, onEdit, onDelete }: EventCardProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(event.target_date))
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const theme = colorThemes[event.color] || colorThemes.violet

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(event.target_date))
    }, 1000)
    return () => clearInterval(interval)
  }, [event.target_date])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      className={`
        relative group rounded-2xl border bg-gradient-to-br ${theme.gradient} ${theme.border}
        bg-zinc-900/60 backdrop-blur-sm p-6 flex flex-col gap-4
        shadow-xl ${theme.shadow} hover:shadow-2xl transition-all duration-300
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{event.emoji}</span>
          <h3 className="font-semibold text-white text-base leading-tight truncate">
            {event.title}
          </h3>
        </div>
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-zinc-300 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5"
            aria-label="Options"
          >
            ⋯
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-zinc-800 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden min-w-[120px]">
              <button
                onClick={() => { onEdit(event); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => { onDelete(event.id); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Countdown */}
      <div className="flex-1 flex flex-col items-center justify-center py-4 gap-1">
        {countdown.isToday ? (
          <div className="text-5xl font-black text-white tracking-tight">TODAY!</div>
        ) : countdown.isPast ? (
          <div className="text-4xl font-black text-zinc-500 tracking-tight">Past</div>
        ) : (
          <>
            <div className={`text-8xl font-black tracking-tighter leading-none ${theme.accent}`}>
              {countdown.days}
            </div>
            <div className="text-zinc-400 text-sm font-medium uppercase tracking-widest">
              {countdown.days === 1 ? 'day' : 'days'}
            </div>
            {countdown.days < 7 && (
              <div className="flex gap-3 mt-2 text-zinc-500 text-sm">
                <span>{countdown.hours}h</span>
                <span>{countdown.minutes}m</span>
                <span>{countdown.seconds}s</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-xs border rounded-full px-2.5 py-1 ${theme.badge}`}>
          {formatDate(event.target_date)}
        </span>
      </div>

      {event.note && (
        <p className="text-xs text-zinc-500 truncate border-t border-white/5 pt-3">
          {event.note}
        </p>
      )}
    </motion.div>
  )
}
