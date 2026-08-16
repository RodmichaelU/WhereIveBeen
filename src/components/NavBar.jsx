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
    <nav className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/60 border border-slate-700/60 rounded-xl p-1">
      {LINKS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-colors ${
              isActive
                ? 'bg-orange-500/15 text-orange-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`
          }
        >
          <Icon size={14} strokeWidth={2.5} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
