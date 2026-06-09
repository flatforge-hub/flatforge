import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import appsData from '../data/apps.json'
import type { App } from '../types'

const apps = appsData as App[]
const DOMAIN = import.meta.env.VITE_DOMAIN ?? 'flatforge.org'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs
                 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200
                 transition-colors border border-zinc-700"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

export default function AppDetail() {
  const { id } = useParams<{ id: string }>()
  const [activeScreenshot, setActiveScreenshot] = useState(0)

  const app = apps.find((a) => a.id === id)

  if (!app) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-4xl mb-4">404</p>
        <p className="text-zinc-400 mb-6">App <code className="text-forge-400">{id}</code> not found.</p>
        <Link to="/" className="btn-primary">Browse all apps</Link>
      </div>
    )
  }

  const installCmd = [
    `flatpak remote-add --if-not-exists flatforge \\`,
    `  https://${DOMAIN}/flatforge.flatpakrepo`,
    `flatpak install flatforge ${app.id}`,
  ].join('\n')

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        All apps
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-8">
          {/* App header */}
          <div className="flex items-start gap-5">
            <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-zinc-800 flex items-center justify-center">
              {app.icon ? (
                <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-600">
                  <rect x="3" y="3" width="18" height="18" rx="4"/>
                  <path d="M9 12h6M12 9v6"/>
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-100">{app.name}</h1>
              <p className="text-zinc-400 mt-0.5">{app.developer}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {app.categories.map((cat) => (
                  <span key={cat} className="badge bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {cat}
                  </span>
                ))}
                {app.ai_tools_used && (
                  <span className="badge bg-forge-900/50 text-forge-300 border border-forge-800">
                    Built with AI
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Screenshots */}
          {app.screenshots.length > 0 && (
            <div>
              <div className="rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-video">
                <img
                  src={app.screenshots[activeScreenshot]}
                  alt={`Screenshot ${activeScreenshot + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
              {app.screenshots.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {app.screenshots.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveScreenshot(i)}
                      className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-colors ${
                        i === activeScreenshot ? 'border-forge-500' : 'border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-200 mb-3">About</h2>
            <div className="prose prose-sm prose-invert max-w-none text-zinc-400 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {app.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* AI disclosure */}
          {app.ai_tools_used && (
            <div className="rounded-xl border border-forge-800 bg-forge-950/30 p-4">
              <p className="text-sm font-medium text-forge-300 mb-1">AI-assisted development</p>
              <p className="text-sm text-zinc-400">
                This application was built using: <span className="text-zinc-300">{app.ai_tools_used}</span>
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Install */}
          <div className="card p-5">
            <h2 className="font-semibold text-zinc-200 mb-4">Install</h2>
            <div className="relative">
              <pre className="code-block text-xs leading-relaxed whitespace-pre">{installCmd}</pre>
              <CopyButton text={installCmd} />
            </div>
            <p className="text-xs text-zinc-600 mt-3">
              Requires <a href="https://flatpak.org" target="_blank" rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-400">Flatpak</a> to be installed.
            </p>
          </div>

          {/* Metadata */}
          <div className="card p-5 space-y-3 text-sm">
            <h2 className="font-semibold text-zinc-200 mb-1">Details</h2>
            <MetaRow label="Version" value={app.version} />
            <MetaRow label="Released" value={app.release_date} />
            <MetaRow label="License" value={app.license} />
            <MetaRow label="App ID" value={app.id} mono />
            {app.website && (
              <div className="flex justify-between gap-4">
                <span className="text-zinc-500 shrink-0">Website</span>
                <a href={app.website} target="_blank" rel="noopener noreferrer"
                   className="text-forge-400 hover:text-forge-300 truncate transition-colors">
                  {app.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  if (!value) return null
  return (
    <div className="flex justify-between gap-4">
      <span className="text-zinc-500 shrink-0">{label}</span>
      <span className={`text-zinc-300 truncate text-right ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  )
}
