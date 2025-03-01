const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
    "/", 
    "/index.html", 
    "/manifest.json", 
    "/offline.html", // 追加
    "/icon-192x192.png", 
    "/icon-512x512.png"
];

// インストール時にキャッシュする
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// ネットワークが使えない場合はオフラインページを表示
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((response) => {
                return response || caches.match("/offline.html"); // オフラインページを返す
            });
        })
    );
});

// 古いキャッシュを削除する
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});
