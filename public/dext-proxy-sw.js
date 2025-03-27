// public/dext-proxy-sw.js
self.addEventListener('install', event => {
    self.skipWaiting(); // Activate worker immediately
  });
  
  self.addEventListener('activate', event => {
    event.waitUntil(clients.claim()); // Take control of all clients
  });
  
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Check if the request is for a Next.js resource
    if (url.pathname.startsWith('/_next/')) {
      // Redirect to our proxy
      const proxyUrl = new URL('/api/proxy/asset', url.origin);
      proxyUrl.searchParams.set('url', 'https://dext.com' + url.pathname);
      
      event.respondWith(
        fetch(proxyUrl.toString(), {
          method: event.request.method,
          headers: event.request.headers,
          body: event.request.body,
          mode: 'cors',
          credentials: event.request.credentials,
          redirect: 'follow'
        })
      );
    }
  });