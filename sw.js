/*
    Module: Service Worker, to provide offline caching

    part of: Hours - simple time tracking PWA, inspired by PalmOS hours.prc
    Copyright (C) 2020 Matija Nalis <mnalis-git@voyager.hr>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

const CACHE_ID = "Hours-v1";

/**
 * The install event is fired when the registration succeeds. 
 * cache all needed static resources so we can run offline
 */

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] Installing');
  event.waitUntil(
    caches.open(CACHE_ID).then(function (cache) {
      return cache.addAll(
        [
            '/',
            'db.js',
            'details.js',
            'list.js',
            'months.js',
            'main.js',
            'main.css',
            'hours-128.png',
        ]
      );
    })
  );
  console.log('[ServiceWorker] Installed (all cached).');
});

/* once a new Service Worker has installed and a previous version isn't being used, the new one activates, and we get an activate event */
self.addEventListener("activate", event => {
  console.log('[ServiceWorker] Activating new SW');
  // delete any old caches
  event.waitUntil(
    caches
      .keys()
      .then(keys => keys.filter(key => key !== CACHE_ID))
      .then(keys =>
        Promise.all(
          keys.map(key => {
            console.debug(`SW deleting cache ${key}`);
            return caches.delete(key);
          })
        )
      )
  );
  console.log('[ServiceWorker] Activated new SW with cache_id=',CACHE_ID);
  return self.clients.claim();
});


/* try cache first: if cache is missing, fall back to network (and put response in cache) */
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open(CACHE_ID).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            //console.debug ('SW fetch putting result to cache');
            return response;
          })
        );
      });
    }),
  );
});
