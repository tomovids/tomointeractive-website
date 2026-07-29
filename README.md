# Tomo Interactive — tomointeractive.com

Static marketing site for Tomo Interactive LTD. No build step, no dependencies —
plain HTML, CSS and JavaScript. Any static host will serve it as-is.

```
index.html      Homepage (all sections)
404.html        Not-found page
styles.css      All styling, incl. light/dark themes
main.js         Theme toggle, mobile nav, contact form
robots.txt      Search engine directives
sitemap.xml     Sitemap
assets/         favicon.svg, og-image.png, apple-touch-icon.png
```

## Cache busting — important

`styles.css` and `main.js` are linked with a `?v=N` query string. GitHub Pages
serves everything with `Cache-Control: max-age=600` and that can't be configured,
so a returning visitor can end up with a stale stylesheet applied to fresh HTML —
which looks completely broken.

**Whenever you change `styles.css` or `main.js`, bump `?v=` in both
`index.html` and `404.html`.** It's the only manual step in the project.

## Run it locally

Open `index.html` directly, or serve it (recommended, so absolute paths work):

```bash
npx serve .
```

## Things to fill in

These are placeholders — search for `TODO` in `index.html`.

1. **Social preview** — `assets/og-image.png` is generated and ready, but
   regenerate it if the tagline changes.

The statutory trading disclosure (registered name, company number 17045564, and
registered office) is in the footer. If the registered office ever changes, update
it in both the footer and the JSON-LD block in `<head>`.

## Contact form

The form currently opens the visitor's email client with the message pre-filled.
That works everywhere but is not ideal — some visitors have no mail client configured.

To have submissions posted straight to your inbox, sign up for a form service
(Formspree, Web3Forms and Cloudflare Pages Functions all have free tiers), then set
the endpoint at the top of the contact-form section in `main.js`:

```js
var ENDPOINT = 'https://formspree.io/f/xxxxxxxx';
```

The form already posts JSON, shows a sending state, and handles success and failure —
no other changes needed.

## Deploying

The site is static, so deployment is "upload these files". Whichever host you use,
point `tomointeractive.com` at it and enable HTTPS (every option below does this
automatically with a free certificate).

Redeploy by pushing to the connected git branch, or by re-uploading the folder.
