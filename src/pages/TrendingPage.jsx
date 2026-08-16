import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { getAllVlogs, parseVisitDate } from '../utils/vlogs.js'
import { useVideoEngagement } from '../hooks/useVideoEngagement.js'
import VlogCard from '../components/VlogCard.jsx'
import VideoCommentsModal from '../components/VideoCommentsModal.jsx'
import trips from '../data/trips/index.js'

const TOP_N = 12
const STAGGER = 3 // matches the 3-col grid at sm:+

export default function TrendingPage() {
  const allVlogs = getAllVlogs(trips)
  const { data: engagement } = useVideoEngagement(allVlogs.map(v => v.id))

  const [openVlog, setOpenVlog] = useState(null)
  const [commentOverrides, setCommentOverrides] = useState({})

  const ranked = [...allVlogs]
    .sort((a, b) => {
      const scoreA = (engagement.get(a.id)?.likeCount ?? 0) + (engagement.get(a.id)?.commentCount ?? 0)
      const scoreB = (engagement.get(b.id)?.likeCount ?? 0) + (engagement.get(b.id)?.commentCount ?? 0)
      if (scoreB !== scoreA) return scoreB - scoreA
      return parseVisitDate(b.visit.visitDate) - parseVisitDate(a.visit.visitDate)
    })
    .slice(0, TOP_N)

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30">
          <TrendingUp size={15} className="text-orange-400" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">Trending Vlogs</h1>
          <p className="text-slate-500 text-xs mt-0.5">Ranked by likes &amp; comments from all visitors</p>
        </div>
      </div>

      {ranked.length === 0 ? (
        <p className="text-slate-600 text-sm italic text-center py-12">No vlogs yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {ranked.map((vlog, i) => {
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
