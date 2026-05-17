import { useEffect, useState } from 'react'
import { X, MapPin, Calendar, Video, Image } from 'lucide-react'

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

function VisitSection({ visit, tripName, label }) {
  const videoIds = (visit.youtubeUrls || []).map(getYouTubeId).filter(Boolean)
  const hasPhotos = visit.photos && visit.photos.length > 0
  const [lightboxSrc, setLightboxSrc] = useState(null)

  return (
    <div>
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Calendar size={11} />
            <span>{label}</span>
          </div>
          <div className="flex-1 h-px bg-slate-700/60" />
        </div>
      )}

      {visit.visitDate && !label && (
        <div className="flex items-center gap-1.5 text-slate-400 text-sm mb-3">
          <Calendar size={13} strokeWidth={2} />
          <span>{visit.visitDate}</span>
        </div>
      )}

      {visit.description && (
        <p className="text-slate-300 text-sm leading-relaxed mb-4">
          {visit.description}
        </p>
      )}

      {videoIds.length > 0 && (
        <div className="mb-4 space-y-3">
          {videoIds.length > 1 && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <Video size={11} />
              <span>Videos ({videoIds.length})</span>
            </div>
          )}
          {videoIds.length === 1 && (
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <Video size={11} />
              <span>Video</span>
            </div>
          )}
          {videoIds.map((id, i) => (
            <div key={id} className="aspect-video rounded-xl overflow-hidden bg-slate-900">
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title={`${tripName} video ${i + 1}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}

      {hasPhotos && (
        <div className="mb-4">
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
                  alt={`${tripName} ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {!visit.description && videoIds.length === 0 && !hasPhotos && (
        <p className="text-slate-600 text-sm italic pb-2">No details added for this visit yet.</p>
      )}

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setLightboxSrc(null)}
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
    </div>
  )
}

export default function TripModal({ trip, onClose }) {
  const visits = [...trip.visits].reverse()
  const isMultiVisit = visits.length > 1

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

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
          <div className="flex items-start justify-between px-5 pt-4 pb-3 sm:pt-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-orange-400 text-xs font-medium mb-2">
                <MapPin size={12} strokeWidth={2.5} />
                <span>{trip.country}</span>
                <span className="text-slate-600">&middot;</span>
                <span className="text-slate-400">{trip.continent}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {trip.name}
                </h2>
                {isMultiVisit && (
                  <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-orange-400/15 border border-orange-400/30 text-orange-300 text-xs font-semibold">
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

          {/* Visit sections */}
          <div className="px-5 pb-6 space-y-5">
            {visits.map((visit, i) => (
              <VisitSection
                key={i}
                visit={visit}
                tripName={trip.name}
                label={isMultiVisit ? `Visit ${visits.length - i} — ${visit.visitDate}` : null}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
