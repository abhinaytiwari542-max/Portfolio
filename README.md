# Abhinay Tiwari, AI Product Manager Portfolio

Personal portfolio site. Static HTML, CSS and vanilla JS. No framework, no build step, no page builder.

**Live:** enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / `root`)

## What's in here

| Section | Content |
|---|---|
| Case studies | Five self-directed AI product case studies: Zomato retention, Rapido mobility, Physics Wallah learning coach, YouTube Creator AI OS, One-Tap Playlists |
| Builds | Five shipped repos: Vriddhi, SecondoBrain, Leads Finder, Loan DSA Platform, Tracker |
| Experience | Build AI, Renan, Aditya Birla Capital |
| About | Education, certifications, toolkit, leadership |

## Features

- **Dark / light theme** toggled from the header, persisted in `localStorage`, defaulting to the
  operating system preference. An inline `<head>` script applies it before first paint, so there is
  no flash of the wrong theme.
- **Cursor starfield**: a canvas field of parallax stars that drift slowly, lean toward the pointer
  by depth, brighten near it, and draw constellation lines between the closest ones. Degrades to a
  still field under `prefers-reduced-motion` and is skipped entirely on coarse pointers.
- **Shooting stars**: meteors spawn on the same canvas every 1.5-4.3 seconds and live about 1.5,
  so one is on screen roughly 40% of the time. Each is a glowing head trailing a gradient tail that
  fades from white-green through violet to nothing. They start inside the viewport so the whole
  streak is visible.
- **Cursor orb**: a small morphing gradient blob that trails the pointer with easing and swells over
  anything clickable. Removed outright under reduced-motion or on touch.
- **Vinyl player**: a record in the header, next to the theme toggle. Tap it to start optional
  background music, tap again to stop; the disc spins while it plays. Ships with an original
  ambient loop (`assets/audio/track.m4a`). Volume fades rather than cuts, playback carries across
  page navigations via `sessionStorage`, and it pauses when the tab is hidden. Drop your own file
  at `assets/audio/track.mp3` to replace it. See `assets/audio/README.md`.
- Scroll-reveal, sticky nav, reading-progress bar and TOC scroll-spy on case study pages.

## Structure

```
index.html                     Landing page
work/
  zomato-retention.html
  rapido-mobility.html
  pw-learning-coach.html
  youtube-creator-os.html
  one-tap-playlists.html
assets/
  css/style.css                Design system + landing page
  css/case.css                 Case study pages
  js/main.js                   Nav, scroll reveal, TOC scroll-spy, theme, cursor field
  img/*.svg                    Hand-authored cover art
resume/Abhinay_Tiwari_CV.pdf
```

## Running locally

```bash
python3 -m http.server 4321
```

Then open http://localhost:4321

## Deploying

Any static host works. GitHub Pages, Netlify, Vercel and Cloudflare Pages all serve this as-is with
no configuration: point them at the repository root.

## Contact

- abhinaytiwari542@gmail.com
- [linkedin.com/in/abhinay-tiwari22](https://www.linkedin.com/in/abhinay-tiwari22/)
- [github.com/abhinaytiwari542-max](https://github.com/abhinaytiwari542-max)
