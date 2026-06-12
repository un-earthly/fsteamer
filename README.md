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

The RapidAPI key never ships to the browser. The app calls a Cloudflare Worker proxy
(`worker/`) which holds the key as a secret and edge-caches responses to conserve the
free plan's 50 requests/day quota. To deploy your own:

```sh
cd worker
wrangler deploy
wrangler secret put RAPIDAPI_KEY   # paste your key at the prompt
```

Then point the `API` constant in `index.html` at your Worker URL, and add your Pages
origin to `ALLOWED_ORIGINS` in `worker/index.js`.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (UI + logic) |
| `manifest.webmanifest` | Install metadata |
| `sw.js` | Service worker (app-shell cache) |
| `icon.svg`, `icon-*.png` | App icons |
