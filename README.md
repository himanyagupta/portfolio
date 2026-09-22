# Himanya — Portfolio

A dark, warm, editorial single-page portfolio. Plain HTML, CSS and JavaScript, with no build step.
Icons come from Font Awesome and animation from Anime.js, both loaded from a CDN.

## Folder structure

```
himanya-portfolio/
├── index.html          Page structure, hero text and About text (look for "EDIT:")
├── package.json        Only used for the optional local server command
├── css/
│   └── style.css       All styling. Colours are the variables at the top (:root)
├── js/
│   ├── data.js         ★ Socials, projects, skills, education, experience, form settings
│   ├── render.js       Builds those sections from data.js
│   ├── carousel.js     Swipe / drag / arrow-button carousel (Skills and Projects)
│   ├── animations.js   Loader, hero, reveals, parallax, scroll-linked effects
│   └── main.js         Navigation, mobile menu, contact form, boot sequence
└── assets/
    ├── himanya.jpg     ← your photo (you add this)
    ├── agrishare.png   ← screenshot (you add this)
    ├── atm.png         ← screenshot (you add this)
    ├── whimsy.png      ← screenshot (you add this)
    ├── og-image.png    ← optional social preview image
    └── favicon.svg
```

## Run it locally

You need Node.js installed (any recent version).

```bash
cd himanya-portfolio
npm start
```

Open http://localhost:3000. (This runs `npx serve . -l 3000`.)
No Node? Use Python instead: `python3 -m http.server 3000`, then open http://localhost:3000.

Double-clicking `index.html` also works for a quick look.

## Where to add your things

| What | Where |
|---|---|
| Your photo | Save it as `assets/himanya.jpg` (portrait, about 800×1000). To use another name, edit the `<img id="profilePhoto">` in `index.html` |
| Project screenshots | `assets/agrishare.png`, `assets/atm.png`, `assets/whimsy.png` (16:10, about 1200×750). Paths are in `js/data.js` |
| Project GitHub URLs | `js/data.js` → `projects` → `githubUrl`. Replace `YOUR_AGRISHARE_GITHUB_URL_HERE`, `YOUR_ATM_GITHUB_URL_HERE`, `YOUR_WHIMSY_GITHUB_URL_HERE` |
| Whimsy tech stack | `js/data.js` → Whimsy → `tech` (currently `YOUR_TECH_STACK_HERE`) |
| Instagram | `js/data.js` → `socials` → Instagram → `url` |
| Email | `js/data.js` → `socials` → Email → `email` (and `contactForm.toEmail`) |
| Contact form delivery | `js/data.js` → `contactForm.endpoint` (Formspree or similar) |
| Hero and About wording | `index.html`, in the blocks marked `EDIT:` |
| Site URL for link previews | `index.html` → `og:url` and `og:image` |

Links that still contain a `YOUR_..._HERE` placeholder don't navigate. They show a small
"This link is not set yet" message so nobody lands on a broken page.

### Contact form

- With `endpoint` empty (default): the form validates, then shows "Thanks — your message is ready to be sent."
  with a button that opens the message in the visitor's email app. Nothing is sent behind the scenes.
- With `endpoint` set to a Formspree URL such as `https://formspree.io/f/xxxxxxx`: the form posts the message
  as JSON and shows a success or error state.

## Deploy to Vercel

**Option A: through GitHub (recommended)**
1. Push this folder to a GitHub repository.
2. Go to vercel.com → Add New → Project → import the repository.
3. Framework Preset: **Other**. Leave Build Command and Output Directory empty. Click Deploy.
4. Every later push to GitHub redeploys automatically.

**Option B: Vercel CLI**
```bash
npm i -g vercel
cd himanya-portfolio
vercel        # first deploy (preview)
vercel --prod # production deploy
```

After deploying, put your real URL into `og:url` and `og:image` in `index.html`.

## Motion notes

- Loader shows once per browser session, finishes in about 1.5s, and has a CSS failsafe that hides it after 5s.
- Carousels use native scroll-snap, so touch swiping feels native. Mouse users can drag or use the arrows or keyboard arrow keys.
- All scroll-linked effects run in one `requestAnimationFrame` loop.
- `prefers-reduced-motion` turns off the loader animation, reveals, parallax, drifting band, floating elements and smooth scrolling. Content is simply visible.
- If the Anime.js CDN fails to load, the site falls back to CSS transitions and stays fully usable.

## Checklist before publishing

- [ ] Add `assets/himanya.jpg`
- [ ] Add the three project screenshots
- [ ] Replace the three GitHub placeholders in `js/data.js`
- [ ] Check the ATM Banking System and Whimsy World descriptions in `js/data.js` are accurate. Fill in Whimsy's tech stack
- [ ] Confirm Instagram and email are the ones you want public
- [ ] Decide on the contact form: keep the email-app fallback or add a Formspree endpoint
- [ ] Set `og:url` and `og:image` after the first deploy
- [ ] Read every paragraph once and change anything that doesn't sound like you
