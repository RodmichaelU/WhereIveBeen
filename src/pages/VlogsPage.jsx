import { useMemo, useState } from 'react'
import { Video, Search } from 'lucide-react'
import { getAllVlogs } from '../utils/vlogs.js'
import { useVideoEngagement } from '../hooks/useVideoEngagement.js'
import VlogCard from '../components/VlogCard.jsx'
import VideoCommentsModal from '../components/VideoCommentsModal.jsx'
import trips from '../data/trips/index.js'

const STAGGER = 3 // matches the 3-col grid at sm:+

export default function VlogsPage() {
  const allVlogs = getAllVlogs(trips)
  const { data: engagement } = useVideoEngagement(allVlogs.map(v => v.id))

  const [query, setQuery] = useState('')
  const [openVlog, setOpenVlog] = useState(null)
  const [commentOverrides, setCommentOverrides] = useState({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allVlogs
    return allVlogs.filter(({ trip }) =>
      trip.name.toLowerCase().includes(q) || trip.country.toLowerCase().includes(q)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allVlogs, query])

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30">
          <Video size={15} className="text-orange-400" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">All Travel Vlogs</h1>
          <p className="text-slate-500 text-xs mt-0.5">{allVlogs.length} videos</p>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by place or country..."
          className="w-full bg-slate-900/60 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-slate-600 text-sm italic text-center py-12">No videos match &quot;{query}&quot;</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((vlog, i) => {
            const counts = engagement.get(vlog.id)
            return (
              <VlogCard
                key={vlog.id}
                vlog={vlog}
                delay={(i % STAGGER) * 70}
                likeCount={counts?.likeCount ?? 0}
                commentCount={commentOverrides[vlog.id] ?? counts?.commentCount ?? 0}
                onOpenComments={() => setOpenVlog(vlog)}
              />
            )
          })}
        </div>
      )}

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
