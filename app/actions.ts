'use server'

import { auth, signOut as authSignOut } from '@/lib/auth'
import { sql } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type EventColor = string

export interface EventRow {
  id: string
  user_id: string
  title: string
  emoji: string
  target_date: string
  color: EventColor
  note: string | null
  created_at: string
}

async function getUserId() {
  const session = await auth()
  if (!session?.user?.id) redirect('/')
  return session.user.id
}

export async function createEvent(data: {
  title: string
  emoji: string
  target_date: string
  color: EventColor
  note?: string
}) {
  const userId = await getUserId()
  try {
    await sql`
      INSERT INTO events (user_id, title, emoji, target_date, color, note)
      VALUES (${userId}, ${data.title}, ${data.emoji}, ${data.target_date}::date, ${data.color}, ${data.note || null})
    `
  } catch {
    return { error: 'Failed to create event' }
  }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updateEvent(id: string, data: {
  title?: string
  emoji?: string
  target_date?: string
  color?: EventColor
  note?: string
}) {
  const userId = await getUserId()
  try {
    await sql`
      UPDATE events
      SET
        title       = COALESCE(${data.title ?? null}, title),
        emoji       = COALESCE(${data.emoji ?? null}, emoji),
        target_date = COALESCE(${data.target_date ?? null}::date, target_date),
        color       = COALESCE(${data.color ?? null}, color),
        note        = ${data.note !== undefined ? (data.note || null) : null}
      WHERE id = ${id}::uuid AND user_id = ${userId}
    `
  } catch {
    return { error: 'Failed to update event' }
  }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const userId = await getUserId()
  try {
    await sql`
      DELETE FROM events WHERE id = ${id}::uuid AND user_id = ${userId}
    `
  } catch {
    return { error: 'Failed to delete event' }
  }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function signOut() {
  await authSignOut({ redirectTo: '/' })
}
