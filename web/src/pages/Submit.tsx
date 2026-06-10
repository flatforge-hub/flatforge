export default function Submit() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Submit an App</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-10">
        Flatforge accepts open-source Flatpak applications.
      </p>

      <div className="mb-10 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        <h2 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Before you open a PR</h2>
        <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span><strong className="text-zinc-700 dark:text-zinc-300">One app per PR</strong> — each submission PR must contain exactly one application.</span></li>
          <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span><strong className="text-zinc-700 dark:text-zinc-300">Submission limit</strong> — your account may have at most 2 open submission PRs at a time. A third will be closed automatically without review.</span></li>
          <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span><strong className="text-zinc-700 dark:text-zinc-300">App ID</strong> — you must own or control the namespace in your App ID before submitting (see the table below).</span></li>
          <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span><strong className="text-zinc-700 dark:text-zinc-300">Questions first</strong> — if your App ID needs maintainer approval, or you're unsure whether your app fits, open a GitHub issue with the <code className="text-zinc-700 dark:text-zinc-300">question</code> label before opening a submission PR.</span></li>
        </ul>
      </div>

      <div className="space-y-10">
        <Step number={1} title="Clone the submission branch">
          <p className="text-zinc-600 dark:text-zinc-400">
            Submissions go into the{' '}
            <a href="https://github.com/flatforge-hub/flatforge" target="_blank" rel="noopener noreferrer"
               className="text-forge-600 dark:text-forge-400 hover:text-forge-500 dark:hover:text-forge-300">
              flatforge-hub/flatforge
            </a>
            {' '}repo via the <code className="text-zinc-700 dark:text-zinc-300">new-sub</code> orphan branch.
          </p>
          <Code>{`git clone --single-branch --branch new-sub \\
    git@github.com:flatforge-hub/flatforge.git
cd flatforge
git checkout -b org.example.MyApp`}</Code>
        </Step>

        <Step number={2} title="Add your app directory">
          <p className="text-zinc-600 dark:text-zinc-400">Create a directory named after your App ID (reverse-DNS format):</p>
          <Code>{`mkdir -p apps/org.example.MyApp`}</Code>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3">Your directory must contain:</p>
          <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span> <code className="text-zinc-700 dark:text-zinc-300">org.example.MyApp.json</code>:{' '}
              <a href="https://docs.flatpak.org/en/latest/manifests.html" target="_blank" rel="noopener noreferrer" className="text-forge-600 dark:text-forge-400 hover:text-forge-500 dark:hover:text-forge-300">flatpak-builder manifest</a>
            </li>
            <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span> <code className="text-zinc-700 dark:text-zinc-300">org.example.MyApp.metainfo.xml</code>:{' '}
              <a href="https://www.freedesktop.org/software/appstream/docs/" target="_blank" rel="noopener noreferrer" className="text-forge-600 dark:text-forge-400 hover:text-forge-500 dark:hover:text-forge-300">AppStream metadata</a>
            </li>
            <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span> <code className="text-zinc-700 dark:text-zinc-300">metadata.yaml</code>: web listing metadata (schema below)</li>
          </ul>
        </Step>

        <Step number={3} title="Fill in metadata.yaml">
          <p className="text-zinc-600 dark:text-zinc-400 mb-3">Use this schema:</p>
          <Code>{`id: org.example.MyApp
name: My App
summary: Short one-line description
description: |
  Longer description in **Markdown**.
developer: Your Name
website: https://example.com
license: GPL-3.0        # SPDX identifier
icon: https://example.com/icon.png
screenshots:
  - https://example.com/screenshot1.png
  - https://example.com/screenshot2.png
categories:
  - Utility
ai_tools_used: "Claude Code, GitHub Copilot"   # omit if none
status: unmaintained     # optional; set when the app is no longer maintained
data_collection: "Sends anonymous crash reports to sentry.io"  # required if the
                          # app has network access and transmits user data`}</Code>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm">
            <code className="text-zinc-700 dark:text-zinc-300">version</code> and{' '}
            <code className="text-zinc-700 dark:text-zinc-300">release_date</code> are read automatically
            from <code className="text-zinc-700 dark:text-zinc-300">&lt;releases&gt;</code> in your{' '}
            <code className="text-zinc-700 dark:text-zinc-300">*.metainfo.xml</code> — no need to repeat them here.
            For the <code className="text-zinc-700 dark:text-zinc-300">license</code> field use an SPDX identifier;
            see the full list at{' '}
            <a href="https://spdx.org/licenses/" target="_blank" rel="noopener noreferrer"
               className="text-forge-600 dark:text-forge-400 hover:text-forge-500 dark:hover:text-forge-300">spdx.org/licenses</a>.
          </p>
        </Step>

        <Step number={4} title="App ID requirements">
          <p className="text-zinc-600 dark:text-zinc-400 mb-3">
            Your App ID must be in reverse-DNS format and reflect a namespace you own or control.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                  <th className="text-left px-4 py-2">ID format</th>
                  <th className="text-left px-4 py-2">Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {[
                  ['io.github.USERNAME.AppName', 'Source URL in manifest must be under github.com/USERNAME/ — CI verifies this automatically'],
                  ['io.gitlab.USERNAME.AppName', 'Source URL must be under gitlab.com/USERNAME/ — CI verifies this automatically'],
                  ['com.example.AppName', 'Add a DNS TXT record _flatforge.example.com TXT "github=USERNAME" or a /.well-known/flatforge-verify file containing github=USERNAME; state the method in your PR'],
                  ['org.gnome.*, org.kde.*, etc.', 'Contact a Flatforge maintainer for written approval before submitting'],
                ].map(([id, req]) => (
                  <tr key={id} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
                    <td className="px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300 text-xs whitespace-nowrap">{id}</td>
                    <td className="px-4 py-2">{req}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm">
            See{' '}
            <a href="https://github.com/flatforge-hub/flatforge/blob/main/docs/POLICY.md#app-id-verification"
               target="_blank" rel="noopener noreferrer" className="text-forge-600 dark:text-forge-400 hover:text-forge-500 dark:hover:text-forge-300">
              POLICY.md — App ID verification
            </a>{' '}
            for the full rules, including the namespace squatting policy.
          </p>
        </Step>

        <Step number={5} title="Open a Pull Request">
          <p className="text-zinc-600 dark:text-zinc-400">
            Push your branch and open a PR against{' '}
            <code className="text-zinc-700 dark:text-zinc-300">new-sub</code>{' '}
            (not <code className="text-zinc-700 dark:text-zinc-300">main</code>).
            GitHub Actions will automatically build and lint your Flatpak.
          </p>
          <Code>{`git add apps/org.example.MyApp/
git commit -m "Add org.example.MyApp"
git push origin org.example.MyApp
# Then open a PR targeting new-sub on GitHub`}</Code>
        </Step>

        <Step number={6} title="Review process">
          <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> CI builds your Flatpak and runs <code>flatpak-builder-lint</code></li>
            <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> A maintainer reviews sandbox permissions (<code>finish-args</code>)</li>
            <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> AppStream metadata is validated</li>
            <li className="flex gap-2"><span className="text-emerald-600 dark:text-emerald-400">✓</span> On acceptance, your app gets its own repo at <code>flatforge-hub/org.example.MyApp</code></li>
          </ul>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3">
            Review is done on a volunteer basis. There is no guaranteed timeline; a submission
            may take weeks or months and may require several rounds of back-and-forth.
            Expedited review cannot be demanded. A PR with no activity from your side for
            90 days will be closed as stale.
          </p>
        </Step>
      </div>

      <div className="mt-12 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
        <h2 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">A note on tools</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Flatforge accepts apps built with any tools: editors, IDEs, compilers, AI assistants, or a mix.
          List any AI tools you used in the <code className="text-zinc-700 dark:text-zinc-300">ai_tools_used</code> field in{' '}
          <code className="text-zinc-700 dark:text-zinc-300">metadata.yaml</code>, and they'll show up on the app's listing
          page. That's optional.
        </p>
      </div>

      <div className="mt-6 text-sm text-zinc-500">
        Questions? Open an issue on{' '}
        <a href="https://github.com/flatforge-hub/flatforge/issues" target="_blank" rel="noopener noreferrer"
           className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300">GitHub</a>.
        See also: <a href="https://github.com/flatforge-hub/flatforge/blob/main/docs/POLICY.md"
          target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300">Policy</a>{' '}
        and <a href="https://github.com/flatforge-hub/flatforge/blob/main/docs/SECURITY.md"
          target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-300">Security</a>.
      </div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-8 h-8 rounded-full bg-forge-200 dark:bg-forge-800 text-forge-800 dark:text-forge-200 flex items-center justify-center text-sm font-bold">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-3">{title}</h2>
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
