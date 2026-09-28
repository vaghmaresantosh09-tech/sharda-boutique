(function(){
  'use strict';

  const KEY='silaiGuruBackStack';
  let stack=[];
  let handling=false;
  let restoring=false;
  let ready=false;

  const titleMap={
    '➕ New Order':'order','New Order':'order',
    '👥 Customers':'customers','Customers':'customers',
    '📋 Orders':'orders','Orders':'orders',
    '📏 Measurements':'measurements','Measurements':'measurements',
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
    if(titleMap[raw])return titleMap[raw];
    if(/^📏 .+ Measurements$/.test(raw))return 'garment-measurement-editor:'+raw.slice(3,-13);
    if(/^🧵 .+ Services$/.test(raw))return 'garment-services:'+raw.slice(3,-9);
    if(/^👗 .+ Designs$/.test(raw))return 'design-catalog:'+raw.slice(3,-8);
    if(raw)return 'custom:'+raw;
    return null;
  }

  function writeState(){
    try{history.replaceState({[KEY]:true,stack:stack.slice()},'',location.href);}catch(e){}
  }

  function ensureGuard(){
    if(ready)return;
    ready=true;
    try{
      const st=history.state;
      if(!st || !st[KEY]){
        stack=[];
        history.replaceState({[KEY]:true,stack:[]},'',location.href);
        history.pushState({[KEY]:true,stack:[]},'',location.href);
      }else{
        stack=Array.isArray(st.stack)?st.stack.slice():[];
        /* Always create a real same-page guard entry for the current app. */
        history.pushState({[KEY]:true,stack:stack.slice()},'',location.href);
      }
    }catch(e){}
  }

  function recordView(key){
    if(!key || restoring || handling)return;
    if(stack[stack.length-1]===key){
      writeState();
      return;
    }
    stack.push(key);
    writeState();
  }

  function closeDirect(){
    const m=document.getElementById('modal');
    if(m)m.classList.remove('show');
  }

  function wrap(name){
    const fn=window[name];
    if(typeof fn!=='function' || fn.__sgBackWrapped)return;
    function wrapped(){
      const result=fn.apply(this,arguments);
      if(!restoring) setTimeout(()=>recordView(currentView()),0);
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
        if(restoring)return close.apply(this,arguments);
        if(stack.length){
          try{history.back();}catch(e){close.apply(this,arguments);}
          return;
        }
        return close.apply(this,arguments);
      }
      wrappedClose.__sgBackWrapped=true;
      window.closeM=wrappedClose;
    }
  }

  window.addEventListener('popstate',function(e){
    if(handling)return;
    if(e && e.stopImmediatePropagation)e.stopImmediatePropagation();

    handling=true;
    try{
      const state=e.state||{};
      if(!state[KEY]){
        stack=[];
        closeDirect();
        writeState();
        return;
      }

      const target=Array.isArray(state.stack)?state.stack.slice():[];
      stack=target;

      if(stack.length){
        const view=stack[stack.length-1];
        restoring=true;
        try{
          if(view==='garments' && typeof window.openGarmentsManager==='function') window.openGarmentsManager();
          else if(view==='garment-measurements' && typeof window.openGarmentMeasurementManager==='function') window.openGarmentMeasurementManager();
          else if(typeof window.openM==='function' && /^[a-z-]+$/.test(view)) window.openM(view);
          else closeDirect();
        }finally{restoring=false;}
      }else{
        closeDirect();
      }
      writeState();
    }finally{
      setTimeout(()=>{handling=false;},0);
    }
  },true);

  ensureGuard();
  installWrappers();
  setTimeout(installWrappers,100);
  setTimeout(installWrappers,500);
  setInterval(installWrappers,1000);
})();