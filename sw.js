const CACHE_NAME = 'kobebe-komik-v1.0.0';
const STATIC_CACHE = 'kobebe-static-v1.0.0';
const DYNAMIC_CACHE = 'kobebe-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    // Comic images
    '/komik/image_komik/Cover.jpg',
    '/komik/image_komik/page 1.jpg',
    '/komik/image_komik/page 2.jpg',
    '/komik/image_komik/page 3.jpg',
    '/komik/image_komik/page 4.jpg',
    '/komik/image_komik/page 5.jpg',
    '/komik/image_komik/page 6.jpg',
    '/komik/image_komik/page 7.jpg',
    '/komik/image_komik/page 8.jpg',
    '/komik/image_komik/page 9.jpg',
    '/komik/image_komik/page 10.jpg',
    '/komik/image_komik/page 11.jpg',
    // PDF file
    '/komik/Komik Bilangan Bulat.pdf',
    // External resources
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Assets that should be cached on demand
const DYNAMIC_ASSETS = [
    'https://fonts.gstatic.com/',
    'https://cdnjs.cloudflare.com/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker installing...');

    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
                    cache: 'reload'
                })));
            })
        ]).then(() => {
            console.log('Static assets cached successfully');
            // Force activation of new service worker
            return self.skipWaiting();
        }).catch(error => {
            console.error('Failed to cache static assets:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName !== STATIC_CACHE &&
                                   cacheName !== DYNAMIC_CACHE &&
                                   (cacheName.startsWith('kobebe-') || cacheName.startsWith('kobebe-static-') || cacheName.startsWith('kobebe-dynamic-'));
                        })
                        .map(cacheName => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            }),

            // Take control of all pages
            self.clients.claim()

        ]).then(() => {
            console.log('Service Worker activated successfully');
        }).catch(error => {
            console.error('Service Worker activation failed:', error);
        })
    );
});

// Fetch event - serve cached content when possible
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(request)) {
        // Static assets - cache first strategy
        event.respondWith(cacheFirst(request));
    } else if (isExternalResource(request)) {
        // External resources - stale while revalidate
        event.respondWith(staleWhileRevalidate(request));
    } else if (isNavigationRequest(request)) {
        // Navigation requests - network first with fallback
        event.respondWith(networkFirstWithFallback(request));
    } else {
        // Other requests - network first
        event.respondWith(networkFirst(request));
    }
});

// Cache strategies

// Cache First - good for static assets that don't change often
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        // Return fallback if available
        return caches.match('/offline.html') || new Response('Offline content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Network First - good for dynamic content
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Network First with Fallback - good for navigation requests
async function networkFirstWithFallback(request) {
    try {
        return await networkFirst(request);
    } catch (error) {
        console.log('Network and cache failed, serving fallback');

        // Return the main page for navigation requests
        const fallback = await caches.match('/') || await caches.match('/index.html');
        if (fallback) {
            return fallback;
        }

        // Ultimate fallback
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Kobebe Komik - Offline</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        padding: 2rem;
                        background: #0f1419;
                        color: white;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                    }
                    .icon {
                        font-size: 4rem;
                        margin-bottom: 1rem;
                    }
                    .retry-btn {
                        background: #1a472a;
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 1rem;
                        margin-top: 1rem;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">📚</div>
                    <h1>Kobebe Komik</h1>
                    <p>Tidak ada koneksi internet. Beberapa fitur mungkin tidak tersedia.</p>
                    <button class="retry-btn" onclick="window.location.reload()">
                        Coba Lagi
                    </button>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Stale While Revalidate - good for external resources
async function staleWhileRevalidate(request) {
    const cachedResponse = caches.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
            const cache = caches.open(DYNAMIC_CACHE);
            cache.then(c => c.put(request, response.clone()));
        }
        return response;
    }).catch(() => {
        // Network failed, will return cached version
        return null;
    });

    return (await cachedResponse) || (await fetchPromise) || new Response('Resource not available offline', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

// Helper functions

function isStaticAsset(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    return (
        pathname.endsWith('.css') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.gif') ||
        pathname.endsWith('.webp') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.pdf') ||
        pathname.endsWith('.woff2') ||
        pathname.endsWith('.woff') ||
        pathname.endsWith('.ttf') ||
        pathname === '/' ||
        pathname.endsWith('.html') ||
        pathname.endsWith('.json')
    );
}

function isExternalResource(request) {
    const url = new URL(request.url);
    return (
        url.origin !== self.location.origin &&
        (url.hostname.includes('googleapis.com') ||
         url.hostname.includes('gstatic.com') ||
         url.hostname.includes('cdnjs.cloudflare.com'))
    );
}

function isNavigationRequest(request) {
    return request.mode === 'navigate';
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);

    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Perform any pending offline actions
        console.log('Performing background sync...');

        // Example: sync reading progress, preferences, etc.
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'BACKGROUND_SYNC',
                payload: { status: 'completed' }
            });
        });

    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications (for future features)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/icons/icon.png',
            badge: '/icons/icon.png',
            vibrate: [200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '1'
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Baca Sekarang',
                    icon: '/icons/icon.png'
                },
                {
                    action: 'close',
                    title: 'Tutup',
                    icon: '/icons/icon.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification('Kobebe Komik', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/?section=reader')
        );
    } else {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic background sync (for future features)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'content-sync') {
        event.waitUntil(syncContent());
    }
});

async function syncContent() {
    try {
        console.log('Syncing content...');
        // Sync new comics, updates, etc.

    } catch (error) {
        console.error('Content sync failed:', error);
    }
}

console.log('Service Worker loaded successfully');
