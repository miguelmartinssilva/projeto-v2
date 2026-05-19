const CACHE = "mm-cache-v2";
const ASSETS = [
  "/",
  "index.html",
  "dashboard.html",
  "clientes.html",
  "financeiro.html",
  "historico.html",
  "perfil.html",
  "pacotes.html",
  "templates.html",
  "admin.html",
  "editor.html",
  "login.html",
  "config.js",
  "app.js",
  "perfis.js",
  "editor.js",
  "historico.js",
  "templates.js",
  "login.js",
  "admin.js",
  "admin.css",
  "historico.css",
  "IMG/LOGO.png",
  "manifest.json",
];

const CDN_CACHE = "mm-cdn-v1";
const CDN_ASSETS = [
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js",
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== CDN_CACHE).map(k => caches.delete(k))))
  );
});

self.addEventListener("fetch", e => {
  const url = e.request.url;
  if (url.includes("cdn") || url.includes("fonts.googleapis")) {
    e.respondWith(
      caches.open(CDN_CACHE).then(cache =>
        cache.match(e.request).then(r => (r || fetch(e.request).then(res => { cache.put(e.request, res.clone()); return res; })))
      )
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).catch(() => new Response("Offline", { status: 503 })))
    );
  }
});
