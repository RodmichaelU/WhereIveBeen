import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Batch-fetches like/comment counts for a set of video IDs, keyed in a Map
// so results merge across calls instead of resetting already-loaded cards
// back to a loading state (e.g. when "Load more" grows the id list).
export function useVideoEngagement(videoIds) {
  const [data, setData] = useState(() => new Map())
  const [loading, setLoading] = useState(false)
  const dataRef = useRef(data)
  dataRef.current = data

  const dedupedIds = [...new Set(videoIds.filter(Boolean))]
  const idsKey = dedupedIds.slice().sort().join(',')

  useEffect(() => {
    if (dedupedIds.length === 0) return
    let cancelled = false
    setLoading(true)

    supabase
      .from('video_engagement')
      .select('*')
      .in('video_id', dedupedIds)
      .then(({ data: rows, error }) => {
        if (cancelled || error) return
        setData(prev => {
          const next = new Map(prev)
          for (const row of rows) {
            next.set(row.video_id, { likeCount: row.like_count, commentCount: row.comment_count })
          }
          // Any requested id with no row yet has zero engagement
          for (const id of dedupedIds) {
            if (!next.has(id)) next.set(id, { likeCount: 0, commentCount: 0 })
          }
          return next
        })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  return { data, loading }
}
