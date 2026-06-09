export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-zinc-100 mb-2">Privacy Notice</h1>
      <p className="text-zinc-500 text-sm mb-10">Last updated: June 2026</p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">What we collect</h2>
        <p className="text-zinc-400 leading-relaxed">
          The Flatforge web server records access logs containing a <strong className="text-zinc-300">truncated
          IP address</strong> (the last octet of IPv4 addresses is zeroed; IPv6 addresses are
          shortened to their first three groups), the requested URL, timestamp, HTTP status code,
          and browser User-Agent string. Full IP addresses are never written to disk.
        </p>
        <p className="text-zinc-400 leading-relaxed mt-3">
          We do not use cookies, tracking pixels, analytics scripts, or any form of cross-site
          tracking. No user accounts exist on this site.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Why we collect it</h2>
        <p className="text-zinc-400 leading-relaxed">
          Access logs are used solely for server operations: diagnosing errors, detecting abuse,
          and monitoring availability. The legal basis is <strong className="text-zinc-300">legitimate
          interest</strong> (Article 6(1)(f) GDPR).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Cloudflare</h2>
        <p className="text-zinc-400 leading-relaxed">
          Flatforge uses <strong className="text-zinc-300">Cloudflare</strong> as a CDN and reverse
          proxy. Cloudflare processes network traffic — including real IP addresses — before
          requests reach our server, acting as a data processor on our behalf. Their data practices
          are governed by the{' '}
          <a href="https://www.cloudflare.com/privacypolicy/"
             target="_blank" rel="noopener noreferrer"
             className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            Cloudflare Privacy Policy
          </a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">GitHub</h2>
        <p className="text-zinc-400 leading-relaxed">
          App submissions and issue reports are handled through GitHub. Any data you provide
          there is subject to the{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
             target="_blank" rel="noopener noreferrer"
             className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            GitHub Privacy Statement
          </a>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Log retention</h2>
        <p className="text-zinc-400 leading-relaxed">
          Access logs are rotated and deleted after <strong className="text-zinc-300">90 days</strong>.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-zinc-200 mb-3">Contact</h2>
        <p className="text-zinc-400 leading-relaxed">
          For privacy-related questions or requests, contact:{' '}
          <a href="mailto:evtcsuha5@mozmail.com"
             className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            evtcsuha5@mozmail.com
          </a>
        </p>
      </section>
    </div>
  )
}
