/* SILAI GURU — clean navigation + New Order garment selection
   New Order garment buttons select a garment only.
   They NEVER open Design Library.
   Design Library is opened only from its dedicated library/folder flow. */
(function(){
  'use strict';
  var KEY='__silaiGuruCleanView';
  var restoring=false;
  function getState(){return history.state&&history.state[KEY]?history.state:null;}
  function push(view){
    if(restoring)return;
    var s=getState();
    if(s&&s.view===view)return;
    try{history.pushState({[KEY]:true,view:view},'',location.href)}catch(e){}
  }
  function wrapDesignCatalog(){
    if(window.__sgCleanDesignWrapped || typeof window.openDesignCatalog!=='function')return;
    window.__sgCleanDesignWrapped=true;
    var original=window.openDesignCatalog;
    window.openDesignCatalog=function(type){
      var name=String(type||'').trim();
      if(name)push('design-catalog:'+name);
      return original.apply(this,arguments);
    };
  }
  function clean(v){return String(v||'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/\s+/g,' ').trim();}
  function selectGarment(el){
    if(!el)return;
    var b=el.querySelector('b');
    var name=clean(b?b.textContent:el.textContent);
    if(!name || /^All Garments$/i.test(name))return;
    document.querySelectorAll('.sg-type-icon').forEach(function(x){x.classList.remove('active');});
    el.classList.add('active');
    var scope=el.closest('.sheet,.modal,.card,form')||document;
    Array.from(scope.querySelectorAll('select')).forEach(function(sel){
      var opt=Array.from(sel.options||[]).find(function(o){return clean(o.textContent).toLowerCase()===name.toLowerCase() || clean(o.value).toLowerCase()===name.toLowerCase();});
      if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));}
    });
    try{
      if(typeof window.__sgSetGarmentType==='function')window.__sgSetGarmentType(name);
      else if(typeof window.setGarmentType==='function')window.setGarmentType(name);
      else if(typeof window.selectGarmentType==='function')window.selectGarmentType(name);
    }catch(e){}
    try{localStorage.setItem('__silaiGuruSelectedGarment',name);}catch(e){}
  }
  function installGarmentSelection(){
    if(window.__sgGarmentSelectionInstalled)return;
    window.__sgGarmentSelectionInstalled=true;
    document.addEventListener('click',function(e){
      var el=e.target&&e.target.closest?e.target.closest('.sg-type-icon'):null;
      if(!el)return;
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      selectGarment(el);
    },true);
  }
  function init(){
    try{if(!getState())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){}
    wrapDesignCatalog();
    installGarmentSelection();
    setTimeout(wrapDesignCatalog,100);
    setTimeout(wrapDesignCatalog,500);
  }
  window.addEventListener('load',init);
  window.addEventListener('popstate',function(e){
    var s=e&&e.state;
    if(!s||!s[KEY])return;
    if(s.view&&s.view.indexOf('design-catalog:')===0 && typeof window.openDesignCatalog==='function'){
      restoring=true;
      try{window.openDesignCatalog(s.view.slice(15))}finally{restoring=false;}
    }else if(s.view==='dashboard'){
      var m=document.getElementById('modal');if(m)m.classList.remove('show');
    }
  });
})();
