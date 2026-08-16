import { useEffect, useState } from 'react'
import { Video, List, ChevronDown } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal.js'
import { useVideoEngagement } from '../hooks/useVideoEngagement.js'
import { getAllVlogs } from '../utils/vlogs.js'
import AllVlogsModal from './AllVlogsModal.jsx'
import VideoCommentsModal from './VideoCommentsModal.jsx'
import VlogCard from './VlogCard.jsx'

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

export default function LatestVlogs({ trips }) {
  const allVlogs = getAllVlogs(trips)

  const isSmUp = useIsSmUp()
  const initialCount = isSmUp ? 9 : 8
  const [visibleCount, setVisibleCount] = useState(initialCount)
  const vlogs = allVlogs.slice(0, visibleCount)
  const hasMore = allVlogs.length > vlogs.length

  const [headerRef, headerVisible] = useScrollReveal()
  const [showAll, setShowAll] = useState(false)
  const [openVlog, setOpenVlog] = useState(null)
  const [commentOverrides, setCommentOverrides] = useState({})

  const { data: engagement } = useVideoEngagement(vlogs.map(v => v.id))

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
        {vlogs.map((vlog, i) => {
          const { id } = vlog
          const counts = engagement.get(id)
          return (
            <VlogCard
              key={id}
              vlog={vlog}
              delay={(i % LOAD_MORE_COUNT) * 70}
              likeCount={counts?.likeCount ?? 0}
              commentCount={commentOverrides[id] ?? counts?.commentCount ?? 0}
              onOpenComments={() => setOpenVlog(vlog)}
            />
          )
        })}
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

      {openVlog && (
        <VideoCommentsModal
          vlog={openVlog}
          initialCount={engagement.get(openVlog.id)?.likeCount ?? 0}
          onClose={() => setOpenVlog(null)}
          onCommentPosted={(newCount) =>
            setCommentOverrides(prev => ({ ...prev, [openVlog.id]: newCount }))
          }
        />
      )}
    </section>
  )
}
