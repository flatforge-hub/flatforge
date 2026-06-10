# Copyright Complaints

## Scope

This document covers copyright infringement claims against applications
distributed in the Flatforge Flatpak repository.

**App submissions (pull requests)** are hosted on GitHub and fall under
[GitHub's DMCA takedown process](https://docs.github.com/en/site-policy/content-removal-policies/dmca-takedown-policy).
Submit those complaints directly to GitHub.

## Reporting infringement in a distributed app

If you believe an application currently distributed by Flatforge infringes
your copyright, send a written notice to **evtcsuha5@mozmail.com** with:

1. Your name and contact details.
2. Identification of the copyrighted work you claim is being infringed.
3. The application ID (e.g. `org.example.MyApp`) and, if known, the specific
   file or module within it.
4. A statement that you have a good-faith belief that the use is not
   authorised by the copyright owner, its agent, or applicable law.
5. A statement that the information in your notice is accurate, and that
   you are the copyright owner or authorised to act on their behalf.

## Our response

Flatforge is run by volunteers and these timeframes are not guaranteed deadlines —
they describe what we aim for under normal circumstances. On receipt of a complete
notice we will, without undue delay:

1. Acknowledge — typically within **7 days**.
2. Investigate and, where the claim is substantiated, remove the application
   from the repository — typically within **14 days** of acknowledgement.
3. Notify the app maintainer and give them an opportunity to respond or
   provide a counter-notice.

We may restore an application if the maintainer provides a valid counter-notice
or resolves the infringement (e.g. replaces infringing code and releases a
corrected version).

## Repeat infringers

Maintainers who repeatedly submit infringing applications will have their
access revoked.

## Unauthorized submissions

If someone submitted your application to Flatforge without your knowledge or consent,
you can request removal or a hold pending discussion. This process is separate from
copyright infringement — it covers cases where the packaging itself was not authorised
by the original developer, regardless of whether the source licence technically permits it.

### Proving authorship

Provide one of the following to establish that you control the source repository:

- Push a file named `flatforge-claim.txt` to the root of the source repository containing
  your GitHub username and the App ID (e.g. `github=yourusername app=io.github.yourname.AppName`).
  You may remove the file once the claim is resolved.
- Open a GitHub issue in the source repository from your own account stating that you did
  not authorise the Flatforge submission.

### Submitting a claim

Send an email to **evtcsuha5@mozmail.com** with:

1. Your name and GitHub username.
2. The App ID (e.g. `io.github.username.AppName`).
3. Evidence of authorship (link to the `flatforge-claim.txt` file, or the GitHub issue you opened).
4. A statement that you did not authorise the submission.

### Our response

As above, these timeframes are best-effort targets, not guaranteed deadlines. On
receipt of a complete claim we will, without undue delay:

1. Put the application on hold — typically within **7 days** — it will not be
   distributed while the claim is open.
2. Contact the submitter and give them around **14 days** to provide counter-evidence
   or written authorisation from you.
3. Remove the application if no counter-evidence is provided or if your authorship is confirmed.

If both parties agree, the submission may instead be transferred to you or relabelled as
an unofficial community package — at your discretion.

## Note on jurisdiction

Flatforge is operated from the European Union. While this process is modelled
on DMCA safe-harbour practice, it is not a formal DMCA designated-agent
registration. EU copyright law (including Directive 2001/29/EC) applies where
relevant.
