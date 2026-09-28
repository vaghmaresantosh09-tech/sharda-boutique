/* SILAI GURU — robust Android/browser Back navigation using URL hash history */
(function(){
  'use strict';

  const PREFIX='sg-screen=';
  let restoring=false;
  let navigating=false;

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

  function viewFromScreen(){
    const el=document.getElementById('mt');
    const raw=String(el&&el.textContent||'').trim();
    if(titleMap[raw]) return titleMap[raw];
    if(/^📏 .+ Measurements$/.test(raw)) return 'garment-measurement-editor:'+raw.slice(3,-13);
    if(/^🧵 .+ Services$/.test(raw)) return 'garment-services:'+raw.slice(3,-9);
    if(/^👗 .+ Designs$/.test(raw)) return 'design-catalog:'+raw.slice(3,-8);
    if(raw==='📁 My Garment Folder') return 'garment-folder';
    if(raw) return 'custom:'+raw;
    return null;
  }

  function getHashView(){
    const h=String(location.hash||'');
    if(h.indexOf('#'+PREFIX)===0){
      try{return decodeURIComponent(h.slice(('#'+PREFIX).length));}catch(e){return h.slice(('#'+PREFIX).length);}
    }
    return null;
  }

  function setHashView(view,replace){
    if(!view)return;
    const hash='#'+PREFIX+encodeURIComponent(view);
    if(location.hash===hash)return;
    if(replace){
      try{ history.replaceState(null,'',location.pathname+location.search+hash); }catch(e){ location.hash=hash; }
    }else{
      location.hash=hash;
    }
  }

  function pushCurrentView(){
    if(restoring || navigating)return;
    const view=viewFromScreen();
    if(!view)return;
    setHashView(view,false);
  }

  /* Called directly by the app's real navigation functions. This is synchronous. */
  window.__sgRecordView=function(view){
    if(restoring)return;
    if(!view)return;
    setHashView(String(view),false);
  };

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function' || fn.__sgBackWrapped)return;

    function wrapped(){
      const wasNavigating=navigating;
      navigating=true;
      let result;
      try{ result=fn.apply(this,arguments); }
      finally{ navigating=wasNavigating; }
      if(!restoring && !wasNavigating) pushCurrentView();
      return result;
    }
    wrapped.__sgBackWrapped=true;
    window[name]=wrapped;
  }

  function installWrappers(){
    [
      'openM','openGarmentsManager','openGarmentMeasurementManager',
      'openGarmentMeasurementEditor','openGarmentServiceEditor',
      'openGarmentLibrary','openDesignCatalog','openGarmentFolder'
    ].forEach(wrap);

    const close=window.closeM;
    if(typeof close==='function' && !close.__sgBackWrapped){
      function wrappedClose(){
        if(restoring) return close.apply(this,arguments);
        if(getHashView()){
          try{ history.back(); return; }catch(e){}
        }
        return close.apply(this,arguments);
      }
      wrappedClose.__sgBackWrapped=true;
      window.closeM=wrappedClose;
    }
  }

  function findGarmentIndex(name){
    try{
      const a=typeof window.getGarmentMaster==='function'?window.getGarmentMaster():[];
      return a.findIndex(g=>String(g.name)===String(name));
    }catch(e){ return -1; }
  }

  function restore(view){
    restoring=true;
    try{
      if(!view){
        const m=document.getElementById('modal');
        if(m)m.classList.remove('show');
        return;
      }

      if(view==='garment-measurements' && typeof window.openGarmentMeasurementManager==='function'){
        window.openGarmentMeasurementManager(); return;
      }
      if(view==='garments' && typeof window.openGarmentsManager==='function'){
        window.openGarmentsManager(); return;
      }
      if(view.indexOf('garment-measurement-editor:')===0){
        const i=findGarmentIndex(view.slice(27));
        if(i>=0 && typeof window.openGarmentMeasurementEditor==='function') window.openGarmentMeasurementEditor(i);
        return;
      }
      if(view.indexOf('garment-services:')===0){
        const i=findGarmentIndex(view.slice(17));
        if(i>=0 && typeof window.openGarmentServiceEditor==='function') window.openGarmentServiceEditor(i);
        return;
      }
      if(view.indexOf('design-catalog:')===0 && typeof window.openDesignCatalog==='function'){
        window.openDesignCatalog(view.slice(15)); return;
      }
      if(view==='garment-folder' && typeof window.openGarmentFolder==='function'){
        window.openGarmentFolder(); return;
      }
      if(/^[a-z-]+$/.test(view) && typeof window.openM==='function'){
        window.openM(view); return;
      }

      const m=document.getElementById('modal');
      if(m)m.classList.remove('show');
    }finally{
      restoring=false;
    }
  }

  window.addEventListener('hashchange',function(){
    restore(getHashView());
  },true);

  /* If a screen hash already exists, restore it after the app's functions load. */
  setTimeout(function(){
    const existing=getHashView();
    if(existing) restore(existing);
  },50);

  installWrappers();
  setTimeout(installWrappers,100);
  setTimeout(installWrappers,500);
  setInterval(installWrappers,1000);
})();