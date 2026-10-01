const CACHE='sharda-boutique-v10';
const ASSETS=['./','./index.html','./manifest.json'];

const PROFILE_FIX=`<script id="sg-profile-validation-fix">
(function(){
  'use strict';
  const byId=id=>document.getElementById(id);
  const trim=id=>{const e=byId(id);return e?e.value.trim():''};
  const states=['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'];
  const nameRe=/^[\\p{L}][\\p{L} .'-]{1,49}$/u;
  const shopRe=/^[\\p{L}\\p{N}][\\p{L}\\p{N} .&'()_-]{2,79}$/u;
  const placeRe=/^[\\p{L}][\\p{L} .'-]{1,49}$/u;
  const emailRe=/^[A-Za-z0-9][A-Za-z0-9._%+-]{1,63}@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+$/;
  const badWords=['test','testing','example','abc','xyz','qwerty','asdf','dummy','random','ghgh','gaga','aaaa','xxxx'];
  function realText(v,fullName){
    if(!v||v.length<3)return false;
    const low=v.toLowerCase().replace(/[^a-z\\p{L}]/gu,'');
    if(low.length<3)return false;
    if(badWords.some(x=>low===x||low.includes(x)&&low.length<12))return false;
    if(/(.)\\1{3,}/u.test(low))return false;
    if(fullName && !/[\\p{L}]/u.test(v))return false;
    return true;
  }
  function valid(){
    const fields=[
      ['pn',v=>nameRe.test(v)&&realText(v,true),'Shop owner ka proper naam likhiye.'],
      ['pm',v=>/^[6-9]\\d{9}$/.test(v),'Mobile number exactly 10 digits ka hona chahiye aur 6-9 se start hona chahiye.'],
      ['ps',v=>shopRe.test(v)&&realText(v,false),'Shop ka proper naam likhiye.'],
      ['pe',v=>emailRe.test(v)&&!/(test|example|dummy)@/i.test(v),'Valid email address likhiye, jaise name@gmail.com.'],
      ['pa',v=>v.length>=10&&/[A-Za-z\\p{L}]/u.test(v)&&/\\d/.test(v),'Address mein proper address details likhiye.'],
      ['pst',v=>states.some(s=>s.toLowerCase()===v.toLowerCase()),'India ka valid State/UT select ya likhiye.'],
      ['pc',v=>placeRe.test(v)&&realText(v,false),'Proper City ka naam likhiye.'],
      ['pp',v=>/^[1-9]\\d{5}$/.test(v),'Pincode exactly 6 digits ka hona chahiye.']
    ];
    let ok=true,first=null;
    fields.forEach(([id,test,msg])=>{
      const e=byId(id); if(!e)return;
      e.setCustomValidity(''); e.removeAttribute('aria-invalid');
      const old=e.parentElement&&e.parentElement.querySelector('.sg-profile-error'); if(old)old.remove();
      const value=e.value.trim();
      if(!test(value)){
        ok=false; if(!first)first=e; e.setCustomValidity(msg); e.setAttribute('aria-invalid','true');
        const m=document.createElement('small'); m.className='sg-profile-error'; m.textContent=msg;
        m.style.cssText='color:#c62828;font-size:11px;font-weight:700;line-height:1.3;display:block;margin-top:3px;';
        e.parentElement.appendChild(m);
      }
    });
    if(!ok){
      if(first){first.focus();try{first.scrollIntoView({behavior:'smooth',block:'center'})}catch(_){} }
      alert('Profile save nahi hua. Sabhi details proper format mein bhariye.');
    }
    return ok;
  }
  function setup(){
    const btn=byId('profileSaveBtn'); if(!btn)return;
    const ids=['pn','pm','ps','pe','pa','pst','pc','pp'];
    const labels={pn:'Shop Owner Name *',pm:'Mobile Number *',ps:'Shop Name *',pe:'Email ID *',pa:'Address *',pst:'State *',pc:'City *',pp:'Pincode *'};
    ids.forEach(id=>{const e=byId(id);if(!e)return;e.setAttribute('autocomplete','off');if(labels[id]){const l=e.parentElement&&e.parentElement.querySelector('label');if(l)l.textContent=labels[id]}});
    const pm=byId('pm'),pp=byId('pp'),pe=byId('pe');
    if(pm){pm.setAttribute('maxlength','10');pm.setAttribute('inputmode','numeric');pm.setAttribute('pattern','[6-9][0-9]{9}');pm.addEventListener('input',()=>{pm.value=pm.value.replace(/\\D/g,'').slice(0,10)});}
    if(pp){pp.setAttribute('maxlength','6');pp.setAttribute('inputmode','numeric');pp.setAttribute('pattern','[1-9][0-9]{5}');pp.addEventListener('input',()=>{pp.value=pp.value.replace(/\\D/g,'').slice(0,6)});}
    if(pe)pe.setAttribute('type','email');
    ids.forEach(id=>{const e=byId(id);if(e)e.addEventListener('input',()=>{e.setCustomValidity('');const m=e.parentElement&&e.parentElement.querySelector('.sg-profile-error');if(m)m.remove()})});
    document.addEventListener('click',function(ev){if(ev.target&&ev.target.closest&&ev.target.closest('#profileSaveBtn')&&!valid()){ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();}},true);
    document.addEventListener('submit',function(ev){if(ev.target&&ev.target.id==='pf'&&!valid()){ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();}},true);
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
        if(text.indexOf('id="sg-profile-validation-fix"')===-1&&text.includes('</body>')){
          const body=text.replace('</body>',PROFILE_FIX+'</body>');
          res=new Response(body,{status:res.status,statusText:res.statusText,headers:res.headers});
        }
      }
      const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
  }else{
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return res})));
  }
});