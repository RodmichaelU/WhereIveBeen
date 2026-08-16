const STORAGE_KEY = 'likedVideoIds'

function readLikedSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function writeLikedSet(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently
  }
}

export function isVideoLiked(videoId) {
  return readLikedSet().has(videoId)
}

export function markVideoLiked(videoId) {
  const set = readLikedSet()
  set.add(videoId)
  writeLikedSet(set)
}

export function unmarkVideoLiked(videoId) {
  const set = readLikedSet()
  set.delete(videoId)
  writeLikedSet(set)
}
