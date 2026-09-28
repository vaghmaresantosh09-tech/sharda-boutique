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

  /* This is called by the actual navigation functions in silai-guru.html. */
  window.__sgRecordView=function(view){
    if(restoring || !view)return;
    const v=String(view);
    const s=state();
    if(s && s.view===v)return;
    history.pushState({[KEY]:true,view:v},'',location.href);
  };

  /* The first page is the real Dashboard entry. */
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
})();