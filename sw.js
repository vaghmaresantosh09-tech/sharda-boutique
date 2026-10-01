/* SILAI GURU service worker — single profile gate + authoritative New Order picker */
const CACHE='sharda-boutique-v16';
const ASSETS=['./','./index.html','./manifest.json','./profile-validation-v2.js','./silai-guru-new-order.js'];
const PROFILE_SCRIPT='<script src="./profile-validation-v2.js?v=20261001-4"></script>';
const NEW_ORDER_SCRIPT='<script src="./silai-guru-new-order.js?v=20261001-1"></script>';
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.pathname.endsWith('.html')||url.pathname.endsWith('/')||/\.(js|css|svg|json)$/i.test(url.pathname)){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async response=>{
      if(url.pathname.endsWith('/silai-guru.html')){
        let text=await response.clone().text();
        if(!text.includes('profile-validation-v2.js'))text=text.includes('</body>')?text.replace('</body>',PROFILE_SCRIPT+'</body>'):text+PROFILE_SCRIPT;
        if(!text.includes('silai-guru-new-order.js'))text=text.includes('</body>')?text.replace('</body>',NEW_ORDER_SCRIPT+'</body>'):text+NEW_ORDER_SCRIPT;
        response=new Response(text,{status:response.status,statusText:response.statusText,headers:response.headers});
      }
      const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return response;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
  }
});
