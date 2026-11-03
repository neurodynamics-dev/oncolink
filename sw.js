/* OncoLink · service worker: app offline e notificações push */
const V = '6'; // mesma versão do ?v= nas páginas
const CACHE = 'oncolink-v' + V;
const BASE = [
  './', 'index.html', 'app.html', 'manifest.webmanifest', 'favicon.ico',
  ...['assets/css/base.css', 'assets/css/app.css', 'assets/js/icons.js', 'assets/js/push-config.js', 'assets/js/data.js', 'assets/js/app.js'].map(f => f + '?v=' + V),
  'assets/img/marina.svg', 'assets/img/favicon.svg', 'assets/img/icone-192.png', 'assets/img/badge-96.png', 'assets/img/neurodynamics.png',
  'assets/img/marcas/apple-saude.svg', 'assets/img/marcas/apple.svg', 'assets/img/marcas/clue.svg', 'assets/img/marcas/fitbit.svg',
  'assets/img/marcas/health-connect.svg', 'assets/img/marcas/garmin.svg'
];
const url = p => new URL(p, self.registration.scope).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(BASE.map(p => c.add(new Request(p, { cache: 'no-cache' }))))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// rede primeiro (sempre conferindo com o servidor, sem confiar no cache HTTP); sem conexão, a cópia guardada
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r, { cache: 'no-cache' }).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); }
    return res;
  }).catch(() => caches.match(r, { ignoreSearch: r.mode === 'navigate' })));
});

function mostrar({ title = 'OncoLink', body = '', tela = 'inicio', tag } = {}){
  return self.registration.showNotification(title, {
    body, tag: tag || 'oncolink-' + tela,
    icon: url('assets/img/icone-192.png'), badge: url('assets/img/badge-96.png'),
    data: { url: url('app.html?tela=' + encodeURIComponent(tela)) }
  });
}

// push do servidor: { "title": "...", "body": "...", "tela": "lia" }
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(mostrar(d));
});

// teste a partir do app
self.addEventListener('message', e => {
  if (!e.data || e.data.tipo !== 'teste') return;
  e.waitUntil(new Promise(ok => setTimeout(ok, Math.min(e.data.atraso || 0, 10000))).then(() => mostrar({
    title: 'Lia', tela: 'lia', tag: 'lia-teste',
    body: 'Faz uma semana que você falou do formigamento. Como está hoje?'
  })));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const alvo = (e.notification.data && e.notification.data.url) || url('app.html');
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) if ('focus' in c) { c.navigate(alvo); return c.focus(); }
    return self.clients.openWindow(alvo);
  }));
});
