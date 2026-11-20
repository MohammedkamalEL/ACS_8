// Service Worker: يخزّن واجهة التطبيق ليعمل بدون إنترنت في الطوارئ.
// الاستراتيجية: الشبكة أولاً (لأحدث نسخة)، وعند انقطاعها يُستخدم المخزّن.
const CACHE = "sos-saedni-v3";
const SHELL = ["/", "/index.html", "/favicon.svg", "/icon-192.png", "/icon-512.png", "/manifest.webmanifest"];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(SHELL);
      // أول زيارة: الصفحة تُحمَّل قبل أن يتحكم الـ Service Worker بها، فلا تمرّ ملفات JS وCSS عليه.
      // نخزّنها هنا صراحةً حتى يعمل التطبيق بدون إنترنت من أول زيارة، لا من الزيارة الثانية.
      try {
        const html = await (await fetch("/index.html", { cache: "reload" })).text();
        const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
        await cache.addAll(assets);
      } catch {
        /* نتابع بالأساسيات فقط */
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // خط Tajawal من Google Fonts: المخزّن أولاً ثم التحديث في الخلفية، ليبقى الخط العربي بدون إنترنت
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(request).then((hit) => {
        const fresh = fetch(request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
          .catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }

  // باقي الطلبات: من نفس الموقع فقط
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request).then((hit) => hit || caches.match("/index.html")))
  );
});
