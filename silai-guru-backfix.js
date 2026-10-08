/* SILAI GURU — in-app navigation history v3
   Primary navigation is browser history; an internal stack is kept as a safe fallback.
*/
(function(){
  'use strict';
  var KEY='__silaiGuruCleanView';
  var restoring=false;
  var stack=[];
  try{stack=JSON.parse(sessionStorage.getItem('__sgNavStack')||'[]');if(!Array.isArray(stack))stack=[];}catch(e){stack=[];}

  function getState(){
    var s=history.state;
    return s&&s[KEY]?s:null;
  }
  function current(){
    var s=getState();
    return s&&s.view?s.view:(stack.length?stack[stack.length-1]:null);
  }
  function persist(){
    try{sessionStorage.setItem('__sgNavStack',JSON.stringify(stack));}catch(e){}
  }
  function syncBackButton(){
    var b=document.getElementById('modalBack'),m=document.getElementById('modal');
    if(!b)return;
    var v=current();
    b.classList.toggle('show',!!(m&&m.classList.contains('show')&&v&&v!=='dashboard'));
  }
  function push(view){
    view=String(view||'dashboard');
    if(restoring)return;
    var cur=current();
    if(cur===view){syncBackButton();return;}
    if(!stack.length||stack[stack.length-1]!==view)stack.push(view);
    persist();
    try{
      history.pushState({[KEY]:true,view:view},'',location.href);
    }catch(e){
      try{history.replaceState({[KEY]:true,view:view},'',location.href)}catch(_){}
    }
    syncBackButton();
  }
  function hideModal(){
    var m=document.getElementById('modal');
    if(m)m.classList.remove('show');
    syncBackButton();
  }
  function restore(view){
    restoring=true;
    try{
      view=String(view||'dashboard');
      if(view==='dashboard'){hideModal();return;}
      if(view==='designs'&&typeof window.openGarmentLibrary==='function'){window.openGarmentLibrary();return;}
      if(view==='garment-folder'&&typeof window.openGarmentFolder==='function'){window.openGarmentFolder();return;}
      if(view.indexOf('design-catalog:')===0&&typeof window.openDesignCatalog==='function'){window.openDesignCatalog(view.slice(15));return;}
      if(view.indexOf('design-preview:')===0&&typeof window.showDesignToCustomer==='function'){
        var p=view.slice(15).split(':');window.showDesignToCustomer(p.shift(),p.join(':'),undefined);return;
      }
      if(view.indexOf('order-design:')===0&&typeof window.openDesignCatalogForOrder==='function'){
        var p2=view.slice(13).split(':');window.openDesignCatalogForOrder(p2[1],Number(p2[0]));return;
      }
      if(view.indexOf('order-preview:')===0&&typeof window.showDesignToCustomer==='function'){
        var p3=view.slice(14).split(':');window.showDesignToCustomer(p3[1],p3.slice(2).join(':'),Number(p3[0]));return;
      }
      if(view==='garment-measurements'&&typeof window.openGarmentMeasurementManager==='function'){window.openGarmentMeasurementManager();return;}
      if(view.indexOf('garment-measurement-editor:')===0&&typeof window.openGarmentMeasurementEditor==='function'){
        var name=view.slice(27),a=typeof window.getGarmentMaster==='function'?window.getGarmentMaster():[];
        var i=a.findIndex(function(g){return g.name===name});if(i>=0)window.openGarmentMeasurementEditor(i);return;
      }
      if(view.indexOf('garment-services:')===0&&typeof window.openGarmentServiceEditor==='function'){
        var n=view.slice(17),a2=typeof window.getGarmentMaster==='function'?window.getGarmentMaster():[];
        var j=a2.findIndex(function(g){return g.name===n});if(j>=0)window.openGarmentServiceEditor(j);return;
      }
      var simple=['order','customers','orders','measure','payments','delivery','reports','profile','backup','workers','garments','settings','plans'];
      if(simple.indexOf(view)>=0&&typeof window.openM==='function'){window.openM(view);return;}
    }finally{
      restoring=false;
      setTimeout(syncBackButton,0);
    }
  }
  window.__sgRecordView=push;

  window.__sgGoBack=function(){
    var s=getState(),v=s&&s.view;
    if(v&&v!=='dashboard'){
      try{history.back();return;}catch(e){}
    }
    if(stack.length>1){
      stack.pop();
      var prev=stack[stack.length-1]||'dashboard';
      persist();
      restore(prev);
    }else{
      hideModal();
    }
  };

  try{
    var s=getState();
    if(!s){
      history.replaceState({[KEY]:true,view:'dashboard'},'',location.href);
      stack=['dashboard'];
      persist();
    }else if(!stack.length){
      stack=[s.view||'dashboard'];
      persist();
    }
  }catch(e){if(!stack.length)stack=['dashboard'];}

  window.addEventListener('popstate',function(e){
    var s=e&&e.state;
    if(s&&s[KEY]){
      var target=s.view||'dashboard';
      while(stack.length&&stack[stack.length-1]!==target)stack.pop();
      if(!stack.length)stack=['dashboard'];
      persist();
      restore(target);
    }else{
      stack=['dashboard'];
      persist();
      hideModal();
    }
  });

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#modalBack'):null;
    if(b){e.preventDefault();e.stopPropagation();}
  },true);

  function observe(){
    syncBackButton();
    var m=document.getElementById('modal');
    if(m&&!m.__sgNavObserver){
      m.__sgNavObserver=true;
      new MutationObserver(function(){syncBackButton()}).observe(m,{attributes:true,attributeFilter:['class']});
    }
  }
  observe();
  new MutationObserver(observe).observe(document.documentElement,{childList:true,subtree:true});
})();