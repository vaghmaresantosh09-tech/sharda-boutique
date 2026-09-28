/* SILAI GURU — deterministic Android/browser Back navigation */
(function(){
  'use strict';

  const KEY='silaiGuruBackStack';
  let ready=false;
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

  function setState(view){
    try{ history.replaceState({[KEY]:true,view:view||'dashboard'},'',location.href); }catch(e){}
  }

  function pushView(view){
    if(!view || restoring || navigating) return;
    try{
      const s=history.state||{};
      if(s[KEY] && s.view===view) return;
      history.pushState({[KEY]:true,view:view},'',location.href);
    }catch(e){}
  }

  function ensureGuard(){
    if(ready)return;
    ready=true;
    try{
      /* Current page is the dashboard. Do not push an extra entry here. */
      history.replaceState({[KEY]:true,view:'dashboard'},'',location.href);
    }catch(e){}
  }

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function' || fn.__sgBackWrapped)return;

    function wrapped(){
      const wasNavigating=navigating;
      navigating=true;
      let result;
      try{ result=fn.apply(this,arguments); }
      finally{
        navigating=wasNavigating;
      }
      if(!restoring && !wasNavigating){
        setTimeout(function(){ pushView(viewFromScreen()); },0);
      }
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
        const s=history.state||{};
        if(s[KEY] && s.view && s.view!=='dashboard'){
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
      if(!view || view==='dashboard'){
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

      /* Unknown/custom screen: keep the modal closed rather than jumping Home. */
      const m=document.getElementById('modal');
      if(m)m.classList.remove('show');
    }finally{
      restoring=false;
    }
  }

  window.addEventListener('popstate',function(e){
    const state=e&&e.state||{};
    if(!state[KEY]){
      /* User has navigated outside the app. Let the browser continue normally. */
      return;
    }
    restore(state.view||'dashboard');
  },true);

  ensureGuard();
  installWrappers();
  setTimeout(installWrappers,100);
  setTimeout(installWrappers,500);
  setInterval(installWrappers,1000);
})();