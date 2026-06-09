import { Link } from 'react-router-dom'

function Required({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-green-500 mt-0.5">✓</span><span>{children}</span></li>
}

function Rejected({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-red-500 mt-0.5">✗</span><span>{children}</span></li>
}

function Encouraged({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-indigo-400 mt-0.5">→</span><span>{children}</span></li>
}

export default function Policy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-zinc-100 mb-4">Policy</h1>
      <p className="text-zinc-400 leading-relaxed mb-10">
        Flatforge is a Flatpak repository for the Linux desktop. We accept open-source
        applications regardless of which tools were used to build them.
        Quality is required. Slop is not.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">Acceptance criteria</h2>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Required</h3>
        <ul className="space-y-2 text-zinc-400 mb-6">
          <Required><strong className="text-zinc-300">Open-source licence</strong> — OSI-approved, CC0, or Unlicense (SPDX identifier required)</Required>
          <Required><strong className="text-zinc-300">Source code URL</strong> — <code className="text-zinc-300 text-sm">source</code> field in <code className="text-zinc-300 text-sm">metadata.yaml</code> pointing to the public repository or archive</Required>
          <Required><strong className="text-zinc-300">AppStream metadata</strong> — valid <code className="text-zinc-300 text-sm">metainfo.xml</code> with description, icon, and at least one screenshot</Required>
          <Required><strong className="text-zinc-300">Correct App ID</strong> — reverse-DNS format matching a domain the developer controls (e.g. <code className="text-zinc-300 text-sm">io.github.username.AppName</code>)</Required>
          <Required><strong className="text-zinc-300">Working Flatpak</strong> — builds from the submitted manifest without patches by maintainers</Required>
          <Required><strong className="text-zinc-300">Reasonable sandbox</strong> — <code className="text-zinc-300 text-sm">finish-args</code> must be justified; gratuitous permissions are rejected</Required>
        </ul>
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Encouraged</h3>
        <ul className="space-y-2 text-zinc-400">
          <Encouraged>Wayland support (<code className="text-zinc-300 text-sm">--socket=wayland</code>)</Encouraged>
          <Encouraged>Portal-based file access instead of broad <code className="text-zinc-300 text-sm">--filesystem=</code> flags</Encouraged>
          <Encouraged>Dark mode support</Encouraged>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">What we reject</h2>
        <ul className="space-y-2 text-zinc-400">
          <Rejected>Proprietary applications</Rejected>
          <Rejected>Malware, spyware, adware, or any deceptive application</Rejected>
          <Rejected>Applications that crash on launch or are non-functional</Rejected>
          <Rejected>Duplicate applications with no differentiation from existing entries</Rejected>
          <Rejected>Misleading App IDs that impersonate other projects</Rejected>
          <Rejected>Applications with no genuine utility ("slop") — regardless of how they were built</Rejected>
          <Rejected>Custom or unreviewed licences — use MIT, Apache-2.0, GPL, CC0, or another established licence</Rejected>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">Trademarks and impersonation</h2>
        <div className="space-y-3 text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-300">Names</strong> — must not use a trademarked name in a way that implies official affiliation unless the submitter is the upstream developer or has written authorisation. An app named "Firefox" or "Visual Studio Code" submitted by a third party will be rejected.</p>
          <p><strong className="text-zinc-300">Unofficial wrappers</strong> — apps that wrap or extend another project must clearly identify themselves as unofficial. The name or summary must include "Unofficial", "Third-party", or "Community".</p>
          <p><strong className="text-zinc-300">Icons</strong> — must be original or licensed. Reproducing a trademarked icon without authorisation is not acceptable, even in modified form.</p>
          <p><strong className="text-zinc-300">Descriptions</strong> — marketing language that implies endorsement from another project or organisation will be rejected.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-4">Sandbox policy</h2>
        <p className="text-zinc-400 mb-4">Every submission is reviewed for <code className="text-zinc-300 text-sm">finish-args</code>. The following require written justification in your PR:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-zinc-400 border border-zinc-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-zinc-900 text-zinc-300">
                <th className="text-left px-4 py-2">Permission</th>
                <th className="text-left px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {[
                ['--filesystem=home', 'Almost always replaceable with XDG portals'],
                ['--filesystem=host', 'Almost never acceptable'],
                ['--share=network', 'Must be core to the application\'s function'],
                ['--socket=session-bus', 'Describe which D-Bus interfaces and why'],
                ['--device=all', 'Use --device=dri for GPU; document any other need'],
                ['--talk-name=*', 'Wildcard bus access is not acceptable'],
              ].map(([perm, note]) => (
                <tr key={perm} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-2 font-mono text-zinc-300 text-xs">{perm}</td>
                  <td className="px-4 py-2">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">AI tools disclosure</h2>
        <p className="text-zinc-400 leading-relaxed">
          Flatforge does not restrict which tools you use to write your application.
          If you used AI tools, mention them in the <code className="text-zinc-300 text-sm">ai_tools_used</code> field
          of <code className="text-zinc-300 text-sm">metadata.yaml</code>. Appreciated for transparency, not required.
          Apps with this field filled receive an "AI" badge on their listing page.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Enforcement</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Violations discovered post-merge result in: issue opened requesting a fix within 14 days →
          application marked "under review" → removal if no response.
        </p>
        <p className="text-zinc-400 text-sm">
          See also:{' '}
          <Link to="/terms" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Terms of Use</Link>
          {' · '}
          <Link to="/copyright" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Copyright Complaints</Link>
        </p>
      </section>
    </div>
  )
}
