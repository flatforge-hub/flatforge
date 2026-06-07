import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">About Flatforge</h1>
      <p className="text-zinc-400 mb-10 text-lg">
        Open source apps for the Linux desktop, built with any tools you love.
      </p>

      <div className="space-y-10">
        <Section title="Why Flatforge?">
          <p>
            Flatforge is a Flatpak repository for open-source applications. It doesn't matter
            what built yours: a plain text editor, a full IDE, and an AI assistant all qualify.
          </p>
          <p className="mt-3">
            More applications make for a healthier Linux desktop, so our reviews focus on what
            matters: code quality, sandbox integrity, and open-source licensing. How you wrote
            the code doesn't factor in.
          </p>
        </Section>

        <Section title="Our policy in brief">
          <ul className="space-y-2">
            <PolicyItem ok>Open-source licence required (OSI-approved, CC0, or Unlicense)</PolicyItem>
            <PolicyItem ok>Flatpak sandbox enforced: <code>finish-args</code> reviewed</PolicyItem>
            <PolicyItem ok>AppStream metadata required (icon, description, screenshots)</PolicyItem>
            <PolicyItem ok>If you used AI tools, name them in your metadata: it's for transparency, not gatekeeping</PolicyItem>
            <PolicyItem bad>No proprietary applications</PolicyItem>
            <PolicyItem bad>No malware, spyware, or adware</PolicyItem>
            <PolicyItem bad>No slop: apps must have genuine utility</PolicyItem>
          </ul>
          <p className="mt-4">
            <a href="https://github.com/flatforge-hub/hub-meta/blob/main/docs/POLICY.md"
               target="_blank" rel="noopener noreferrer"
               className="text-forge-400 hover:text-forge-300 text-sm">
              Read the full policy →
            </a>
          </p>
        </Section>

        <Section title="Infrastructure">
          <p>
            Flatforge uses an OSTree-based Flatpak repository served over HTTPS, with GPG-signed
            repository metadata. All applications are built in CI from their flatpak-builder manifests.
          </p>
          <ul className="mt-3 space-y-1 text-sm">
            <li className="flex gap-2"><span className="text-forge-400">→</span> OSTree repository with GPG signing</li>
            <li className="flex gap-2"><span className="text-forge-400">→</span> GitHub Actions for automated Flatpak builds</li>
            <li className="flex gap-2"><span className="text-forge-400">→</span> Cloudflare CDN for distribution</li>
            <li className="flex gap-2"><span className="text-forge-400">→</span> All infrastructure code is open source</li>
          </ul>
        </Section>

        <Section title="Add the repository">
          <p className="mb-3">Install Flatforge as a Flatpak remote:</p>
          <pre className="code-block text-xs">
{`flatpak remote-add --if-not-exists flatforge \\
  https://flatforge.bugsy.cz/flatforge.flatpakrepo`}
          </pre>
        </Section>

        <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-800">
          <a href="https://github.com/flatforge-hub" target="_blank" rel="noopener noreferrer"
             className="btn-secondary text-sm">
            GitHub Organization
          </a>
          <Link to="/submit" className="btn-secondary text-sm">
            Submit an App
          </Link>
          <a href="https://github.com/flatforge-hub/hub-meta/blob/main/docs/POLICY.md"
             target="_blank" rel="noopener noreferrer"
             className="btn-secondary text-sm">
            Full Policy
          </a>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-200 mb-4">{title}</h2>
      <div className="text-zinc-400 leading-relaxed">{children}</div>
    </section>
  )
}

function PolicyItem({ ok, bad, children }: { ok?: boolean; bad?: boolean; children: React.ReactNode }) {
  const icon = ok ? '✓' : bad ? '✗' : '•'
  const color = ok ? 'text-emerald-400' : bad ? 'text-red-400' : 'text-zinc-400'
  return (
    <li className="flex gap-2 text-sm">
      <span className={color}>{icon}</span>
      <span>{children}</span>
    </li>
  )
}
