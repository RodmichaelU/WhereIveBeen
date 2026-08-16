import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Lazily fetches the full comment thread for one video — only call this
// once a comment UI is actually opened, not upfront for every card.
export function useComments(videoId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!videoId) return
    let cancelled = false
    setLoading(true)

    supabase
      .from('video_comments')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error)
        else setComments(data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [videoId])

  async function addComment({ authorName, body }) {
    const { data, error } = await supabase
      .from('video_comments')
      .insert({
        video_id: videoId,
        author_name: authorName?.trim() || 'Anonymous',
        body: body.trim(),
      })
      .select()
      .single()

    if (error) throw error
    setComments(prev => [...prev, data])
    return data
  }

  return { comments, loading, error, addComment }
}
