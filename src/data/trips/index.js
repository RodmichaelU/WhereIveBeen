const modules = import.meta.glob('./*.json', { eager: true })

function normalize(trip) {
  if (trip.visits) return trip
  return {
    ...trip,
    visits: [{
      visitDate: trip.visitDate ?? '',
      description: trip.description ?? '',
      youtubeUrls: trip.youtubeUrls ?? [],
      photos: trip.photos ?? [],
    }],
  }
}

const trips = Object.values(modules).flatMap(m => m.default).map(normalize)
export default trips
