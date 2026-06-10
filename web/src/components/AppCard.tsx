import { Link } from 'react-router-dom'
import type { App } from '../types'

interface Props {
  app: App
}

const CATEGORY_COLORS: Record<string, string> = {
  Game:         'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800',
  Games:        'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-400 dark:border-emerald-800',
  Utility:      'bg-blue-100    text-blue-700    border-blue-300    dark:bg-blue-900/50    dark:text-blue-400    dark:border-blue-800',
  Utilities:    'bg-blue-100    text-blue-700    border-blue-300    dark:bg-blue-900/50    dark:text-blue-400    dark:border-blue-800',
  Development:  'bg-amber-100   text-amber-700   border-amber-300   dark:bg-amber-900/50   dark:text-amber-400   dark:border-amber-800',
  Graphics:     'bg-pink-100    text-pink-700    border-pink-300    dark:bg-pink-900/50    dark:text-pink-400    dark:border-pink-800',
  Office:       'bg-teal-100    text-teal-700    border-teal-300    dark:bg-teal-900/50    dark:text-teal-400    dark:border-teal-800',
  Education:    'bg-cyan-100    text-cyan-700    border-cyan-300    dark:bg-cyan-900/50    dark:text-cyan-400    dark:border-cyan-800',
  Science:      'bg-violet-100  text-violet-700  border-violet-300  dark:bg-violet-900/50  dark:text-violet-400  dark:border-violet-800',
  Network:      'bg-indigo-100  text-indigo-700  border-indigo-300  dark:bg-indigo-900/50  dark:text-indigo-400  dark:border-indigo-800',
  Multimedia:   'bg-rose-100    text-rose-700    border-rose-300    dark:bg-rose-900/50    dark:text-rose-400    dark:border-rose-800',
}

function categoryClass(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800/60 dark:text-zinc-400 dark:border-zinc-700'
}

export default function AppCard({ app }: Props) {
  const primaryCategory = app.categories[0] ?? ''

  return (
    <Link to={`/app/${app.id}`} className="card block p-5 group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
          {app.icon ? (
            <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl text-zinc-400 dark:text-zinc-600 select-none">
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
            <span className="font-semibold text-zinc-900 group-hover:text-forge-600 dark:text-zinc-100 dark:group-hover:text-forge-300 transition-colors truncate">
              {app.name}
            </span>
            {primaryCategory && (
              <span className={`badge border ${categoryClass(primaryCategory)}`}>
                {primaryCategory}
              </span>
            )}
            {app.ai_tools_used && (
              <span className="badge bg-forge-100 text-forge-700 border border-forge-300 dark:bg-forge-900/50 dark:text-forge-400 dark:border-forge-800" title={`Built with: ${app.ai_tools_used}`}>
                AI
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">{app.summary}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-600">
        <span>{app.developer}</span>
        <span className="flex items-center gap-1 text-forge-600 dark:text-forge-400 group-hover:gap-2 transition-all">
          {app.version && `v${app.version}`}
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  )
}
