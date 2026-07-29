# Launching tomointeractive.com

## Where the domain stands today (checked 29 Jul 2026)

| Thing | Current value |
|---|---|
| Nameservers | `nse1–nse4.squarespacedns.com` — **DNS is managed by Squarespace** |
| A records | `198.185.159.144/.145`, `198.49.23.144/.145` — Squarespace's servers |
| `www` | CNAME → `ext-sq.squarespace.com` |
| What's live | A Squarespace **"Coming Soon"** holding page |
| MX (email) | `aspmx.l.google.com` + alts — **Google Workspace** |

So the domain already resolves and is wired to Squarespace; it's just showing a
placeholder. Launching = repointing it at the new site.

> ### ⚠️ Do not touch the MX records
> `contact@tomointeractive.com` is delivered by Google Workspace via those MX
> records. Changing the A/CNAME records (below) does **not** affect email.
> Moving nameservers away from Squarespace **does** — you'd have to recreate the
> MX records at the new provider or mail stops arriving. That's the main reason
> Option 1 below is the recommended route.

---

## Option 1 — GitHub Pages, keep DNS at Squarespace (recommended)

Lowest risk: nothing about your email or nameservers changes. You only edit two
record types in the Squarespace DNS panel.

### Step 1 — Publish the repo (I can do this for you)

```bash
gh repo create tomointeractive-website --public --source . --remote origin --push
```

The repo must be **public** for Pages to work on a free GitHub account
(Pages on a private repo requires GitHub Pro).

### Step 2 — Turn on Pages

```bash
gh api -X POST repos/tomovids/tomointeractive-website/pages -f build_type=workflow
```

`.github/workflows/deploy.yml` then builds and deploys on every push to `main`.
The `CNAME` file in the repo root tells Pages the custom domain is
`tomointeractive.com`.

### Step 3 — Change DNS at Squarespace

In Squarespace: **Settings → Domains → tomointeractive.com → DNS Settings**.

**Delete** the four existing A records pointing to `198.185.159.x` / `198.49.23.x`,
then add these four:

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

**Edit** the `www` CNAME — change its value from `ext-sq.squarespace.com` to:

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `tomovids.github.io` |

Leave every MX record and any TXT records (SPF/DKIM/domain verification) exactly
as they are.

> Squarespace may not let you remove its own A records while the domain is
> attached to an active Squarespace site. If it blocks you, detach the site from
> the domain first, or move the domain to another registrar/DNS host.

### Step 4 — Enable HTTPS

Back in GitHub → repo **Settings → Pages**, wait for the custom-domain check to go
green (DNS propagation is usually minutes, up to 48h worst case), then tick
**Enforce HTTPS**. GitHub issues the certificate free.

---

## Option 2 — Cloudflare Pages

Faster CDN and better analytics, but it means moving nameservers to Cloudflare.
If you do this, **Cloudflare's import will scan your existing DNS — verify the
Google MX records came across before you flip the nameservers**, or email breaks.

1. Push the repo to GitHub (Step 1 above — can be private here).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Framework preset: **None**. Build command: blank. Output directory: `/`.
4. **Custom domains → Set up a domain** → `tomointeractive.com`.
5. Add the domain as a Cloudflare zone, confirm all records (especially MX)
   imported, then change nameservers at your registrar.

---

## Option 3 — Netlify (easiest, no CLI)

`netlify.toml` is already in the repo with security headers and caching set up.

1. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag the
   `tomointeractive-website` folder onto the page. It's live instantly on a
   `*.netlify.app` URL.
2. **Domain settings → Add custom domain** → `tomointeractive.com`.
3. Netlify shows you the DNS records to add. Enter those at Squarespace, same as
   Step 3 above — again, leave MX alone.

Netlify also has built-in form handling: add `netlify` and
`name="contact"` attributes to the `<form>` in `index.html` and submissions land
in your Netlify dashboard, replacing the mailto fallback.

---

## After it's live — check these

- [ ] `https://tomointeractive.com` loads, and `www.` redirects to it
- [ ] HTTPS padlock, no mixed-content warnings
- [ ] Send a test email to `contact@tomointeractive.com` and confirm it arrives
- [ ] Submit the contact form
- [ ] Paste the URL into a Slack/Discord message to check the social preview card
- [ ] Add the Companies House number + registered address to the footer (legally
      required for a UK limited company)
