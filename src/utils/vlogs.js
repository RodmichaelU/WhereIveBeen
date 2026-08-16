import { getYouTubeId } from './youtube.js'

const MONTHS = {
  January: 0, February: 1, March: 2, April: 3,
  May: 4, June: 5, July: 6, August: 7,
  September: 8, October: 9, November: 10, December: 11,
}

export function parseVisitDate(str) {
  if (!str) return new Date(0)
  const [month, year] = str.split(' ')
  return new Date(parseInt(year), MONTHS[month] ?? 0)
}

// Every video across every trip/visit, newest visit first.
export function getAllVlogs(trips) {
  return trips
    .flatMap(trip =>
      trip.visits.flatMap(visit =>
        (visit.youtubeUrls || [])
          .map(url => ({ url, id: getYouTubeId(url), trip, visit }))
          .filter(v => v.id)
      )
    )
    .sort((a, b) => parseVisitDate(b.visit.visitDate) - parseVisitDate(a.visit.visitDate))
}
