# Team Leave Register

Leave plan, actual leave, balances and overlap checks for the ACH and CCC teams (Clearing Gateway & Transaction Processing).

## What it does

- Annual leave plan per staff member (27 days), with bulk entry
- Record actual leave against the plan: taken as planned, different dates, or not taken
- Plan vs actual report, with variance per person
- Compassionate (5 days) and maternity (6 months) allowances
- Same-team overlap, relief officer and thin-cover checks
- Staff profiles and full leave details (reference no., approver, contact while away, resumption, handover)
- CSV export for reporting

## Where the data is kept

This version saves everything in the browser of the computer it is used on. Nothing is sent to a server.

- Use **Settings → Download backup** regularly.
- Use **Settings → Restore from backup** to move the register to another computer or browser.
- Clearing browser data deletes the register, so keep backups.

## Publishing on GitHub Pages

1. Create a new repository, for example `leave-register`.
2. Upload `index.html`, `store.js` and this `README.md` to the root of the repository.
3. Go to **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/leave-register/`.

If the repository is public, the code is visible to anyone, but leave data is not: it never leaves your browser.
