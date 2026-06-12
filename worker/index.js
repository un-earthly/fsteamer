// Proxies the RapidAPI football API so the key (RAPIDAPI_KEY secret) never
// ships to the browser. Edge-caches responses to conserve the 50 req/day quota.
const UPSTREAM = 'football-live-stream-api.p.rapidapi.com';
const ALLOWED_ORIGINS = [
  'https://un-earthly.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
];
// Seconds of edge cache per route: list changes often, links rarely
const TTL = { '/all-match': 60, '/link/': 240 };

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Vary': 'Origin',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const route = pathname === '/all-match' ? '/all-match'
      : /^\/link\/[\w-]+$/.test(pathname) ? '/link/'
      : null;
    if (request.method !== 'GET' || !route) {
      return Response.json({ message: 'Not found' }, { status: 404, headers: cors });
    }

    const res = await fetch(`https://${UPSTREAM}${pathname}`, {
      headers: { 'x-rapidapi-host': UPSTREAM, 'x-rapidapi-key': env.RAPIDAPI_KEY },
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': TTL[route], '400-599': 0 } },
    });
    return new Response(res.body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  },
};
