import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import WorldMap from '../components/WorldMap'
import TripModal from '../components/TripModal'
import LatestVlogs from '../components/LatestVlogs'
import trips from '../data/trips/index.js'

export default function HomePage() {
  const [selectedTrip, setSelectedTrip] = useState(null)

  return (
    <>
      <div className="h-[60vh] md:h-[65vh]">
        <WorldMap
          trips={trips}
          selectedTrip={selectedTrip}
          onTripSelect={setSelectedTrip}
        />
      </div>

      <div className="flex flex-col items-center gap-1 py-4 bg-slate-900 border-b border-slate-800">
        <p className="text-slate-400 text-xs font-medium tracking-wide uppercase">
          Click any pin — vlogs &amp; photos inside
        </p>
        <p className="text-slate-500 text-xs">Scroll down for the latest travel vlogs</p>
        <ChevronDown size={16} className="text-orange-400 mt-1 animate-bounce" />
      </div>

      <LatestVlogs trips={trips} />

      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </>
  )
}
