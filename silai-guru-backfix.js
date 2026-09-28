/* SILAI GURU — app-level browser history for Android Back */
(function(){
  'use strict';
  const KEY='__silaiGuruView';
  let restoring=false;

  const titleMap={
    '➕ New Order':'order','New Order':'order',
    '👥 Customers':'customers','Customers':'customers',
    '📋 Orders':'orders','Orders':'orders',
    '📏 Measurements':'measure','Measurements':'measure',
    '💰 Payments':'payments','Payments':'payments',
    '🚚 Delivery':'delivery','Delivery':'delivery',
    '📊 Reports':'reports','Reports':'reports',
    '🏪 Shop Profile':'profile','Shop Profile':'profile',
    '☁️ Backup':'backup','Backup':'backup',
    '🧑‍🔧 Workers':'workers','Workers':'workers',
    '👗 Garments':'garments','Garments':'garments',
    '🎨 Design Library':'designs','Design Library':'designs',
    '⚙️ Settings':'settings','Settings':'settings',
    '💎 Plans & Upgrade':'plans','Plans & Upgrade':'plans',
    '📏 Measurement Templates':'garment-measurements'
  };

  function currentView(){
    const el=document.getElementById('mt');
    const raw=String(el&&el.textContent||'').trim();
    if(titleMap[raw]) return titleMap[raw];
    if(/^📏 .+ Measurements$/.test(raw)) return 'garment-measurement-editor:'+raw.slice(3,-13);
    if(/^🧵 .+ Services$/.test(raw)) return 'garment-services:'+raw.slice(3,-9);
    if(/^👗 .+ Designs$/.test(raw)) return 'design-catalog:'+raw.slice(3,-8);
    if(raw==='📁 My Garment Folder') return 'garment-folder';
    return raw ? 'custom:'+raw : 'dashboard';
  }

  function state(){return history.state&&history.state[KEY]?history.state:null;}

  window.__sgRecordView=function(view){
    if(restoring || !view)return;
    const v=String(view);
    const s=state();
    if(s && s.view===v)return;
    history.pushState({[KEY]:true,view:v},'',location.href);
  };

  try{
    const s=state();
    if(!s) history.replaceState({[KEY]:true,view:'dashboard'},'',location.href);
  }catch(e){}

  function findGarmentIndex(name){
    try{
      const a=typeof window.getGarmentMaster==='function'?window.getGarmentMaster():[];
      return a.findIndex(g=>String(g.name)===String(name));
    }catch(e){return -1;}
  }

  function restore(view){
    restoring=true;
    try{
      if(!view || view==='dashboard'){
        const m=document.getElementById('modal');
        if(m)m.classList.remove('show');
        return;
      }
      if(view==='garment-measurements' && typeof window.openGarmentMeasurementManager==='function')return window.openGarmentMeasurementManager();
      if(view==='garments' && typeof window.openGarmentsManager==='function')return window.openGarmentsManager();
      if(view.indexOf('garment-measurement-editor:')===0){
        const i=findGarmentIndex(view.slice(27));
        if(i>=0 && typeof window.openGarmentMeasurementEditor==='function')return window.openGarmentMeasurementEditor(i);
        return;
      }
      if(view.indexOf('garment-services:')===0){
        const i=findGarmentIndex(view.slice(17));
        if(i>=0 && typeof window.openGarmentServiceEditor==='function')return window.openGarmentServiceEditor(i);
        return;
      }
      if(view.indexOf('design-catalog:')===0 && typeof window.openDesignCatalog==='function')return window.openDesignCatalog(view.slice(15));
      if(view==='garment-folder' && typeof window.openGarmentFolder==='function')return window.openGarmentFolder();
      if(/^[a-z-]+$/.test(view) && typeof window.openM==='function')return window.openM(view);
      const m=document.getElementById('modal'); if(m)m.classList.remove('show');
    }finally{restoring=false;}
  }

  window.addEventListener('popstate',function(e){
    const s=e&&e.state;
    if(!s || !s[KEY])return;
    restore(s.view||'dashboard');
  },true);

  window.addEventListener('load',function(){
    try{
      if(!state()) history.replaceState({[KEY]:true,view:'dashboard'},'',location.href);
    }catch(e){}
  });

  /* NEW ORDER: make every garment icon open its own design catalog. */
  (function installGarmentDesignClickFix(){
    if(window.__sgGarmentDesignClickFix)return;
    window.__sgGarmentDesignClickFix=true;

    function cleanName(v){
      return String(v||'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/\s+/g,' ').trim();
    }

    function ensureDesignSources(type){
      const box=document.querySelector('.design-sources');
      if(!box)return;
      const hasText=t=>Array.from(box.querySelectorAll('button,label,a')).some(el=>cleanName(el.textContent).toLowerCase().includes(t));
      if(!hasText('camera')){
        const label=document.createElement('label');
        label.className='source-chip';
        label.innerHTML='📷 Camera<input type="file" accept="image/*" capture="environment" style="position:absolute;opacity:0;width:1px;height:1px">';
        const input=label.querySelector('input');
        if(input)input.addEventListener('change',function(){if(typeof window.saveUploadedDesign==='function')window.saveUploadedDesign(type,input);});
        box.appendChild(label);
      }
      if(!hasText('gallery')){
        const label=document.createElement('label');
        label.className='source-chip';
        label.innerHTML='🖼️ Gallery<input type="file" accept="image/*" style="position:absolute;opacity:0;width:1px;height:1px">';
        const input=label.querySelector('input');
        if(input)input.addEventListener('change',function(){if(typeof window.saveUploadedDesign==='function')window.saveUploadedDesign(type,input);});
        box.appendChild(label);
      }
      if(!hasText('websites')){
        const b=document.createElement('button');
        b.type='button';
        b.className='source-chip';
        b.textContent='🌐 Websites';
        b.addEventListener('click',function(){
          if(typeof window.openOrderWebsites==='function')return window.openOrderWebsites(type,0);
          const q=encodeURIComponent(String(type)+' garment designs');
          window.open('https://www.google.com/search?tbm=isch&q='+q,'_blank','noopener');
        });
        box.appendChild(b);
      }
    }

    function openForElement(el){
      if(!el)return false;
      const b=el.querySelector('b');
      const name=cleanName(b?b.textContent:el.textContent);
      if(!name || name==='All Garments' || typeof window.openDesignCatalog!=='function')return false;
      if(window.__sgRecordView)window.__sgRecordView('design-catalog:'+name);
      window.openDesignCatalog(name);
      setTimeout(function(){ensureDesignSources(name);},0);
      return true;
    }

    document.addEventListener('click',function(e){
      const el=e.target&&e.target.closest?e.target.closest('.sg-type-icon'):null;
      if(!el)return;
      if(el.dataset.sgDesignHandled==='1')return;
      el.dataset.sgDesignHandled='1';
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      openForElement(el);
    },true);

    const observer=new MutationObserver(function(){
      document.querySelectorAll('.sg-type-icon').forEach(function(el){
        if(!el.getAttribute('role'))el.setAttribute('role','button');
        if(!el.getAttribute('tabindex'))el.setAttribute('tabindex','0');
        el.setAttribute('aria-label','Open '+cleanName(el.textContent)+' designs');
      });
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  })();

  /* DESIGN LIBRARY: the main page previously supplied real photo URLs only
     for Kurti. Other garment types therefore fell back to SVG icons. Give
     every garment family a real-photo pool and cycle through it for all of
     its design cards. The existing Kurti photos remain untouched. */
  (function installAllGarmentPhotoCatalog(){
    if(window.__sgAllGarmentPhotoCatalog)return;
    window.__sgAllGarmentPhotoCatalog=true;

    const W=[
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=82'
    ];
    const M=[
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=82',
      'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=700&q=82'
    ];
    const WOMEN=['Blouse','Salwar Suit','Kameez','Saree Blouse','Lehenga','Gown','Dress','Salwar','Choli','School Uniform'];
    const MEN=['Shirt','Pant','Sherwani','Suit','Blazer','Waistcoat','Pajama','Coat','Kurta'];

    const original=window.garmentDesignsFor;
    if(typeof original!=='function')return;

    window.garmentDesignsFor=function(type){
      const list=original(type)||[];
      if(String(type)==='Kurti')return list;
      const pool=MEN.includes(String(type))?M:(WOMEN.includes(String(type))?W:W);
      return list.map(function(d,i){
        return Object.assign({},d,{image:pool[i%pool.length]});
      });
    };
  })();
})();