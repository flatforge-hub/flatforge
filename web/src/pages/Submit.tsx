export default function Submit() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Submit an App</h1>
      <p className="text-zinc-400 mb-10">
        Flatforge welcomes open-source Flatpak applications — including those built with AI assistance.
      </p>

      <div className="space-y-10">
        <Step number={1} title="Fork and clone the submission repo">
          <p className="text-zinc-400">
            Create a fork of{' '}
            <a href="https://github.com/flatforge-hub/hub-apps" target="_blank" rel="noopener noreferrer"
               className="text-forge-400 hover:text-forge-300">
              github.com/flatforge-hub/hub-apps
            </a>
            , then clone it locally.
          </p>
          <Code>{`git clone https://github.com/YOUR_USERNAME/hub-apps
cd hub-apps`}</Code>
        </Step>

        <Step number={2} title="Add your app directory">
          <p className="text-zinc-400">Create a directory named after your App ID (reverse-DNS format):</p>
          <Code>{`mkdir -p apps/org.example.MyApp
cd apps/org.example.MyApp`}</Code>
          <p className="text-zinc-400 mt-3">Your directory must contain:</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-400">
            <li className="flex gap-2"><span className="text-forge-400">•</span> <code className="text-zinc-300">org.example.MyApp.json</code> — flatpak-builder manifest</li>
            <li className="flex gap-2"><span className="text-forge-400">•</span> <code className="text-zinc-300">org.example.MyApp.metainfo.xml</code> — AppStream metadata</li>
            <li className="flex gap-2"><span className="text-forge-400">•</span> <code className="text-zinc-300">metadata.yaml</code> — web listing metadata (schema below)</li>
          </ul>
        </Step>

        <Step number={3} title="Fill in metadata.yaml">
          <p className="text-zinc-400 mb-3">Use this schema:</p>
          <Code>{`id: org.example.MyApp
name: My App
summary: Short one-line description
description: |
  Longer description in **Markdown**.
developer: Your Name
website: https://example.com
license: GPL-3.0
icon: https://example.com/icon.png
screenshots:
  - https://example.com/screenshot1.png
categories:
  - Utility
ai_tools_used: "Claude Code, GitHub Copilot"   # omit if none
version: "1.0.0"
release_date: "2026-06-01"`}</Code>
        </Step>

        <Step number={4} title="Open a Pull Request">
          <p className="text-zinc-400">
            Push your branch and open a PR against{' '}
            <code className="text-zinc-300">flatforge/hub-apps:main</code>.
            GitHub Actions will automatically build and lint your Flatpak.
          </p>
          <Code>{`git add apps/org.example.MyApp/
git commit -m "Add org.example.MyApp"
git push origin my-app-submission
# Then open a PR on GitHub`}</Code>
        </Step>

        <Step number={5} title="Review process">
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex gap-2"><span className="text-emerald-400">✓</span> CI builds your Flatpak and runs <code>flatpak-builder-lint</code></li>
            <li className="flex gap-2"><span className="text-emerald-400">✓</span> A maintainer reviews sandbox permissions (<code>finish-args</code>)</li>
            <li className="flex gap-2"><span className="text-emerald-400">✓</span> AppStream metadata is validated</li>
            <li className="flex gap-2"><span className="text-emerald-400">✓</span> On merge, the app is published to the OSTree repository</li>
          </ul>
        </Step>
      </div>

      <div className="mt-12 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
        <h2 className="font-semibold text-zinc-300 mb-2">A note on tools</h2>
        <p className="text-sm text-zinc-400">
          Flatforge accepts apps built with any tools — editors, IDEs, compilers, AI assistants, or a combination.
          If you used AI tools, the <code className="text-zinc-300">ai_tools_used</code> field in{' '}
          <code className="text-zinc-300">metadata.yaml</code> is the place to mention them. It shows up
          on the app's listing page. Not required; just appreciated.
        </p>
      </div>

      <div className="mt-6 text-sm text-zinc-500">
        Questions? Open an issue on{' '}
        <a href="https://github.com/flatforge-hub/hub-apps/issues" target="_blank" rel="noopener noreferrer"
           className="text-zinc-400 hover:text-zinc-300">GitHub</a>.
        See also: <a href="https://github.com/flatforge-hub/hub-meta/blob/main/docs/POLICY.md"
          target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-300">Policy</a>{' '}
        and <a href="https://github.com/flatforge-hub/hub-meta/blob/main/docs/SECURITY.md"
          target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-300">Security</a>.
      </div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-8 h-8 rounded-full bg-forge-800 text-forge-200 flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-zinc-200 mb-3">{title}</h2>
        {children}
      </div>
    </div>
  )
}

function Code({ children }: { children: string }) {
  return (
    <pre className="code-block mt-3 whitespace-pre-wrap break-all text-xs leading-relaxed">
      {children}
    </pre>
  )
}
