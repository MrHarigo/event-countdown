'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from './EventCard'
import AddEventModal from './AddEventModal'
import { EventRow, EventColor, createEvent, updateEvent, deleteEvent } from '@/app/actions'

const byDate = (a: EventRow, b: EventRow) =>
  new Date(a.target_date).getTime() - new Date(b.target_date).getTime()

export default function EventGrid({ initialEvents }: { initialEvents: EventRow[] }) {
  const [events, setEvents] = useState<EventRow[]>([...initialEvents].sort(byDate))
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventRow | null>(null)
  const [, startTransition] = useTransition()

  function handleAddClick() {
    setEditingEvent(null)
    setModalOpen(true)
  }

  function handleEdit(event: EventRow) {
    setEditingEvent(event)
    setModalOpen(true)
  }

  async function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
    startTransition(async () => {
      await deleteEvent(id)
    })
  }

  async function handleSubmit(data: {
    title: string
    emoji: string
    target_date: string
    color: EventColor
    note?: string
  }) {
    if (editingEvent) {
      const updated = { ...editingEvent, ...data, note: data.note || null }
      setEvents((prev) => prev.map((e) => e.id === editingEvent.id ? updated : e))
      startTransition(async () => {
        await updateEvent(editingEvent.id, data)
      })
    } else {
      const tempEvent: EventRow = {
        id: `temp-${Date.now()}`,
        user_id: '',
        created_at: new Date().toISOString(),
        note: data.note || null,
        ...data,
      }
      setEvents((prev) =>
        [...prev, tempEvent].sort(byDate)
      )
      startTransition(async () => {
        const result = await createEvent(data)
        if (result.error) {
          setEvents((prev) => prev.filter((e) => e.id !== tempEvent.id))
        }
      })
    }
  }

  return (
    <>
      {events.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 py-24 text-center"
        >
          <div className="text-5xl">🗓️</div>
          <div>
            <p className="text-xl font-semibold text-white">No milestones yet</p>
            <p className="text-zinc-500 mt-1 text-sm">Add your first big moment to start counting down.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="mt-2 w-full rounded-2xl border border-dashed border-white/8 py-4 text-zinc-700 hover:text-zinc-400 hover:border-white/15 transition-all text-sm"
          >
            +
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
          <button
            onClick={handleAddClick}
            className="w-full rounded-2xl border border-dashed border-white/8 py-4 text-zinc-700 hover:text-zinc-400 hover:border-white/15 transition-all text-sm"
          >
            +
          </button>
        </div>
      )}

      <AddEventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingEvent={editingEvent}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </>
  )
}
