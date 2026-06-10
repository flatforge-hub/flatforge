import { Link } from 'react-router-dom'

function Required({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-green-600 dark:text-green-500 mt-0.5">✓</span><span>{children}</span></li>
}

function Rejected({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-red-600 dark:text-red-500 mt-0.5">✗</span><span>{children}</span></li>
}

function Encouraged({ children }: { children: React.ReactNode }) {
  return <li className="flex gap-2"><span className="text-indigo-600 dark:text-indigo-400 mt-0.5">→</span><span>{children}</span></li>
}

export default function Policy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Policy</h1>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
        Flatforge is a Flatpak repository for the Linux desktop. We accept open-source
        applications regardless of which tools were used to build them.
        Quality is required. Slop is not.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Acceptance criteria</h2>
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-3">Required</h3>
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400 mb-6">
          <Required><strong className="text-zinc-700 dark:text-zinc-300">Open-source licence</strong> — OSI-approved, CC0, or Unlicense (SPDX identifier required)</Required>
          <Required><strong className="text-zinc-700 dark:text-zinc-300">Source code URL</strong> — <code className="text-zinc-700 dark:text-zinc-300 text-sm">source</code> field in <code className="text-zinc-700 dark:text-zinc-300 text-sm">metadata.yaml</code> pointing to the public repository or archive</Required>
          <Required><strong className="text-zinc-700 dark:text-zinc-300">AppStream metadata</strong> — valid <code className="text-zinc-700 dark:text-zinc-300 text-sm">metainfo.xml</code> with description, icon, and at least one screenshot</Required>
          <Required><strong className="text-zinc-700 dark:text-zinc-300">Correct App ID</strong> — reverse-DNS format matching a domain the developer controls (e.g. <code className="text-zinc-700 dark:text-zinc-300 text-sm">io.github.username.AppName</code>); see App ID verification below</Required>
          <Required><strong className="text-zinc-700 dark:text-zinc-300">Working Flatpak</strong> — builds from the submitted manifest without patches by maintainers</Required>
          <Required><strong className="text-zinc-700 dark:text-zinc-300">Reasonable sandbox</strong> — <code className="text-zinc-700 dark:text-zinc-300 text-sm">finish-args</code> must be justified; gratuitous permissions are rejected</Required>
        </ul>
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-3">Encouraged</h3>
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
          <Encouraged>Wayland support (<code className="text-zinc-700 dark:text-zinc-300 text-sm">--socket=wayland</code>)</Encouraged>
          <Encouraged>Portal-based file access instead of broad <code className="text-zinc-700 dark:text-zinc-300 text-sm">--filesystem=</code> flags</Encouraged>
          <Encouraged>Dark mode support</Encouraged>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Quality</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Applications must be functional and complete — not a demo, skeleton, experiment,
          or proof of concept. An application must serve a genuine user need and be usable
          without guidance from the developer. If it has a UI, the UI must work.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          There is no minimum line count or feature set. The bar is: would a reasonable
          person use this? Applications that exist only to occupy a namespace, test the
          pipeline, or pad a portfolio will be declined.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">App ID verification</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
          The App ID encodes ownership. Before a submission is accepted, maintainers verify
          that the submitter controls the namespace the App ID claims.
        </p>
        <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">GitHub or GitLab namespace</h3>
            <p>
              For <code className="text-zinc-700 dark:text-zinc-300 text-sm">io.github.USERNAME.AppName</code> or{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">io.gitlab.USERNAME.AppName</code>, the main
              source module's URL must be hosted under{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">github.com/USERNAME/</code> or{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">gitlab.com/USERNAME/</code> respectively.
              CI checks this automatically — a mismatch blocks the PR. The PR author must have
              push access to that source repository.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Custom domain</h3>
            <p>
              For <code className="text-zinc-700 dark:text-zinc-300 text-sm">com.example.AppName</code> or any other
              domain-based ID: add a DNS TXT record at{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">_flatforge.example.com</code> with the value{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">github=USERNAME</code>, or serve a plain-text
              file at <code className="text-zinc-700 dark:text-zinc-300 text-sm">https://example.com/.well-known/flatforge-verify</code>{' '}
              containing the single line <code className="text-zinc-700 dark:text-zinc-300 text-sm">github=USERNAME</code>.
              A maintainer verifies this before merging — state the verification method in your PR.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Other namespaces</h3>
            <p>
              App IDs outside the above patterns (e.g. <code className="text-zinc-700 dark:text-zinc-300 text-sm">org.gnome.*</code>,{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">org.kde.*</code>,{' '}
              <code className="text-zinc-700 dark:text-zinc-300 text-sm">org.freedesktop.*</code>) require explicit
              written approval from a Flatforge maintainer before submission.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Namespace squatting</h3>
            <p>
              Claiming an App ID for software you did not write, or reserving an ID for software
              that does not yet exist, is not permitted regardless of intent.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">What we reject</h2>
        <ul className="space-y-2 text-zinc-600 dark:text-zinc-400">
          <Rejected>Proprietary applications</Rejected>
          <Rejected>Malware, spyware, adware, or any deceptive application</Rejected>
          <Rejected>Applications that crash on launch or are non-functional</Rejected>
          <Rejected>Duplicate applications with no differentiation from existing entries</Rejected>
          <Rejected>Misleading App IDs that impersonate other projects</Rejected>
          <Rejected>Applications with no genuine utility ("slop") — regardless of how they were built</Rejected>
          <Rejected>Custom or unreviewed licences — use MIT, Apache-2.0, GPL, CC0, or another established licence</Rejected>
          <Rejected>Applications whose primary purpose is to display pornographic or sexually explicit content</Rejected>
          <Rejected>Real-money gambling applications</Rejected>
          <Rejected>Content that is illegal under EU or Czech law</Rejected>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Data collection disclosure</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          If an application requests <code className="text-zinc-700 dark:text-zinc-300 text-sm">--share=network</code>{' '}
          and transmits user data — telemetry, crash reports, analytics, account sync, ads, etc. —
          this must be disclosed in the <code className="text-zinc-700 dark:text-zinc-300 text-sm">data_collection</code>{' '}
          field of <code className="text-zinc-700 dark:text-zinc-300 text-sm">metadata.yaml</code> and briefly in the
          AppStream description.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          This is about transparency, not prohibition. Flatforge does not ban telemetry, but
          users must be able to find out about it before installing. Undisclosed data collection
          discovered after acceptance is treated as a policy violation.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Editorial discretion</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Maintainers may decline any submission at their discretion, including for reasons not
          listed in this policy, and are not required to provide a detailed explanation.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          This safeguard is necessary. Open repositories are a natural target for submission
          floods — including mass-submitted AI-generated applications of marginal quality.
          Maintainers may act quickly to protect the review queue and the repository's integrity
          without entering extended discussions for every rejected submission.
        </p>
        <div className="mt-5 space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Submission limits</h3>
            <ul className="space-y-2">
              <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span>Each GitHub account may have at most <strong className="text-zinc-700 dark:text-zinc-300">2 open submission PRs</strong> at a time. A third PR will be closed automatically without review.</span></li>
              <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span>After a rejection, the same account must wait <strong className="text-zinc-700 dark:text-zinc-300">30 days</strong> before opening a new submission PR.</span></li>
              <li className="flex gap-2"><span className="text-forge-600 dark:text-forge-400">•</span><span>Accounts found coordinating submissions across multiple GitHub accounts may have all associated submissions closed.</span></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Review timeline</h3>
            <p>
              Review is done on a volunteer basis. There is no guaranteed or promised timeline.
              A submission may sit in queue for weeks or months and may require several rounds
              of back-and-forth. <strong className="text-zinc-700 dark:text-zinc-300">Expedited review cannot be demanded.</strong>{' '}
              A PR that receives no activity from the submitter's side for 90 days will be closed as stale.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Submission freeze</h3>
            <p>
              Maintainers may suspend the acceptance of new submissions at any time and for any
              duration, without notice or explanation. During a freeze, new submission PRs will
              be declined. An active freeze will be noted in the repository README.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Trademarks and impersonation</h2>
        <div className="space-y-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <p><strong className="text-zinc-700 dark:text-zinc-300">Names</strong> — must not use a trademarked name in a way that implies official affiliation unless the submitter is the upstream developer or has written authorisation. An app named "Firefox" or "Visual Studio Code" submitted by a third party will be rejected.</p>
          <p><strong className="text-zinc-700 dark:text-zinc-300">Unofficial wrappers</strong> — apps that wrap or extend another project must clearly identify themselves as unofficial. The name or summary must include "Unofficial", "Third-party", or "Community".</p>
          <p><strong className="text-zinc-700 dark:text-zinc-300">Icons</strong> — must be original or licensed. Reproducing a trademarked icon without authorisation is not acceptable, even in modified form.</p>
          <p><strong className="text-zinc-700 dark:text-zinc-300">Descriptions</strong> — marketing language that implies endorsement from another project or organisation will be rejected.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-4">Sandbox policy</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">Every submission is reviewed for <code className="text-zinc-700 dark:text-zinc-300 text-sm">finish-args</code>. The following require written justification in your PR:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                <th className="text-left px-4 py-2">Permission</th>
                <th className="text-left px-4 py-2">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {[
                ['--filesystem=home', 'Almost always replaceable with XDG portals'],
                ['--filesystem=host', 'Almost never acceptable'],
                ['--share=network', 'Must be core to the application\'s function'],
                ['--socket=session-bus', 'Describe which D-Bus interfaces and why'],
                ['--device=all', 'Use --device=dri for GPU; document any other need'],
                ['--talk-name=*', 'Wildcard bus access is not acceptable'],
              ].map(([perm, note]) => (
                <tr key={perm} className="hover:bg-zinc-100 dark:hover:bg-zinc-900/50">
                  <td className="px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300 text-xs">{perm}</td>
                  <td className="px-4 py-2">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Forks</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A fork is acceptable when it constitutes a distinct project with genuine code
          divergence from upstream and uses an App ID in the submitter's own namespace
          (not the upstream ID). Document what makes the fork distinct in the PR description.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          Repackaging upstream software under a different App ID without meaningful code
          changes is not a fork — it is a duplicate and will be rejected.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Abandoned applications</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          An application is considered abandoned when its per-app repository has had no commits
          for <strong className="text-zinc-700 dark:text-zinc-300">12 months</strong> and the maintainer has not
          responded to a maintenance-check issue within <strong className="text-zinc-700 dark:text-zinc-300">30 days</strong>{' '}
          of it being opened. A scheduled workflow runs monthly, detects stale repositories, and
          opens these issues automatically.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          An abandoned application is marked <code className="text-zinc-700 dark:text-zinc-300 text-sm">status: unmaintained</code>{' '}
          in its <code className="text-zinc-700 dark:text-zinc-300 text-sm">metadata.yaml</code> and shown with an
          "Unmaintained" badge on the website. If no response or remediation follows within a
          further <strong className="text-zinc-700 dark:text-zinc-300">60 days</strong>, the application may be removed.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          Maintainers may self-declare an application as unmaintained at any time by setting{' '}
          <code className="text-zinc-700 dark:text-zinc-300 text-sm">status: unmaintained</code> via a PR. This is
          encouraged — it is more honest than silence.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Transferring an application</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          If you can no longer maintain an application, open an issue in the per-app repository
          with the label <code className="text-zinc-700 dark:text-zinc-300 text-sm">transfer-request</code>, including
          the GitHub username of the proposed new maintainer (who must have already agreed). A
          Flatforge core maintainer will update repository access accordingly.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mt-3">
          If no successor is available, set <code className="text-zinc-700 dark:text-zinc-300 text-sm">status: unmaintained</code>{' '}
          in <code className="text-zinc-700 dark:text-zinc-300 text-sm">metadata.yaml</code> or open an issue asking
          a maintainer to do so.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">AI tools disclosure</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Flatforge does not restrict which tools you use to write your application.
          If you used AI tools, mention them in the <code className="text-zinc-700 dark:text-zinc-300 text-sm">ai_tools_used</code> field
          of <code className="text-zinc-700 dark:text-zinc-300 text-sm">metadata.yaml</code>. Appreciated for transparency, not required.
          Apps with this field filled receive an "AI" badge on their listing page.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Enforcement</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">
          Violations discovered post-merge result in: issue opened requesting a fix within 14 days →
          application marked "under review" → removal if no response.
        </p>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm">
          See also:{' '}
          <Link to="/terms" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-2">Terms of Use</Link>
          {' · '}
          <Link to="/copyright" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-2">Copyright Complaints</Link>
          {' · '}
          <a href="https://github.com/flatforge-hub/flatforge/blob/main/docs/CODE_OF_CONDUCT.md"
             target="_blank" rel="noopener noreferrer"
             className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-2">Code of Conduct</a>
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">Questions and pre-submission approval</h2>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
          For anything not covered by this policy — including namespace-approval requests for
          other namespaces — open a GitHub issue with the <code className="text-zinc-700 dark:text-zinc-300 text-sm">question</code>{' '}
          label in{' '}
          <a href="https://github.com/flatforge-hub/flatforge" target="_blank" rel="noopener noreferrer"
             className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 underline underline-offset-2">
            flatforge-hub/flatforge
          </a>{' '}
          before submitting a PR.
        </p>
      </section>
    </div>
  )
}
