/* SILAI GURU — clean navigation fix
   Garment selection in New Order NEVER opens Design Library.
   Design Library is opened only from its dedicated Design button/folder. */
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
  function init(){
    try{if(!getState())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){}
    wrapDesignCatalog();
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
