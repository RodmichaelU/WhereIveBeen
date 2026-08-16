import { Play, MessageCircle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useVideoTitle } from '../hooks/useVideoTitle.js'
import LikeButton from './video-engagement/LikeButton.jsx'

export default function VlogCard({ vlog, delay, likeCount, commentCount, onOpenComments }) {
  const { id, url, trip, visit } = vlog
  const [ref, visible] = useScrollReveal()
  const title = useVideoTitle(id)
  return (
    <div
      ref={ref}
      className={`group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-orange-400/50 transition-colors reveal${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="block aspect-video relative">
        <img
          src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play size={18} fill="white" className="text-white ml-0.5" />
          </div>
        </div>
      </a>
      <div className="px-3 py-2.5">
        <p
          className="text-white text-sm font-semibold leading-tight line-clamp-2"
          title={title || trip.name}
        >
          {title || trip.name}
        </p>
        <p className="text-slate-400 text-xs mt-1">{trip.country} &middot; {visit.visitDate}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60">
          <LikeButton videoId={id} initialCount={likeCount} size="sm" />
          <button
            onClick={onOpenComments}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            aria-label="View comments"
          >
            <MessageCircle size={13} />
            <span>{commentCount}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
