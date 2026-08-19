import { useMemo, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp.js'
import { COUNTRY_TO_ISO } from '../data/countryToIso.js'
import { getAllVlogs } from '../utils/vlogs.js'
import countryPaths from '../data/countryPaths.json'

// viewBox from the source map (see attribution below)
const VIEW_BOX = '30.767 241.591 784.077 458.627'
const MIN_OPACITY = 0.35

export default function VisitsChoropleth({ trips }) {
  const [hovered, setHovered] = useState(null) // { name, count } | null

  const { countries, total, maxCount } = useMemo(() => {
    const counts = {}
    // Same vlog extraction as everywhere else in the app (LatestVlogs,
    // Trending, Vlogs page) — a country's video count doesn't track its
    // visit count 1:1, so this counts real published vlogs, not visits.
    getAllVlogs(trips).forEach(v => {
      counts[v.trip.country] = (counts[v.trip.country] || 0) + 1
    })

    const list = Object.entries(counts)
      .map(([name, count]) => ({ name, count, iso: COUNTRY_TO_ISO[name] }))
      .filter(c => c.iso && countryPaths[c.iso])

    return {
      countries: list,
      total: Object.values(counts).reduce((s, c) => s + c, 0),
      maxCount: Math.max(1, ...list.map(c => c.count)),
    }
  }, [trips])

  const displayValue = useCountUp(hovered ? hovered.count : total)
  const displayLabel = hovered ? hovered.name : 'Total Vlogs'
  const visitedIsoSet = useMemo(() => new Set(countries.map(c => c.iso)), [countries])
  const countByIso = useMemo(() => Object.fromEntries(countries.map(c => [c.iso, c])), [countries])

  return (
    <div>
      <div className="mb-4">
        <div className="text-3xl sm:text-4xl font-bold text-amber-400 leading-none tabular-nums">
          {displayValue}
        </div>
        <div className="text-sm font-semibold text-white mt-1.5">{displayLabel}</div>
      </div>

      <svg viewBox={VIEW_BOX} className="w-full h-auto" role="img" aria-label="Vlogs by country map">
        {Object.entries(countryPaths).map(([iso, d]) => {
          const entry = countByIso[iso]
          const isVisited = visitedIsoSet.has(iso)
          const opacity = isVisited ? MIN_OPACITY + (entry.count / maxCount) * (1 - MIN_OPACITY) : 1

          return (
            <path
              key={iso}
              d={d}
              className={isVisited ? 'fill-amber-400 transition-opacity' : 'fill-slate-700/40 stroke-slate-800'}
              style={isVisited ? { opacity, cursor: 'pointer' } : { strokeWidth: 0.5 }}
              tabIndex={isVisited ? 0 : undefined}
              role={isVisited ? 'button' : undefined}
              aria-label={isVisited ? `${entry.name}: ${entry.count} ${entry.count === 1 ? 'vlog' : 'vlogs'}` : undefined}
              onMouseEnter={isVisited ? () => setHovered(entry) : undefined}
              onMouseLeave={isVisited ? () => setHovered(null) : undefined}
              onFocus={isVisited ? () => setHovered(entry) : undefined}
              onBlur={isVisited ? () => setHovered(null) : undefined}
            />
          )
        })}
      </svg>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-500">Fewer</span>
          {[0.35, 0.55, 0.75, 1].map(o => (
            <div key={o} className="w-3.5 h-3.5 rounded-sm bg-amber-400" style={{ opacity: o }} />
          ))}
          <span className="text-[10px] text-slate-500">More</span>
        </div>
        <a
          href="https://github.com/flekschas/simple-world-map"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
        >
          Map: A. MacDonald &amp; F. Lekschas, CC BY-SA 3.0
        </a>
      </div>
    </div>
  )
}
