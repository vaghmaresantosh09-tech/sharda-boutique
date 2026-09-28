(function(){
  'use strict';

  /* Single Android/browser Back guard.
     silai-guru-layout.js owns the screen stack and wraps openM().
     This listener is capture-phase so the older listener in layout.js cannot
     also process the same popstate event. */
  const KEY='silaiGuruBackStack';
  let handling=false;
  let ready=false;

  function baseState(){
    return {[KEY]:true,stack:[]};
  }

  function replaceState(stack){
    try{
      history.replaceState({[KEY]:true,stack:Array.isArray(stack)?stack.slice():[]},'',location.href);
    }catch(e){}
  }

  function ensureGuardEntry(){
    if(ready)return;
    ready=true;
    try{
      const st=history.state;
      if(!st || !st[KEY]){
        history.replaceState(baseState(),'',location.href);
        /* Create a real guard entry. Android/browser Back now reaches this
           entry first instead of leaving the app immediately. */
        history.pushState(baseState(),'',location.href);
      }else if(!Array.isArray(st.stack)){
        replaceState([]);
      }
    }catch(e){}
  }

  function closeModalDirect(){
    const m=document.getElementById('modal');
    if(m)m.classList.remove('show');
  }

  window.addEventListener('popstate',function(e){
    if(handling)return;

    /* Prevent the older bubble-phase back handler from running too. */
    if(e && typeof e.stopImmediatePropagation==='function') e.stopImmediatePropagation();

    handling=true;
    try{
      const state=e.state||{};
      if(!state[KEY]){
        /* A history entry outside SILAI GURU was reached. Reinsert our guard
           and keep the current app page visible. */
        replaceState([]);
        try{history.pushState(baseState(),'',location.href);}catch(err){}
        return;
      }

      const stack=Array.isArray(state.stack)?state.stack.slice():[];

      if(stack.length){
        const previous=stack[stack.length-1];
        if(typeof window.openM==='function'){
          /* layout.js has already removed the current screen from its local
             stack through its own logic; suppress duplicate browser history
             changes by using a direct view restore flag. */
          window.__sgBackRestoring=true;
          try{window.openM(previous);}finally{window.__sgBackRestoring=false;}
        }
        replaceState(stack);
      }else{
        closeModalDirect();
        replaceState([]);
      }
    }finally{
      setTimeout(function(){handling=false;},0);
    }
  },true);

  ensureGuardEntry();
})();