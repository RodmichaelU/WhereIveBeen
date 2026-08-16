import { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Stats from './components/Stats'
import HomePage from './pages/HomePage'
import TrendingPage from './pages/TrendingPage'
import VlogsPage from './pages/VlogsPage'
import trips from './data/trips/index.js'
import { NON_UN_TERRITORIES } from './data/territories.js'

export default function App() {
  const uniqueCountries = useMemo(
    () => trips.filter(t => !NON_UN_TERRITORIES.has(t.country)).reduce((s, t) => s.add(t.country), new Set()).size,
    []
  )

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="sticky top-0 z-[500] bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/60 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Where has RJ been?
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {uniqueCountries} {uniqueCountries === 1 ? 'country' : 'countries'} &middot; {trips.length} {trips.length === 1 ? 'place' : 'places'} visited
            </p>
          </div>
          <NavBar />
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stats" element={<Stats trips={trips} />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/vlogs" element={<VlogsPage />} />
      </Routes>
    </div>
  )
}
