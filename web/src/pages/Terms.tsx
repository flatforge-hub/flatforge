import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Terms of Use</h1>
      <p className="text-zinc-500 text-sm mb-10">Last updated: June 2026</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">The service</h2>
        <p className="text-zinc-400 leading-relaxed">
          Flatforge is an open-source, community-operated Flatpak repository. It provides a
          catalogue of third-party Linux applications packaged in the Flatpak format. Flatforge
          is not affiliated with the upstream developers of distributed applications unless
          explicitly stated.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">No warranty</h2>
        <p className="text-zinc-400 leading-relaxed">
          The repository and all software distributed through it are provided{' '}
          <strong className="text-zinc-300">"as is"</strong>, without warranty of any kind —
          express, implied, or statutory — including but not limited to warranties of
          merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p className="text-zinc-400 leading-relaxed mt-3">
          Flatforge reviews application submissions for licence compliance, sandbox
          configuration, and source availability, but <strong className="text-zinc-300">cannot
          guarantee</strong> that any distributed application is free of defects,
          vulnerabilities, malware, or legal issues that were not apparent at the time of review.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Limitation of liability</h2>
        <p className="text-zinc-400 leading-relaxed">
          To the maximum extent permitted by applicable law, Flatforge and its contributors
          shall not be liable for any direct, indirect, incidental, special, or consequential
          damages arising from installation or use of any application distributed through this
          repository, errors or omissions in application metadata, or interruptions in
          repository availability.
        </p>
        <p className="text-zinc-400 leading-relaxed mt-3">
          This limitation does not apply where prohibited by mandatory provisions of applicable
          law, including EU consumer protection law and Czech law on liability for intentional
          or grossly negligent conduct.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Your responsibility</h2>
        <p className="text-zinc-400 leading-relaxed">
          You are responsible for evaluating the suitability and safety of any application
          before installing it. Review the application's source code, licence, and sandbox
          permissions if you have concerns.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Reporting issues</h2>
        <ul className="space-y-2 text-zinc-400">
          <li>
            Security vulnerabilities —{' '}
            <a href="https://github.com/flatforge-hub/flatforge/blob/main/docs/SECURITY.md"
               target="_blank" rel="noopener noreferrer"
               className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
              SECURITY.md
            </a>
          </li>
          <li>
            Copyright infringement —{' '}
            <Link to="/copyright"
               className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
              Copyright Complaints
            </Link>
          </li>
          <li>
            Policy violations —{' '}
            <a href="https://github.com/flatforge-hub/flatforge/issues"
               target="_blank" rel="noopener noreferrer"
               className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
              GitHub Issues
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Governing law</h2>
        <p className="text-zinc-400 leading-relaxed">
          These terms are governed by the laws of the Czech Republic and, where applicable,
          European Union law. See also the{' '}
          <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            Privacy Notice
          </Link>.
        </p>
      </section>
    </div>
  )
}
