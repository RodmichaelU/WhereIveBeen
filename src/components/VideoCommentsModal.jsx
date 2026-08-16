import { useEffect } from 'react'
import { X } from 'lucide-react'
import LikeButton from './video-engagement/LikeButton.jsx'
import CommentThread from './video-engagement/CommentThread.jsx'

export default function VideoCommentsModal({ vlog, initialCount, onClose, onCommentPosted }) {
  const { id, url, trip, visit } = vlog

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return (
    <>
      <div className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-[901] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:w-[520px] max-h-[88vh] sm:max-h-[80vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          <div className="flex items-start gap-3 px-5 pt-4 pb-3 sm:pt-5">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-20 aspect-video rounded-lg overflow-hidden bg-slate-900"
            >
              <img
                src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                alt={trip.name}
                className="w-full h-full object-cover"
              />
            </a>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-tight line-clamp-2">{trip.name}</p>
              <p className="text-slate-400 text-xs mt-0.5">{trip.country} &middot; {visit.visitDate}</p>
              <div className="mt-2">
                <LikeButton videoId={id} initialCount={initialCount} size="sm" />
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-full text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mx-5 h-px bg-slate-700/60" />

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <CommentThread videoId={id} onCommentPosted={onCommentPosted} />
          </div>
        </div>
      </div>
    </>
  )
}
