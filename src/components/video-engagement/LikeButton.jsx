import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { supabase } from '../../lib/supabase.js'
import { isVideoLiked, markVideoLiked, unmarkVideoLiked } from '../../utils/likedVideos.js'

export default function LikeButton({ videoId, initialCount, size = 'md' }) {
  const [liked, setLiked] = useState(() => isVideoLiked(videoId))
  const [count, setCount] = useState(initialCount)
  const clickedThisSession = useRef(false)

  // A later batched refetch (e.g. from "Load more") shouldn't clobber an
  // optimistic +1 the user already made this session.
  useEffect(() => {
    if (!clickedThisSession.current) setCount(initialCount)
  }, [initialCount])

  async function handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (liked) return

    clickedThisSession.current = true
    setLiked(true)
    setCount(c => c + 1)
    markVideoLiked(videoId)

    const { error } = await supabase.from('video_likes').insert({ video_id: videoId })
    if (error) {
      setLiked(false)
      setCount(c => c - 1)
      unmarkVideoLiked(videoId)
    }
  }

  const isSm = size === 'sm'

  return (
    <button
      onClick={handleClick}
      disabled={liked}
      className={`flex items-center gap-1.5 ${isSm ? 'text-xs' : 'text-sm'} font-semibold transition-colors ${
        liked ? 'text-orange-400' : 'text-slate-400 hover:text-white'
      } disabled:cursor-default`}
      aria-label={liked ? 'Liked' : 'Like this video'}
    >
      <Heart size={isSm ? 13 : 15} fill={liked ? 'currentColor' : 'none'} />
      <span>{count}</span>
    </button>
  )
}
