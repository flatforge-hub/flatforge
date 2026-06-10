export default function Copyright() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Copyright Complaints</h1>

      <section className="mb-10 mt-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Scope</h2>
        <p className="text-zinc-400 leading-relaxed">
          This page covers copyright infringement claims against applications distributed
          in the Flatforge Flatpak repository.
        </p>
        <p className="text-zinc-400 leading-relaxed mt-3">
          <strong className="text-zinc-300">App submissions (pull requests)</strong> are hosted
          on GitHub and fall under{' '}
          <a href="https://docs.github.com/en/site-policy/content-removal-policies/dmca-takedown-policy"
             target="_blank" rel="noopener noreferrer"
             className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            GitHub's DMCA takedown process
          </a>. Submit those complaints directly to GitHub.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Reporting infringement in a distributed app</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          If you believe an application currently distributed by Flatforge infringes your copyright,
          send a written notice to{' '}
          <a href="mailto:evtcsuha5@mozmail.com"
             className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            evtcsuha5@mozmail.com
          </a>{' '}
          with:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li>Your name and contact details.</li>
          <li>Identification of the copyrighted work you claim is being infringed.</li>
          <li>The application ID (e.g. <code className="text-zinc-300 text-sm">org.example.MyApp</code>) and, if known, the specific file or module.</li>
          <li>A statement that you have a good-faith belief that the use is not authorised by the copyright owner, its agent, or applicable law.</li>
          <li>A statement that the information is accurate and that you are the copyright owner or authorised to act on their behalf.</li>
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Our response</h2>
        <p className="text-zinc-400 leading-relaxed mb-3">
          Flatforge is run by volunteers and these timeframes are not guaranteed deadlines —
          they describe what we aim for under normal circumstances. On receipt of a complete
          notice we will, without undue delay:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li>Acknowledge — typically within <strong className="text-zinc-300">7 days</strong>.</li>
          <li>Investigate and, where substantiated, remove the application — typically within <strong className="text-zinc-300">14 days</strong> of acknowledgement.</li>
          <li>Notify the app maintainer and give them an opportunity to respond or provide a counter-notice.</li>
        </ol>
        <p className="text-zinc-400 leading-relaxed mt-3">
          We may restore an application if the maintainer provides a valid counter-notice or
          resolves the infringement.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Repeat infringers</h2>
        <p className="text-zinc-400 leading-relaxed">
          Maintainers who repeatedly submit infringing applications will have their access revoked.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Unauthorized submissions</h2>
        <p className="text-zinc-400 leading-relaxed mb-4">
          If someone submitted your application to Flatforge without your knowledge or consent,
          you can request removal or a hold pending discussion. This is separate from copyright
          infringement — it covers cases where the packaging itself was not authorised by the
          original developer, regardless of whether the source licence technically permits it.
        </p>

        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Proving authorship</h3>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Provide one of the following to establish that you control the source repository:
        </p>
        <ul className="space-y-2 text-zinc-400 mb-4">
          <li className="flex gap-2"><span className="text-forge-400">•</span><span>Push a file named <code className="text-zinc-300 text-sm">flatforge-claim.txt</code> to the root of the source repository containing your GitHub username and the App ID (e.g. <code className="text-zinc-300 text-sm">github=yourusername app=io.github.yourname.AppName</code>). You may remove the file once the claim is resolved.</span></li>
          <li className="flex gap-2"><span className="text-forge-400">•</span><span>Open a GitHub issue in the source repository from your own account stating that you did not authorise the Flatforge submission.</span></li>
        </ul>

        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Submitting a claim</h3>
        <p className="text-zinc-400 leading-relaxed mb-2">
          Send an email to{' '}
          <a href="mailto:evtcsuha5@mozmail.com"
             className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            evtcsuha5@mozmail.com
          </a>{' '}
          with:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400 mb-4">
          <li>Your name and GitHub username.</li>
          <li>The App ID (e.g. <code className="text-zinc-300 text-sm">io.github.username.AppName</code>).</li>
          <li>Evidence of authorship (link to the <code className="text-zinc-300 text-sm">flatforge-claim.txt</code> file, or the GitHub issue you opened).</li>
          <li>A statement that you did not authorise the submission.</li>
        </ol>

        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Our response</h3>
        <p className="text-zinc-400 leading-relaxed mb-2">
          As above, these timeframes are best-effort targets, not guaranteed deadlines. On
          receipt of a complete claim we will, without undue delay:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-zinc-400">
          <li>Put the application on hold — typically within <strong className="text-zinc-300">7 days</strong> — it will not be distributed while the claim is open.</li>
          <li>Contact the submitter and give them around <strong className="text-zinc-300">14 days</strong> to provide counter-evidence or written authorisation from you.</li>
          <li>Remove the application if no counter-evidence is provided or if your authorship is confirmed.</li>
        </ol>
        <p className="text-zinc-400 leading-relaxed mt-3">
          If both parties agree, the submission may instead be transferred to you or relabelled
          as an unofficial community package — at your discretion.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Jurisdiction</h2>
        <p className="text-zinc-400 leading-relaxed">
          Flatforge is operated from the European Union. This process is modelled on DMCA
          safe-harbour practice but is not a formal DMCA designated-agent registration.
          EU copyright law (including Directive 2001/29/EC) applies where relevant.
        </p>
      </section>
    </div>
  )
}
