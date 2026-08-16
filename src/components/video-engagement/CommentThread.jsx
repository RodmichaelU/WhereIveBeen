import { useState } from 'react'
import { Send } from 'lucide-react'
import { useComments } from '../../hooks/useComments.js'

const MAX_BODY_LENGTH = 500

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CommentThread({ videoId, onCommentPosted }) {
  const { comments, loading, addComment } = useComments(videoId)
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!body.trim() || honeypot) return

    setSubmitting(true)
    try {
      await addComment({ authorName: name, body })
      setBody('')
      onCommentPosted?.(comments.length + 1)
    } catch {
      // best-effort — leave the draft in place so the user can retry
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-slate-600 text-sm italic text-center py-4">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-slate-600 text-sm italic text-center py-4">No comments yet — be the first!</p>
      ) : (
        <ul className="space-y-2.5">
          {comments.map(c => (
            <li key={c.id} className="bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-white text-xs font-semibold">{c.author_name}</span>
                <span className="text-slate-500 text-[11px]">{formatDate(c.created_at)}</span>
              </div>
              <p className="text-slate-300 text-sm mt-1 whitespace-pre-wrap break-words">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={80}
          className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
        />
        {/* Honeypot — hidden from real users, bots tend to fill every field */}
        <input
          value={honeypot}
          onChange={e => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="absolute -left-[9999px] w-px h-px opacity-0"
          aria-hidden="true"
        />
        <div className="flex items-end gap-2">
          <textarea
            value={body}
            onChange={e => setBody(e.target.value.slice(0, MAX_BODY_LENGTH))}
            placeholder="Add a comment..."
            rows={2}
            className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 hover:border-orange-400/50 text-slate-300 hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Post comment"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="text-slate-600 text-[11px] text-right">{body.length}/{MAX_BODY_LENGTH}</p>
      </form>
    </div>
  )
}
