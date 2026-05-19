import { useState, useMemo } from 'react'
import { Video, Image } from 'lucide-react'
import WorldMap from './components/WorldMap'
import TripModal from './components/TripModal'
import Stats from './components/Stats'
import trips from './data/trips/index.js'

export default function App() {
  const [selectedTrip, setSelectedTrip] = useState(null)

  const uniqueCountries = useMemo(
    () => new Set(trips.map(t => t.country)).size,
    []
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-[500] bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Where has Rod been?
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {uniqueCountries} {uniqueCountries === 1 ? 'country' : 'countries'} &middot; {trips.length} {trips.length === 1 ? 'place' : 'places'} visited
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-700/60 border border-slate-600/50 rounded-xl px-3 py-1.5">
            <span className="text-slate-400 text-xs font-medium whitespace-nowrap">
              <span className="sm:hidden">Tap a pin</span>
              <span className="hidden sm:inline">Click a pin</span>
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="flex items-center gap-1 text-orange-400 text-xs font-semibold">
              <Video size={11} strokeWidth={2.5} />
              <span className="hidden sm:inline">Vlogs</span>
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className="flex items-center gap-1 text-orange-400 text-xs font-semibold">
              <Image size={11} strokeWidth={2.5} />
              <span className="hidden sm:inline">Photos</span>
            </span>
          </div>
        </div>
      </header>

      <div className="h-[60vh] md:h-[65vh]">
        <WorldMap
          trips={trips}
          selectedTrip={selectedTrip}
          onTripSelect={setSelectedTrip}
        />
      </div>

      <Stats trips={trips} />

      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </div>
  )
}
