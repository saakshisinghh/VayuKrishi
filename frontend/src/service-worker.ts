/// <reference lib="WebWorker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE_VERSION = "v1";
const STATIC_CACHE = `vayukrishi-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `vayukrishi-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `vayukrishi-offline-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

const OFFLINE_FALLBACK_ROUTES = [
  "/en/overview",
  "/en/crop-recommendation",
  "/en/disease-detection",
];

// Install
sw.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
      sw.skipWaiting(),
    ])
  );
});

// Activate
sw.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE].includes(k))
            .map((k) => caches.delete(k))
        )
      ),
      sw.clients.claim(),
    ])
  );
});

// Fetch — Network-first for API, Cache-first for assets
sw.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== sw.location.origin) return;

  // API: network-first, cache as fallback
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached ?? Response.error()))
    );
    return;
  }

  // Static assets: cache-first
  if (url.pathname.match(/\.(js|css|png|jpg|svg|woff2?)$/)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        });
      })
    );
    return;
  }

  // Navigation: network-first with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, response.clone()));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("/offline") ?? Response.error();
        })
    );
  }
});

// Background sync for offline submissions
sw.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-disease-uploads") {
    event.waitUntil(syncPendingUploads());
  }
});

async function syncPendingUploads() {
  // Sync logic: retrieve from IndexedDB and POST to API
}

// Push notifications
sw.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  event.waitUntil(
    sw.registration.showNotification(data.title ?? "Vayukrishi", {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      tag: data.tag ?? "vayukrishi-notification",
      data: { url: data.actionUrl },
    })
  );
});

sw.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(sw.clients.openWindow(url));
});
