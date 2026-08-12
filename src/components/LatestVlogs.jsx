import { useEffect, useState } from 'react'
import { Play, Video, List, ChevronDown } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import AllVlogsModal from './AllVlogsModal.jsx'

// How many additional vlogs to reveal each time "Load more" is clicked
const LOAD_MORE_COUNT = 6

// Tailwind's `sm` breakpoint — grid goes from 2 to 3 columns here
const SM_BREAKPOINT = '(min-width: 640px)'

function useIsSmUp() {
  const [isSmUp, setIsSmUp] = useState(() => window.matchMedia(SM_BREAKPOINT).matches)

  useEffect(() => {
    const mql = window.matchMedia(SM_BREAKPOINT)
    const onChange = (e) => setIsSmUp(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isSmUp
}

const MONTHS = {
  January: 0, February: 1, March: 2, April: 3,
  May: 4, June: 5, July: 6, August: 7,
  September: 8, October: 9, November: 10, December: 11,
}

function parseVisitDate(str) {
  if (!str) return new Date(0)
  const [month, year] = str.split(' ')
  return new Date(parseInt(year), MONTHS[month] ?? 0)
}

// Module-level cache so each video's title is only fetched once, ever
const titleCache = new Map()

function useVideoTitle(id) {
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

export default function LatestVlogs({ trips }) {
  const allVlogs = trips
    .flatMap(trip =>
      trip.visits.flatMap(visit =>
        (visit.youtubeUrls || [])
          .map(url => ({ url, id: getYouTubeId(url), trip, visit }))
          .filter(v => v.id)
      )
    )
    .sort((a, b) => parseVisitDate(b.visit.visitDate) - parseVisitDate(a.visit.visitDate))

  const isSmUp = useIsSmUp()
  const initialCount = isSmUp ? 9 : 8
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const vlogs = allVlogs.slice(0, visibleCount)
  const hasMore = allVlogs.length > vlogs.length

  const [headerRef, headerVisible] = useScrollReveal()
  const [showAll, setShowAll] = useState(false)

  if (vlogs.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div
        ref={headerRef}
        className={`flex items-center gap-3 mb-5 reveal${headerVisible ? ' visible' : ''}`}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30">
          <Video size={15} className="text-orange-400" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-bold text-white leading-none">Latest Travel Vlogs</h2>
          <p className="text-slate-500 text-xs mt-0.5">Click a pin on the map to see all vlogs &amp; photos for that place</p>
        </div>
        {allVlogs.length > vlogs.length && (
          <button
            onClick={() => setShowAll(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-orange-400/50 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <List size={13} />
            <span>View all ({allVlogs.length})</span>
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {vlogs.map(({ id, url, trip, visit }, i) => (
          <VlogCard key={id} id={id} url={url} trip={trip} visit={visit} delay={(i % LOAD_MORE_COUNT) * 70} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => setVisibleCount(c => c + LOAD_MORE_COUNT)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-orange-400/50 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ChevronDown size={13} />
            <span>Load more</span>
          </button>
        </div>
      )}

      {showAll && <AllVlogsModal vlogs={allVlogs} onClose={() => setShowAll(false)} />}
    </section>
  )
}

function VlogCard({ id, url, trip, visit, delay }) {
  const [ref, visible] = useScrollReveal()
  const title = useVideoTitle(id)
  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 hover:border-orange-400/50 transition-colors reveal${visible ? ' visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="aspect-video relative">
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
      </div>
      <div className="px-3 py-2.5">
        <p
          className="text-white text-sm font-semibold leading-tight line-clamp-2"
          title={title || trip.name}
        >
          {title || trip.name}
        </p>
        <p className="text-slate-400 text-xs mt-1">{trip.country} &middot; {visit.visitDate}</p>
      </div>
    </a>
  )
}
