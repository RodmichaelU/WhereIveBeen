import { useEffect, useState } from 'react'
import { X, MapPin, Calendar, Video, Image, ChevronLeft, ChevronRight } from 'lucide-react'

function getYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?\s]+)/,
    /youtube\.com\/embed\/([^\s?]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function TripModal({ trip, onClose }) {
  const visits = trip.visits                          // newest → oldest (index 0 = most recent)
  const [visitIndex, setVisitIndex] = useState(0)    // start at most recent
  const [lightboxSrc, setLightboxSrc] = useState(null)

  const visit = visits[visitIndex]
  const isMultiVisit = visits.length > 1
  const visitNumber = visitIndex + 1

  const goOlder = () => setVisitIndex(i => Math.min(i + 1, visits.length - 1))
  const goNewer = () => setVisitIndex(i => Math.max(i - 1, 0))

  const videoIds = (visit.youtubeUrls || []).map(getYouTubeId).filter(Boolean)
  const hasPhotos = visit.photos && visit.photos.length > 0

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (lightboxSrc) setLightboxSrc(null)
        else onClose()
      }
      if (isMultiVisit) {
        if (e.key === 'ArrowLeft') goNewer()
        if (e.key === 'ArrowRight') goOlder()
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.classList.remove('modal-open')
    }
  }, [onClose, lightboxSrc, isMultiVisit, visitIndex])

  return (
    <>
      <div
        className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-[901] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:w-[580px] max-h-[88vh] sm:max-h-[80vh] overflow-y-auto bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-5 pt-4 pb-3 sm:pt-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-orange-400 text-xs font-medium mb-2">
                <MapPin size={12} strokeWidth={2.5} />
                <span>{trip.country}</span>
                <span className="text-slate-600">&middot;</span>
                <span className="text-slate-400">{trip.continent}</span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {trip.name}
                </h2>
                {isMultiVisit && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-orange-300 text-xs font-semibold">
                    {visits.length}x visited
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-full text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Visit navigation */}
          {isMultiVisit ? (
            <div className="flex items-center gap-2 px-5 pb-3">
              <button
                onClick={goNewer}
                disabled={visitIndex === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors flex-shrink-0"
                aria-label="Newer visit"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex-1 text-center">
                <span className="text-sm font-semibold text-white">
                  Visit {visitNumber} of {visits.length}
                </span>
                {visit.visitDate && (
                  <span className="text-slate-400 text-sm"> &mdash; {visit.visitDate}</span>
                )}
              </div>
              <button
                onClick={goOlder}
                disabled={visitIndex === visits.length - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-slate-600 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 hover:text-white transition-colors flex-shrink-0"
                aria-label="Older visit"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            visit.visitDate && (
              <div className="flex items-center gap-1.5 text-slate-400 text-sm px-5 pb-3">
                <Calendar size={13} strokeWidth={2} />
                <span>{visit.visitDate}</span>
              </div>
            )
          )}

          <div className="mx-5 h-px bg-slate-700/60" />

          {/* Visit content */}
          <div className="px-5 pt-4 pb-6 space-y-4">
            {visit.description && (
              <p className="text-slate-300 text-sm leading-relaxed">
                {visit.description}
              </p>
            )}

            {videoIds.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <Video size={11} />
                  <span>{videoIds.length > 1 ? `Videos (${videoIds.length})` : 'Video'}</span>
                </div>
                {videoIds.map((id, i) => (
                  <div key={id} className="aspect-video rounded-xl overflow-hidden bg-slate-900">
                    <iframe
                      src={`https://www.youtube.com/embed/${id}`}
                      title={`${trip.name} video ${i + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ))}
              </div>
            )}

            {hasPhotos && (
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2.5">
                  <Image size={11} />
                  <span>Photos ({visit.photos.length})</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {visit.photos.map((photo, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxSrc(photo)}
                      className="aspect-square rounded-lg overflow-hidden bg-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-1 focus:ring-offset-slate-800"
                    >
                      <img
                        src={photo}
                        alt={`${trip.name} ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!visit.description && videoIds.length === 0 && !hasPhotos && (
              <p className="text-slate-600 text-sm italic text-center py-6">
                No details added for this visit yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setLightboxSrc(null)}
            aria-label="Close photo"
          >
            <X size={20} />
          </button>
          <img
            src={lightboxSrc}
            alt="Full size"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
