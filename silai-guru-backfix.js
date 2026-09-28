/* SILAI GURU — app-level browser history + garment design/source fixes + WhatsApp add-on */
(function(){
  'use strict';
  const KEY='__silaiGuruView';
  let restoring=false;
  const titleMap={
    '➕ New Order':'order','New Order':'order','👥 Customers':'customers','Customers':'customers',
    '📋 Orders':'orders','Orders':'orders','📏 Measurements':'measure','Measurements':'measure',
    '💰 Payments':'payments','Payments':'payments','🚚 Delivery':'delivery','Delivery':'delivery',
    '📊 Reports':'reports','Reports':'reports','🏪 Shop Profile':'profile','Shop Profile':'profile',
    '☁️ Backup':'backup','Backup':'backup','🧑‍🔧 Workers':'workers','Workers':'workers',
    '👗 Garments':'garments','Garments':'garments','🎨 Design Library':'designs','Design Library':'designs',
    '⚙️ Settings':'settings','Settings':'settings','💎 Plans & Upgrade':'plans','Plans & Upgrade':'plans',
    '📏 Measurement Templates':'garment-measurements'
  };
  function currentView(){
    const el=document.getElementById('mt'),raw=String(el&&el.textContent||'').trim();
    if(titleMap[raw])return titleMap[raw];
    if(/^📏 .+ Measurements$/.test(raw))return 'garment-measurement-editor:'+raw.slice(3,-13);
    if(/^🧵 .+ Services$/.test(raw))return 'garment-services:'+raw.slice(3,-9);
    if(/^👗 .+ Designs$/.test(raw))return 'design-catalog:'+raw.slice(3,-8);
    if(raw==='📁 My Garment Folder')return 'garment-folder';
    return raw?'custom:'+raw:'dashboard';
  }
  function state(){return history.state&&history.state[KEY]?history.state:null;}
  window.__sgRecordView=function(view){
    if(restoring||!view)return;
    const v=String(view),s=state();
    if(s&&s.view===v)return;
    history.pushState({[KEY]:true,view:v},'',location.href);
  };
  try{if(!state())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){}
  function findGarmentIndex(name){
    try{const a=typeof window.getGarmentMaster==='function'?window.getGarmentMaster():[];return a.findIndex(g=>String(g.name)===String(name));}catch(e){return -1;}
  }
  function restore(view){
    restoring=true;
    try{
      if(!view||view==='dashboard'){const m=document.getElementById('modal');if(m)m.classList.remove('show');return;}
      if(view==='garment-measurements'&&typeof window.openGarmentMeasurementManager==='function')return window.openGarmentMeasurementManager();
      if(view==='garments'&&typeof window.openGarmentsManager==='function')return window.openGarmentsManager();
      if(view.indexOf('garment-measurement-editor:')===0){const i=findGarmentIndex(view.slice(27));if(i>=0&&typeof window.openGarmentMeasurementEditor==='function')return window.openGarmentMeasurementEditor(i);return;}
      if(view.indexOf('garment-services:')===0){const i=findGarmentIndex(view.slice(17));if(i>=0&&typeof window.openGarmentServiceEditor==='function')return window.openGarmentServiceEditor(i);return;}
      if(view.indexOf('design-catalog:')===0&&typeof window.openDesignCatalog==='function')return window.openDesignCatalog(view.slice(15));
      if(view==='garment-folder'&&typeof window.openGarmentFolder==='function')return window.openGarmentFolder();
      if(/^[a-z-]+$/.test(view)&&typeof window.openM==='function')return window.openM(view);
      const m=document.getElementById('modal');if(m)m.classList.remove('show');
    }finally{restoring=false;}
  }
  window.addEventListener('popstate',function(e){const s=e&&e.state;if(!s||!s[KEY])return;restore(s.view||'dashboard')},true);
  window.addEventListener('load',function(){try{if(!state())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){};installWhatsAppAddon();});

  /* Every garment icon in New Order opens its own related design library. */
  (function installGarmentDesignClickFix(){
    if(window.__sgGarmentDesignClickFix)return;
    window.__sgGarmentDesignClickFix=true;
    function cleanName(v){return String(v||'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/\s+/g,' ').trim();}
    function ensureDesignSources(type){
      const box=document.querySelector('.design-sources');if(!box)return;
      const hasText=t=>Array.from(box.querySelectorAll('button,label,a')).some(el=>cleanName(el.textContent).toLowerCase().includes(t));
      if(!hasText('camera')){
        const label=document.createElement('label');label.className='source-chip';
        label.innerHTML='📷 Camera<input type="file" accept="image/*" capture="environment" style="position:absolute;opacity:0;width:1px;height:1px">';
        const input=label.querySelector('input');if(input)input.addEventListener('change',function(){if(typeof window.saveUploadedDesign==='function')window.saveUploadedDesign(type,input)});box.appendChild(label);
      }
      if(!hasText('gallery')){
        const label=document.createElement('label');label.className='source-chip';
        label.innerHTML='🖼️ Gallery<input type="file" accept="image/*" style="position:absolute;opacity:0;width:1px;height:1px">';
        const input=label.querySelector('input');if(input)input.addEventListener('change',function(){if(typeof window.saveUploadedDesign==='function')window.saveUploadedDesign(type,input)});box.appendChild(label);
      }
      if(!hasText('websites')){
        const b=document.createElement('button');b.type='button';b.className='source-chip';b.textContent='🌐 Websites';
        b.addEventListener('click',function(){
          if(typeof window.openOrderWebsites==='function')return window.openOrderWebsites(type,0);
          const q=encodeURIComponent(String(type)+' garment designs');window.open('https://www.google.com/search?tbm=isch&q='+q,'_blank','noopener');
        });box.appendChild(b);
      }
    }
    function openForElement(el){
      if(!el)return false;
      const b=el.querySelector('b'),name=cleanName(b?b.textContent:el.textContent);
      if(!name||name==='All Garments'||typeof window.openDesignCatalog!=='function')return false;
      if(window.__sgRecordView)window.__sgRecordView('design-catalog:'+name);
      window.openDesignCatalog(name);setTimeout(function(){ensureDesignSources(name)},0);return true;
    }
    document.addEventListener('click',function(e){
      const el=e.target&&e.target.closest?e.target.closest('.sg-type-icon'):null;if(!el)return;
      if(el.dataset.sgDesignHandled==='1')return;el.dataset.sgDesignHandled='1';e.preventDefault();e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();openForElement(el);
    },true);
    const observer=new MutationObserver(function(){document.querySelectorAll('.sg-type-icon').forEach(function(el){if(!el.getAttribute('role'))el.setAttribute('role','button');if(!el.getAttribute('tabindex'))el.setAttribute('tabindex','0');el.setAttribute('aria-label','Open '+cleanName(el.textContent)+' designs')})});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  })();

  /* IMPORTANT: Do not replace non-Kurti designs with unrelated stock photos.
     silai-guru.html already has garment-specific SVG designVisual() artwork
     for Blouse, Shirt, Pant, Blazer, Salwar, etc. Keeping those visuals avoids
     the previous bug where a Blouse card showed trousers or unrelated fashion photos. */

  /* OPTIONAL WHATSAPP SERVICES ADD-ON
     Normal phone-WhatsApp sharing stays free/inside the existing plan flow.
     This dashboard card is only an information/subscription entry point for a
     future automatic WhatsApp Business Platform/API service. No API messages
     are sent by this UI and no price is invented here. */
  function installWhatsAppAddon(){
    if(window.__sgWhatsAppAddon)return;
    window.__sgWhatsAppAddon=true;
    const style=document.createElement('style');
    style.id='sg-whatsapp-addon-style';
    style.textContent='.sg-wa-addon{position:relative}.sg-wa-badge{position:absolute;top:7px;right:7px;background:#fff0c9;color:#765500;border-radius:99px;padding:3px 6px;font-size:9px;font-weight:900}.sg-wa-modal{position:fixed;inset:0;background:#0007;z-index:120;display:none;align-items:flex-end;padding:0}.sg-wa-modal.show{display:flex}.sg-wa-sheet{background:#fff;width:100%;max-width:760px;margin:auto;border-radius:24px 24px 0 0;padding:18px;max-height:90vh;overflow:auto}.sg-wa-feature{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #eee}.sg-wa-feature:last-child{border-bottom:0}.sg-wa-icon{font-size:22px;width:30px}.sg-wa-note{background:#fff7df;border:1px solid #efd58b;border-radius:13px;padding:11px;font-size:12px;color:#6b5300;margin-top:12px}.sg-wa-price{background:#f4f1ff;border:1px solid #ddd7ff;border-radius:14px;padding:13px;margin-top:12px}.sg-wa-price b{color:#5144bd}.sg-wa-close{float:right;background:#eee}.sg-wa-subscribe{background:#5b4bdb;color:#fff;width:100%;margin-top:12px}.sg-wa-disabled{background:#eee;color:#777;width:100%;margin-top:8px}';
    document.head.appendChild(style);

    function addCard(){
      const containers=Array.from(document.querySelectorAll('.icons'));
      const grid=containers.find(function(x){return !x.closest('.bottom') && !x.querySelector('.sg-wa-addon')});
      if(!grid || document.querySelector('.sg-wa-addon'))return;
      const card=document.createElement('button');
      card.type='button';card.className='ico sg-wa-addon';card.setAttribute('aria-label','WhatsApp Services');
      card.innerHTML='<span class="sg-wa-badge">ADD-ON</span><span class="dash-icon"><span style="font-size:38px">💬</span></span><small>WhatsApp<br>Services</small>';
      card.addEventListener('click',openModal);
      grid.appendChild(card);
    }
    function ensureModal(){
      if(document.getElementById('sgWaModal'))return document.getElementById('sgWaModal');
      const m=document.createElement('div');m.id='sgWaModal';m.className='sg-wa-modal';
      m.innerHTML='<div class="sg-wa-sheet" role="dialog" aria-modal="true" aria-labelledby="sgWaTitle"><button type="button" class="sg-wa-close" id="sgWaClose">✕</button><h2 id="sgWaTitle" style="margin-top:0">💬 WhatsApp Services</h2><p class="muted">Customer ko automatic order aur business messages bhejne ki optional paid facility.</p><div class="sg-wa-feature"><span class="sg-wa-icon">🧾</span><div><b>Order & Bill Message</b><div class="muted">Order confirmation aur bill details.</div></div></div><div class="sg-wa-feature"><span class="sg-wa-icon">📅</span><div><b>Delivery Reminder</b><div class="muted">Customer ko delivery-related reminder.</div></div></div><div class="sg-wa-feature"><span class="sg-wa-icon">💰</span><div><b>Payment / Balance Reminder</b><div class="muted">Advance aur remaining balance ki information.</div></div></div><div class="sg-wa-feature"><span class="sg-wa-icon">✉️</span><div><b>Predefined Messages</b><div class="muted">Tailor apne business ke approved message templates use kar sakega.</div></div></div><div class="sg-wa-price"><b>Optional Paid Add-on</b><div style="font-size:12px;margin-top:5px">Price abhi final nahi kiya gaya hai. Provider/API cost check karke suitable plan price set ki jayegi.</div></div><div class="sg-wa-note">📱 Normal WhatsApp sharing existing app flow me rahegi. Ye add-on automatic WhatsApp Business Platform/API messaging ke liye hai.</div><button type="button" class="sg-wa-subscribe" id="sgWaSubscribe">Coming Soon — Price Later</button><button type="button" class="sg-wa-disabled" id="sgWaClose2">Close</button></div>';
      document.body.appendChild(m);
      m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('show')});
      document.getElementById('sgWaClose').addEventListener('click',function(){m.classList.remove('show')});
      document.getElementById('sgWaClose2').addEventListener('click',function(){m.classList.remove('show')});
      document.getElementById('sgWaSubscribe').addEventListener('click',function(){alert('WhatsApp Services ka price aur automatic API activation baad me final kiya jayega.')});
      return m;
    }
    function openModal(){ensureModal().classList.add('show');}
    function watch(){addCard();setTimeout(addCard,250);setTimeout(addCard,1000);}
    watch();
    const ob=new MutationObserver(function(){addCard()});
    ob.observe(document.body,{childList:true,subtree:true});
  }
})();