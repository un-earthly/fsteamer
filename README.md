# ⚽ FSteamer

A dead-simple installable web app (PWA) for watching live football matches, powered by the
[Football Live Stream API](https://rapidapi.com/) on RapidAPI.

Works on **Android** and **iOS** — open it in the browser and add it to your home screen.

## Features

- Live match list with scores, minutes, and kickoff times (`/all-match`)
- Tap a match to stream it (`/link/{id}`) — HLS via hls.js, native HLS on iOS Safari
- Installable: web app manifest + service worker (app shell cached offline)
- Zero build step, zero dependencies — plain HTML/CSS/JS

## Run

Serve the folder over HTTPS or localhost (service workers require it):

```sh
npx serve .
# or
python3 -m http.server 8080
```

Then open it on your phone and use **Add to Home Screen** (iOS Safari share menu, or the
install prompt on Android Chrome).

## Configuration

The RapidAPI key lives in `index.html` (`KEY` constant). Replace it with your own.
Note: a client-side key is visible to anyone who opens devtools — fine for personal use,
use a tiny proxy if you need to keep it private.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (UI + logic) |
| `manifest.webmanifest` | Install metadata |
| `sw.js` | Service worker (app-shell cache) |
| `icon.svg`, `icon-*.png` | App icons |
