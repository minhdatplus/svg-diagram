import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database'
import type { DiagramState } from '@/lib/types/diagram'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export async function saveDiagram(diagramData: DiagramState) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('diagrams')
    .insert({
      svg_data: JSON.stringify(diagramData),
      user_id: user.id,
    })
    .single()

  if (error) throw error
  return data
} 