import { Link } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/stats', label: 'Stats' },
  { to: '/trending', label: 'Trending' },
  { to: '/vlogs', label: 'Vlogs' },
]

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 py-10 text-center">
      <p className="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Rodmichael Umapas &middot; Built with React, Vite &amp; Tailwind
      </p>
      <nav className="flex items-center justify-center gap-6 mt-4">
        {LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-slate-500 hover:text-white text-sm transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
