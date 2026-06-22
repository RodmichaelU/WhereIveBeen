import { useEffect, useMemo, useState } from 'react'
import { X, Play, Search } from 'lucide-react'

export default function AllVlogsModal({ vlogs, onClose }) {
  const [query, setQuery] = useState('')

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return vlogs
    return vlogs.filter(({ trip }) =>
      trip.name.toLowerCase().includes(q) || trip.country.toLowerCase().includes(q)
    )
  }, [vlogs, query])

  return (
    <>
      <div className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-[901] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full sm:w-[640px] max-h-[88vh] sm:max-h-[80vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          <div className="flex items-start justify-between px-5 pt-4 pb-3 sm:pt-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">All Travel Vlogs</h2>
              <p className="text-slate-400 text-xs mt-1">{vlogs.length} videos</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-full text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <div className="px-5 pb-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by place or country..."
                className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
              />
            </div>
          </div>

          <div className="mx-5 h-px bg-slate-700/60" />

          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1.5">
            {filtered.length === 0 ? (
              <p className="text-slate-600 text-sm italic text-center py-8">No videos match &quot;{query}&quot;</p>
            ) : (
              filtered.map(({ id, url, trip, visit }, i) => (
                <a
                  key={`${id}-${i}`}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 p-2 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="relative w-24 sm:w-28 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-orange-500/90 flex items-center justify-center">
                        <Play size={12} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate group-hover:text-orange-300 transition-colors">
                      {trip.name}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{trip.country} &middot; {visit.visitDate}</p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
