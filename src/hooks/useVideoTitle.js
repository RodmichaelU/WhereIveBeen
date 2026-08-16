import { useEffect, useState } from 'react'

// Module-level cache so each video's title is only fetched once, ever
const titleCache = new Map()

export function useVideoTitle(id) {
  const [title, setTitle] = useState(() => titleCache.get(id) ?? null)

  useEffect(() => {
    if (!id || titleCache.has(id)) return
    let cancelled = false

    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (cancelled || !data?.title) return
        titleCache.set(id, data.title)
        setTitle(data.title)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [id])

  return title
}
