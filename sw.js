/* SILAI GURU — clean runtime service worker
   Old duplicate garment/design patch blocks are stripped before the HTML reaches the browser.
   Authoritative New Order runtime: silai-guru-order-ui.js
*/
const CACHE='sharda-boutique-v20';
const ASSETS=['./','./index.html','./manifest.json','./profile-validation-v2.js','./silai-guru-order-ui.js'];
const PROFILE_SCRIPT='<script src="./profile-validation-v2.js?v=20261001-8"></script>';
const ORDER_SCRIPT='<script src="./silai-guru-order-ui.js?v=20261001-3"></script>';
function cleanHtml(text){
  const blocks=[
    /<script>\s*\/\* SG_GARMENTS_MANAGEMENT_FIX_V1 \*\/[\s\S]*?<\/script>/gi,
    /<script>\s*\/\* SG_REAL_DESIGN_LIBRARY_V2 \*\/[\s\S]*?<\/script>/gi,
    /<style id="sg-expanded-library-style">[\s\S]*?<\/style>/gi,
    /<script id="sg-expanded-library-script">[\s\S]*?<\/script>/gi,
    /<!-- SG_DESIGN_LIBRARY_EXPANDED_V1 -->[\s\S]*?<!-- \/SG_DESIGN_LIBRARY_EXPANDED_V1 -->/gi
  ];
  for(const re of blocks) text=text.replace(re,'');
  if(!text.includes('profile-validation-v2.js')) text=text.includes('</body>')?text.replace('</body>',PROFILE_SCRIPT+'</body>'):text+PROFILE_SCRIPT;
  if(!text.includes('silai-guru-order-ui.js')) text=text.includes('</body>')?text.replace('</body>',ORDER_SCRIPT+'</body>'):text+ORDER_SCRIPT;
  return text;
}
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.pathname.endsWith('.html')||url.pathname.endsWith('/')||/\.(js|css|svg|json)$/i.test(url.pathname)){
    event.respondWith(fetch(req,{cache:'no-store'}).then(async response=>{
      if(url.pathname.endsWith('/silai-guru.html')){
        const text=cleanHtml(await response.clone().text());
        response=new Response(text,{status:response.status,statusText:response.statusText,headers:response.headers});
      }
      const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(req,copy));return response;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  }else event.respondWith(caches.match(req).then(cached=>cached||fetch(req)));
});
