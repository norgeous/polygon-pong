// importScripts('https://unpkg.com/@babel/standalone@7.18.13/babel.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.18.13/babel.min.js');

const CACHE_PREFIX = 'POLYGON-PONG';
const CACHE_VERSION = '0.0.2'; // increase to invalidate old caches on clientside
const CACHE_NAME = `${CACHE_PREFIX}@${CACHE_VERSION}`;

const isDev = location.hostname === 'localhost';

const getCache = () => caches.open(CACHE_NAME);

const setupCache = async() => {
  const keyList = await caches.keys();
  return Promise.all(keyList.map(key => {
    if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
      console.log('Deleting old cache :', key);
      return caches.delete(key);
    }
  }));
};

const getUrl = request => {
  const scope = self.registration.scope.replace(location.origin, '');
  const url = new URL(request.url);
  url.isSelfHosted = url.host === location.host;
  url.isRoot = scope === url.pathname;
  url.ext = url.pathname.includes('.') ? url.pathname.split('.').pop() : undefined;

  // auto append .js to all local files which dont have an ext already (ignoring the index.html)
  if (url.isSelfHosted && !url.isRoot && !url.ext) {
    url.pathname = `${url.pathname}.js`;
    url.ext = 'js';
  }

  return url;
};

const getResponse = async url => {
  // if found in cache return cached response
  const cachedResponse = await caches.match(url);
  if (cachedResponse) {
    // console.info('✅ CACHE HIT  :', url.href);
    return cachedResponse;
  }

  // otherwise fetch it
  // console.info('❌ CACHE MISS :', url.href);
  const fetchedResponse = await fetch(url).catch(e => {
    console.error(url);
    console.error(e);
  });

  // add new fetches into the cache
  if (!isDev) {
    const cache = await getCache();
    cache.add(url);
  }

  return fetchedResponse;
};

const handleRequest = async request => {
  const url = getUrl(request);
  const response = await getResponse(url); // from cache or fetch

  // transpile self hosted js files using react preset
  if (response.status === 200 && url.isSelfHosted && url.ext === 'js') {
    const text = await response.text();
    const { code } = Babel.transform(text, { presets: ['react'] });
    return new Response(code, response);
  }

  // exit point for all other self hosted file types (such as svg, css, etc)
  return response;
};

self.addEventListener('activate', event => event.waitUntil(clients.claim()));
self.addEventListener('activate', event => event.waitUntil(setupCache()));
self.addEventListener('fetch', event => event.respondWith(handleRequest(event.request)));
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'MESSAGE_IDENTIFIER') {
    console.log('delete all cache')
    caches.keys().then(function(names) {
      for (let name of names)
          caches.delete(name);
    });
  }
});
