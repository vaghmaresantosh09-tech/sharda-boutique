(function(){
  'use strict';
  const KEY='silaiGuruBackStack';
  let handling=false;
  function setState(stack){
    try{history.replaceState({[KEY]:true,stack:stack},'',location.href);}catch(e){}
  }
  function closeModalDirect(){
    const m=document.getElementById('modal');
    if(m)m.classList.remove('show');
  }
  window.addEventListener('popstate',function(e){
    if(handling)return;
    const state=e.state||{};
    if(!state[KEY]){
      try{history.pushState({[KEY]:true,stack:[]},'',location.href);}catch(err){}
      return;
    }
    handling=true;
    try{
      const stack=Array.isArray(state.stack)?state.stack.slice():[];
      if(stack.length){
        const current=stack[stack.length-1];
        if(typeof window.openM==='function'){
          window.openM(current);
          setState(stack);
        }
      }else{
        closeModalDirect();
        setState([]);
      }
    }finally{setTimeout(function(){handling=false;},0);}
  },true);
})();
