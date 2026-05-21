'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from './EventCard'
import AddEventModal from './AddEventModal'
import { EventRow, EventColor, createEvent, updateEvent, deleteEvent } from '@/app/actions'

export default function EventGrid({ initialEvents }: { initialEvents: EventRow[] }) {
  const [events, setEvents] = useState<EventRow[]>(initialEvents)
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
        [...prev, tempEvent].sort((a, b) =>
          new Date(a.target_date).getTime() - new Date(b.target_date).getTime()
        )
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
            className="mt-2 bg-white text-zinc-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
          >
            Add your first milestone
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Floating add button */}
      {events.length > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          onClick={handleAddClick}
          className="fixed bottom-8 right-8 w-14 h-14 bg-white text-zinc-900 rounded-full shadow-2xl flex items-center justify-center text-2xl font-light hover:bg-zinc-100 hover:scale-110 transition-all z-40"
          aria-label="Add milestone"
        >
          +
        </motion.button>
      )}

      <AddEventModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editingEvent={editingEvent}
        onSubmit={handleSubmit}
      />
    </>
  )
}
