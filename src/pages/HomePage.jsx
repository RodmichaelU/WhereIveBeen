import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, Heart, MessageCircle } from 'lucide-react'
import WorldMap from '../components/WorldMap'
import TripModal from '../components/TripModal'
import LatestVlogs from '../components/LatestVlogs'
import trips from '../data/trips/index.js'
import { NON_UN_TERRITORIES } from '../data/territories.js'

function HeroContent({ uniqueCountries, placesCount }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <h1
        className={`max-w-3xl font-bold text-5xl text-white leading-[1.08] tracking-tight sm:text-6xl md:text-7xl transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
      >
        Where has RJ
        <br />
        <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-orange-300 bg-clip-text text-transparent">
          been?
        </span>
      </h1>

      <p
        className={`max-w-md text-base text-white/60 leading-relaxed transition-all duration-700 ease-out delay-150 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {uniqueCountries} {uniqueCountries === 1 ? 'country' : 'countries'} &middot; {placesCount} places &middot; one map of everywhere I&apos;ve been.
      </p>

      <div
        className={`flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-xs text-slate-300 transition-all duration-700 ease-out delay-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <Heart size={13} className="text-orange-400" />
        <MessageCircle size={13} className="text-orange-400" />
        <span>Like &amp; comment on any vlog</span>
      </div>

      <ChevronDown
        size={22}
        className={`text-white/40 mt-2 animate-bounce transition-opacity duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  )
}

export default function HomePage() {
  const [selectedTrip, setSelectedTrip] = useState(null)

  const uniqueCountries = useMemo(
    () => trips.filter(t => !NON_UN_TERRITORIES.has(t.country)).reduce((s, t) => s.add(t.country), new Set()).size,
    []
  )

  return (
    <>
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <HeroContent uniqueCountries={uniqueCountries} placesCount={trips.length} />
      </div>

      <div className="h-[60vh] md:h-[65vh]">
        <WorldMap
          trips={trips}
          selectedTrip={selectedTrip}
          onTripSelect={setSelectedTrip}
        />
      </div>

      <div className="flex flex-col items-center gap-1 py-4 border-b border-slate-800/60">
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
