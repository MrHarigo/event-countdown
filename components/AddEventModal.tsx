'use client'

import { useState, useEffect, useRef } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { EventRow, EventColor } from '@/app/actions'

const EMOJIS = [
  '🎯','🚗','✈️','🏠','💍','🎓','🎉','🏖️','🎭','🏆',
  '💰','🌟','🎪','🎨','🚀','❤️','🌈','🦋','🎵','🎸',
  '🍜','🍣','🎬','📚','🏋️','⛷️','🤿','🌸','🐾','🦁',
]

const COLOR_OPTIONS: { value: EventColor; label: string; preview: string }[] = [
  { value: 'violet', label: 'Violet', preview: 'bg-violet-500' },
  { value: 'rose',   label: 'Rose',   preview: 'bg-rose-500' },
  { value: 'amber',  label: 'Amber',  preview: 'bg-amber-500' },
  { value: 'sky',    label: 'Sky',    preview: 'bg-sky-500' },
  { value: 'emerald',label: 'Emerald',preview: 'bg-emerald-500' },
]

interface AddEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingEvent?: EventRow | null
  onSubmit: (data: {
    title: string
    emoji: string
    target_date: string
    color: EventColor
    note?: string
  }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export default function AddEventModal({ open, onOpenChange, editingEvent, onSubmit, onDelete }: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [emoji, setEmoji] = useState('🎯')
  const [targetDate, setTargetDate] = useState('')
  const [color, setColor] = useState<EventColor>('violet')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    setPickerOpen(false)
  }, [open])

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setEmoji(editingEvent.emoji)
      setTargetDate(editingEvent.target_date)
      setColor(editingEvent.color)
      setNote(editingEvent.note || '')
    } else {
      setTitle('')
      setEmoji('🎯')
      setTargetDate('')
      setColor('violet')
      setNote('')
    }
  }, [editingEvent, open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !targetDate) return
    setLoading(true)
    try {
      await onSubmit({ title: title.trim(), emoji, target_date: targetDate, color, note: note.trim() || undefined })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const customHex = color.startsWith('#') ? color : '#a78bfa'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingEvent ? 'Edit milestone' : 'New milestone'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Emoji picker */}
          <div className="flex flex-col gap-2">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider">Icon</Label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`text-xl w-9 h-9 rounded-lg flex items-center justify-center transition-all
                    ${emoji === e
                      ? 'bg-white/15 ring-2 ring-white/30 scale-110'
                      : 'hover:bg-white/10'
                    }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-zinc-400 text-xs uppercase tracking-wider">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Getting a car..."
              className="bg-zinc-800/80 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
              required
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-zinc-400 text-xs uppercase tracking-wider">Target date</Label>
            <Input
              id="date"
              type="date"
              value={targetDate}
              min={today}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-zinc-800/80 border-white/10 text-white focus-visible:ring-white/20 [color-scheme:dark]"
              required
            />
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider">Color</Label>
            <div className="flex gap-2 items-center">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => { setColor(c.value); setPickerOpen(false) }}
                  title={c.label}
                  className={`w-8 h-8 rounded-full ${c.preview} transition-all
                    ${color === c.value ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-white/50 scale-110' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}

              {/* Custom color swatch + popover */}
              <div className="relative" ref={pickerRef}>
                <button
                  type="button"
                  title="Custom color"
                  onClick={() => setPickerOpen((v) => !v)}
                  className={`w-8 h-8 rounded-full transition-all flex-shrink-0
                    ${color.startsWith('#') ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ring-white/50 scale-110' : 'opacity-60 hover:opacity-100'}`}
                  style={{ background: color.startsWith('#') ? color : 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}
                />
                {pickerOpen && (
                  <div
                    className="absolute left-0 top-10 z-50 p-3 rounded-2xl shadow-2xl"
                    style={{ background: '#1c1c1f', border: '1px solid rgba(255,255,255,0.08)' }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <HexColorPicker color={customHex} onChange={setColor} />
                    <input
                      type="text"
                      value={color.startsWith('#') ? color : customHex}
                      onChange={(e) => {
                        const v = e.target.value
                        if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColor(v)
                      }}
                      maxLength={7}
                      className="mt-2 w-full rounded-lg px-2 py-1 text-xs text-center font-mono bg-zinc-800 border border-white/10 text-white focus:outline-none focus:border-white/30"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="note" className="text-zinc-400 text-xs uppercase tracking-wider">
              Note <span className="normal-case text-zinc-600">(optional)</span>
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any extra details..."
              rows={2}
              className="bg-zinc-800/80 border-white/10 text-white placeholder:text-zinc-600 focus-visible:ring-white/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            {editingEvent && onDelete ? (
              <Button
                type="button"
                variant="ghost"
                disabled={deleting}
                onClick={async () => {
                  setDeleting(true)
                  try {
                    await onDelete(editingEvent.id)
                    onOpenChange(false)
                  } finally {
                    setDeleting(false)
                  }
                }}
                className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-zinc-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            )}
            <div className="flex-1" />
            {editingEvent && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="text-zinc-400 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || !title.trim() || !targetDate}
              className="bg-white text-zinc-900 hover:bg-zinc-100 font-semibold disabled:opacity-40"
            >
              {loading ? 'Saving...' : editingEvent ? 'Save changes' : 'Add milestone'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
