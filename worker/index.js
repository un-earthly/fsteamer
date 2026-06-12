// Proxies two RapidAPI football APIs so the key (RAPIDAPI_KEY secret) never
// ships to the browser. Edge-caches responses to conserve daily quotas.
//   /all-match, /link/:id          -> football-live-stream-api (streams)
//   /data/football-*?...           -> free-api-live-football-data (scores, standings, players)
const STREAM_API = 'football-live-stream-api.p.rapidapi.com';
const DATA_API = 'free-api-live-football-data.p.rapidapi.com';
const ALLOWED_ORIGINS = [
  'https://un-earthly.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
];
// Seconds of edge cache, matched by path prefix; first hit wins
const TTL = [
  ['/link/', 240],
  ['/all-match', 60],
  ['/data/football-current-live', 60],
  ['/data/football-get-matches-by-date', 120],
  ['/data/football-get-all-leagues', 86400],
  ['/data/football-get-standing', 3600],
  ['/data/football-players-search', 3600],
  ['/data/', 300],
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, search } = url;
    const origin = request.headers.get('Origin') ?? '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    let upstream;
    if (pathname === '/all-match' || /^\/link\/[\w-]+$/.test(pathname)) {
      upstream = `https://${STREAM_API}${pathname}`;
    } else if (/^\/data\/football-[\w-]+$/.test(pathname)) {
      upstream = `https://${DATA_API}${pathname.slice(5)}${search}`;
    }
    if (request.method !== 'GET' || !upstream) {
      return Response.json({ message: 'Not found' }, { status: 404, headers: cors });
    }

    const ttl = TTL.find(([prefix]) => pathname.startsWith(prefix))[1];
    const host = upstream.includes(STREAM_API) ? STREAM_API : DATA_API;
    const res = await fetch(upstream, {
      headers: { 'x-rapidapi-host': host, 'x-rapidapi-key': env.RAPIDAPI_KEY },
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': ttl, '400-599': 0 } },
    });
    return new Response(res.body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  },
};
