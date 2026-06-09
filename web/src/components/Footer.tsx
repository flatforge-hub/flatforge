import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <p className="font-semibold text-zinc-100 mb-3">Flatforge</p>
            <p className="text-zinc-500 leading-relaxed">
              An AI-friendly alternative Flatpak repository for open-source Linux applications.
            </p>
          </div>
          <div>
            <p className="font-semibold text-zinc-400 mb-3">Links</p>
            <ul className="space-y-2">
              <li><Link to="/" className="text-zinc-500 hover:text-zinc-300 transition-colors">Browse Apps</Link></li>
              <li><Link to="/submit" className="text-zinc-500 hover:text-zinc-300 transition-colors">Submit an App</Link></li>
              <li><Link to="/about" className="text-zinc-500 hover:text-zinc-300 transition-colors">About</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-zinc-400 mb-3">Documentation</p>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacy</Link></li>
              <li>
                <a href="https://github.com/flatforge-hub/hub-meta/blob/main/docs/POLICY.md"
                   target="_blank" rel="noopener noreferrer"
                   className="text-zinc-500 hover:text-zinc-300 transition-colors">Policy</a>
              </li>
              <li>
                <a href="https://github.com/flatforge-hub/hub-meta/blob/main/docs/SECURITY.md"
                   target="_blank" rel="noopener noreferrer"
                   className="text-zinc-500 hover:text-zinc-300 transition-colors">Security</a>
              </li>
              <li>
                <a href="https://github.com/flatforge-hub"
                   target="_blank" rel="noopener noreferrer"
                   className="text-zinc-500 hover:text-zinc-300 transition-colors">GitHub</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-zinc-600">
          <span>Flatforge: open source infrastructure for open source apps</span>
          <span>AI tools are welcome here</span>
        </div>
      </div>
    </footer>
  )
}
