import { NON_UN_TERRITORIES } from '../data/territories.js'

const UN_MEMBER_STATES = 193

const ALL_CONTINENTS = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
]

export default function Stats({ trips }) {
  const allCountries = [...new Set(trips.map(t => t.country))]
  const unCountries = allCountries.filter(c => !NON_UN_TERRITORIES.has(c))
  const territories = allCountries.filter(c => NON_UN_TERRITORIES.has(c))
  const visitedContinents = [...new Set(trips.map(t => t.continent))]
  const totalVisits = trips.reduce((sum, t) => sum + t.visits.length, 0)
  const unPercent = (unCountries.length / UN_MEMBER_STATES) * 100
  const unPercentDisplay = unPercent < 1 ? unPercent.toFixed(2) : unPercent.toFixed(1)

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-5">
        Travel Stats
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-5">
        <StatCard
          value={unCountries.length}
          label="Countries"
          sub={`UN member states`}
        />
        <StatCard
          value={territories.length}
          label="Territories"
          sub={`non-UN places`}
        />
        <StatCard
          value={visitedContinents.length}
          label="Continents"
          sub={`out of 7`}
        />
        <StatCard
          value={trips.length}
          label="Places"
          sub={totalVisits > trips.length ? `${totalVisits} total visits` : 'unique locations'}
        />
        <StatCard
          value={`${unPercentDisplay}%`}
          label="UN Countries"
          sub={`${unCountries.length} of ${UN_MEMBER_STATES}`}
        >
          <div className="mt-3 w-full bg-slate-700 rounded-full h-1">
            <div
              className="bg-amber-400 h-1 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(unPercent, 100)}%` }}
            />
          </div>
        </StatCard>
      </div>

      {/* Continents breakdown */}
      <div className="bg-slate-800/70 border border-slate-700/60 rounded-xl p-4 sm:p-5">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3.5">
          Continents
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {ALL_CONTINENTS.map(continent => {
            const visited = visitedContinents.includes(continent)
            const countryCount = new Set(
              trips.filter(t => t.continent === continent).map(t => t.country)
            ).size

            return (
              <div
                key={continent}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  visited
                    ? 'bg-amber-400/10 border border-amber-400/25 text-amber-200'
                    : 'bg-slate-700/40 border border-slate-600/40 text-slate-400'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    visited ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                />
                <span className="truncate text-xs sm:text-sm">{continent}</span>
                {visited && countryCount > 0 && (
                  <span className="ml-auto text-xs text-amber-500/60 flex-shrink-0">
                    {countryCount}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, label, sub, children }) {
  return (
    <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 sm:p-5">
      <div className="text-3xl sm:text-4xl font-bold text-orange-400 leading-none tabular-nums">
        {value}
      </div>
      <div className="text-sm font-semibold text-white mt-2">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      {children}
    </div>
  )
}
