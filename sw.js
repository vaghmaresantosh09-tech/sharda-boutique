/* SILAI GURU service worker — one profile gate loader, cache reset */
const CACHE='sharda-boutique-v15';
const ASSETS=['./','./index.html','./manifest.json','./profile-validation-v2.js'];
const PROFILE_SCRIPT='<script src="./profile-validation-v2.js?v=20261001-3"></script>';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.pathname.endsWith('.html')||url.pathname.endsWith('/')||/\.(js|css|svg|json)$/i.test(url.pathname)){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async response=>{
      if(url.pathname.endsWith('/silai-guru.html')){
        const text=await response.clone().text();
        if(!text.includes('profile-validation-v2.js')){
          const body=text.includes('</body>')?text.replace('</body>',PROFILE_SCRIPT+'</body>'):text+PROFILE_SCRIPT;
          response=new Response(body,{status:response.status,statusText:response.statusText,headers:response.headers});
        }
      }
      const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return response;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
  }
});
