import { Link } from 'react-router-dom'
import type { App } from '../types'

interface Props {
  app: App
}

const CATEGORY_COLORS: Record<string, string> = {
  Game:         'bg-emerald-900/50 text-emerald-400 border-emerald-800',
  Games:        'bg-emerald-900/50 text-emerald-400 border-emerald-800',
  Utility:      'bg-blue-900/50   text-blue-400   border-blue-800',
  Utilities:    'bg-blue-900/50   text-blue-400   border-blue-800',
  Development:  'bg-amber-900/50  text-amber-400  border-amber-800',
  Graphics:     'bg-pink-900/50   text-pink-400   border-pink-800',
  Office:       'bg-teal-900/50   text-teal-400   border-teal-800',
  Education:    'bg-cyan-900/50   text-cyan-400   border-cyan-800',
  Science:      'bg-violet-900/50 text-violet-400 border-violet-800',
  Network:      'bg-indigo-900/50 text-indigo-400 border-indigo-800',
  Multimedia:   'bg-rose-900/50   text-rose-400   border-rose-800',
}

function categoryClass(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-zinc-800/60 text-zinc-400 border-zinc-700'
}

export default function AppCard({ app }: Props) {
  const primaryCategory = app.categories[0] ?? ''

  return (
    <Link to={`/app/${app.id}`} className="card block p-5 group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
          {app.icon ? (
            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-zinc-600 select-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="4"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
            </span>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-zinc-100 group-hover:text-forge-300 transition-colors truncate">
              {app.name}
            </span>
            {primaryCategory && (
              <span className={`badge border ${categoryClass(primaryCategory)}`}>
                {primaryCategory}
              </span>
            )}
            {app.ai_tools_used && (
              <span className="badge bg-forge-900/50 text-forge-400 border border-forge-800" title={`Built with: ${app.ai_tools_used}`}>
                AI
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{app.summary}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
        <span>{app.developer}</span>
        <span className="flex items-center gap-1 text-forge-400 group-hover:gap-2 transition-all">
          v{app.version}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}
