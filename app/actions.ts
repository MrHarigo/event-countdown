'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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

async function getAuthenticatedClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) throw new Error('Unauthorized')
  return { supabase, user }
}

export async function createEvent(data: {
  title: string
  emoji: string
  target_date: string
  color: EventColor
  note?: string
}) {
  const { supabase, user } = await getAuthenticatedClient()

  const { error } = await supabase.from('events').insert({
    user_id: user.id,
    title: data.title,
    emoji: data.emoji,
    target_date: data.target_date,
    color: data.color,
    note: data.note || null,
  })

  if (error) return { error: error.message }
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
  const { supabase } = await getAuthenticatedClient()

  const { error } = await supabase
    .from('events')
    .update(data)
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const { supabase } = await getAuthenticatedClient()

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}
