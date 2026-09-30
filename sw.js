const CACHE='sharda-boutique-v9';
const ASSETS=['./','./index.html','./manifest.json'];

const PROFILE_FIX=`<script id="sg-profile-validation-fix">
(function(){
  'use strict';
  const byId=id=>document.getElementById(id);
  const trim=id=>{const e=byId(id);return e?e.value.trim():''};
  const nameRe=/^[\\p{L}][\\p{L} .'-]{1,49}$/u;
  const shopRe=/^[\\p{L}\\p{N}][\\p{L}\\p{N} .&'()_-]{1,79}$/u;
  const placeRe=/^[\\p{L}][\\p{L} .'-]{1,49}$/u;
  const emailRe=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
  function valid(){
    const fields=[
      ['pn',v=>nameRe.test(v),'Shop owner name sahi likhiye.'],
      ['pm',v=>/^[6-9]\\d{9}$/.test(v),'Mobile number 10 digits ka hona chahiye aur 6-9 se start hona chahiye.'],
      ['ps',v=>shopRe.test(v),'Shop name sahi likhiye.'],
      ['pe',v=>emailRe.test(v),'Valid email address likhiye, jaise name@gmail.com.'],
      ['pa',v=>v.length>=5,'Address poora likhiye.'],
      ['pst',v=>placeRe.test(v),'State sahi likhiye.'],
      ['pc',v=>placeRe.test(v),'City sahi likhiye.'],
      ['pp',v=>/^[1-9]\\d{5}$/.test(v),'Pincode exactly 6 digits ka hona chahiye.']
    ];
    let ok=true,first=null;
    fields.forEach(([id,test,msg])=>{
      const e=byId(id); if(!e)return;
      e.setCustomValidity('');
      e.removeAttribute('aria-invalid');
      const old=e.parentElement&&e.parentElement.querySelector('.sg-profile-error');
      if(old)old.remove();
      const value=e.value.trim();
      if(!test(value)){
        ok=false; if(!first)first=e;
        e.setCustomValidity(msg); e.setAttribute('aria-invalid','true');
        const m=document.createElement('small'); m.className='sg-profile-error';
        m.textContent=msg; m.style.cssText='color:#c62828;font-size:11px;font-weight:700;line-height:1.3;';
        e.parentElement.appendChild(m);
      }
    });
    if(!ok){
      if(first){first.focus();try{first.scrollIntoView({behavior:'smooth',block:'center'})}catch(_){} }
      alert('Profile save nahi hua. Kripya sabhi details sahi format mein bhariye.');
    }
    return ok;
  }
  function setup(){
    const btn=byId('profileSaveBtn');
    if(!btn)return;
    const ids=['pn','pm','ps','pe','pa','pst','pc','pp'];
    const labels={pn:'Shop Owner Name *',pm:'Mobile Number *',ps:'Shop Name *',pe:'Email ID *',pa:'Address *',pst:'State *',pc:'City *',pp:'Pincode *'};
    ids.forEach(id=>{const e=byId(id);if(!e)return; e.setAttribute('autocomplete','off'); if(labels[id]){const l=e.parentElement&&e.parentElement.querySelector('label');if(l)l.textContent=labels[id]}});
    const pm=byId('pm'),pp=byId('pp'),pe=byId('pe');
    if(pm){pm.setAttribute('maxlength','10');pm.setAttribute('inputmode','numeric');pm.setAttribute('pattern','[6-9][0-9]{9}');pm.addEventListener('input',()=>{pm.value=pm.value.replace(/\\D/g,'').slice(0,10)});}
    if(pp){pp.setAttribute('maxlength','6');pp.setAttribute('inputmode','numeric');pp.setAttribute('pattern','[1-9][0-9]{5}');pp.addEventListener('input',()=>{pp.value=pp.value.replace(/\\D/g,'').slice(0,6)});}
    if(pe)pe.setAttribute('type','email');
    ids.forEach(id=>{const e=byId(id);if(e)e.addEventListener('input',()=>{e.setCustomValidity('');const m=e.parentElement&&e.parentElement.querySelector('.sg-profile-error');if(m)m.remove()})});
    document.addEventListener('click',function(ev){
      if(ev.target&&ev.target.closest&&ev.target.closest('#profileSaveBtn')&&!valid()){
        ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();
      }
    },true);
    document.addEventListener('submit',function(ev){
      if(ev.target&&ev.target.id==='pf'&&!valid()){ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();}
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
</script>`;

self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));

self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  if(u.pathname.endsWith('.html')||u.pathname.endsWith('/')||/\\.(js|css|svg|json)$/i.test(u.pathname)){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async res=>{
      if(u.pathname.endsWith('/silai-guru.html')){
        const text=await res.clone().text();
        if(text.indexOf('id="sg-profile-validation-fix"')===-1 && text.includes('</body>')){
          const body=text.replace('</body>',PROFILE_FIX+'</body>');
          res=new Response(body,{status:res.status,statusText:res.statusText,headers:res.headers});
        }
      }
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));
      return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res
    })));
  }
});