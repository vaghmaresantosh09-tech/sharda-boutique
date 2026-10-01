const CACHE='sharda-boutique-v11';
const ASSETS=['./','./index.html','./manifest.json'];

const PROFILE_FIX=`<script id="sg-profile-validation-v11">
(function(){
  'use strict';
  const byId=id=>document.getElementById(id);
  const states=['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'];
  const textRe=/^[\\p{L}][\\p{L} .'-]{1,59}$/u;
  const shopRe=/^[\\p{L}\\p{N}][\\p{L}\\p{N} .&'()_-]{2,79}$/u;
  const emailRe=/^[A-Za-z0-9][A-Za-z0-9._%+-]{1,63}@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)+$/;
  const bad=['test','testing','example','dummy','random','qwerty','asdf','abc','xyz','ghgh','gaga','aaaa','xxxx','yyyy','zzzz','1234'];
  function sane(v,allowDigits){
    const s=v.trim(), low=s.toLowerCase();
    if(s.length<3)return false;
    if(bad.some(x=>low===x || (low.includes(x)&&low.length<10)))return false;
    if(/(.)\\1{3,}/u.test(low))return false;
    const letters=(low.match(/[a-z\\p{L}]/gu)||[]).length;
    const vowels=(low.match(/[aeiou\\p{M}]/gu)||[]).length;
    if(letters<3)return false;
    if(!allowDigits && vowels<1)return false;
    return true;
  }
  function check(){
    const rules=[
      ['pn',v=>textRe.test(v)&&sane(v,false),'Shop owner ka proper naam likhiye.'],
      ['pm',v=>/^[6-9]\\d{9}$/.test(v),'Mobile number exactly 10 digits ka hona chahiye aur 6-9 se start hona chahiye.'],
      ['ps',v=>shopRe.test(v)&&sane(v,true),'Shop ka proper naam likhiye.'],
      ['pe',v=>emailRe.test(v)&&!/(test|example|dummy)@/i.test(v),'Valid email address likhiye, jaise name@gmail.com.'],
      ['pa',v=>v.length>=10&&/[A-Za-z\\p{L}]/u.test(v)&&/\\d/.test(v),'Address mein proper details likhiye (house/shop number bhi).'],
      ['pst',v=>states.some(s=>s.toLowerCase()===v.trim().toLowerCase()),'India ka valid State/UT likhiye.'],
      ['pc',v=>textRe.test(v)&&sane(v,false),'Proper City ka naam likhiye.'],
      ['pp',v=>/^[1-9]\\d{5}$/.test(v),'Pincode exactly 6 digits ka hona chahiye.']
    ];
    let ok=true,first=null;
    rules.forEach(([id,test,msg])=>{
      const e=byId(id); if(!e)return;
      e.setCustomValidity(''); e.removeAttribute('aria-invalid');
      const old=e.parentElement?.querySelector('.sg-profile-error'); if(old)old.remove();
      const value=e.value.trim();
      if(!test(value)){
        ok=false; if(!first)first=e;
        e.setCustomValidity(msg); e.setAttribute('aria-invalid','true');
        const m=document.createElement('small'); m.className='sg-profile-error'; m.textContent=msg;
        m.style.cssText='display:block;color:#c62828;font-size:12px;font-weight:700;line-height:1.35;margin-top:3px;';
        e.parentElement?.appendChild(m);
      }
    });
    const btn=byId('profileSaveBtn');
    if(btn){btn.disabled=!ok;btn.style.opacity=ok?'1':'.65';btn.setAttribute('aria-disabled',String(!ok));}
    if(!ok && first){first.focus();try{first.scrollIntoView({behavior:'smooth',block:'center'})}catch(_){} }
    return ok;
  }
  function stop(ev){
    if(!check()){
      ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();
      return false;
    }
    return true;
  }
  function setup(){
    const btn=byId('profileSaveBtn'); if(!btn)return;
    btn.type='submit';
    const ids=['pn','pm','ps','pe','pa','pst','pc','pp'];
    const labels={pn:'Shop Owner Name *',pm:'Mobile Number *',ps:'Shop Name *',pe:'Email ID *',pa:'Address *',pst:'State *',pc:'City *',pp:'Pincode *'};
    ids.forEach(id=>{const e=byId(id);if(!e)return;e.setAttribute('autocomplete','off');const l=e.parentElement?.querySelector('label');if(l)l.textContent=labels[id]||l.textContent;e.addEventListener('input',check);e.addEventListener('change',check);});
    const pm=byId('pm'),pp=byId('pp'),pe=byId('pe');
    if(pm){pm.setAttribute('maxlength','10');pm.setAttribute('inputmode','numeric');pm.setAttribute('pattern','[6-9][0-9]{9}');pm.addEventListener('input',()=>{pm.value=pm.value.replace(/\\D/g,'').slice(0,10);check();});}
    if(pp){pp.setAttribute('maxlength','6');pp.setAttribute('inputmode','numeric');pp.setAttribute('pattern','[1-9][0-9]{5}');pp.addEventListener('input',()=>{pp.value=pp.value.replace(/\\D/g,'').slice(0,6);check();});}
    if(pe)pe.setAttribute('type','email');
    const form=byId('pf');
    if(form)form.addEventListener('submit',stop,true);
    document.addEventListener('click',function(ev){if(ev.target?.closest?.('#profileSaveBtn'))stop(ev);},true);
    check();
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
        if(text.indexOf('id="sg-profile-validation-v11"')===-1&&text.includes('</body>')){
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