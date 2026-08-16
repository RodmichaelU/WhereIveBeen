import { NavLink } from 'react-router-dom'
import { Home, BarChart3, TrendingUp, Video } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/trending', label: 'Trending', icon: TrendingUp },
  { to: '/vlogs', label: 'Vlogs', icon: Video },
]

export default function NavBar() {
  return (
    <nav className="flex items-center gap-1.5">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-orange-500/15 border border-orange-500/30 text-orange-400'
                : 'border border-transparent text-slate-400 hover:text-white'
            }`
          }
        >
          <Icon size={14} strokeWidth={2.5} />
          <span className="hidden sm:inline">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
