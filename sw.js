// Service worker desativado para remover scripts maliciosos
1	self.addEventListener('install', (event) => {
2	  self.skipWaiting();
3	});
4	
5	self.addEventListener('activate', (event) => {
6	  event.waitUntil(
7	    caches.keys().then((cacheNames) => {
8	      return Promise.all(
9	        cacheNames.map((cacheName) => {
10	          return caches.delete(cacheName);
11	        })
12	      );
13	    })
14	  );
15	});
