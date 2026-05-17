import { useState, useMemo } from 'react'
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
              Where I've Been
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {uniqueCountries} {uniqueCountries === 1 ? 'country' : 'countries'} &middot; {trips.length} {trips.length === 1 ? 'place' : 'places'} visited
            </p>
          </div>
          <div className="text-slate-400 text-sm font-medium hidden sm:block">
            Click a pin to explore
          </div>
        </div>
      </header>

      <div className="h-[55vh] md:h-[65vh]">
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
