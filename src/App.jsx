import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Stats from './components/Stats'
import HomePage from './pages/HomePage'
import TrendingPage from './pages/TrendingPage'
import VlogsPage from './pages/VlogsPage'
import BeamsBackground from './components/BeamsBackground'
import trips from './data/trips/index.js'
import { NON_UN_TERRITORIES } from './data/territories.js'

export default function App() {
  const uniqueCountries = useMemo(
    () => trips.filter(t => !NON_UN_TERRITORIES.has(t.country)).reduce((s, t) => s.add(t.country), new Set()).size,
    []
  )

  const location = useLocation()
  const isHome = location.pathname === '/'
  const [showChrome, setShowChrome] = useState(!isHome)

  // On Home, the header's title/count is redundant with the hero — keep it
  // collapsed until scrolled past the hero. Every other page has no hero,
  // so the header always shows it.
  useEffect(() => {
    if (!isHome) {
      setShowChrome(true)
      return
    }
    const onScroll = () => setShowChrome(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  return (
    <div className="min-h-screen text-white">
      {/* z-0 (not a negative z-index) — iOS Safari frequently fails to
          composite a `position: fixed` element with a negative z-index
          correctly during scroll, sorting it behind the whole scrolling
          layer instead of just its DOM siblings. Being first in the DOM is
          what actually keeps this behind everything else. */}
      <BeamsBackground className="fixed inset-0 z-0 w-full h-full" intensity="strong" />
      <header
        className={`sticky top-0 z-[500] px-4 sm:px-6 py-3 sm:py-4 transition-colors duration-300 ${
          showChrome ? 'bg-slate-900/70 backdrop-blur-md border-b border-slate-800/60' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              showChrome ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className={`overflow-hidden transition-opacity duration-300 ${showChrome ? 'opacity-100' : 'opacity-0'}`}>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Where has RJ been?
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                {uniqueCountries} {uniqueCountries === 1 ? 'country' : 'countries'} &middot; {trips.length} {trips.length === 1 ? 'place' : 'places'} visited
              </p>
            </div>
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

      <Footer />
    </div>
  )
}
