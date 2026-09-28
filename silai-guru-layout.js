(function(){
  'use strict';
  const PANEL_ID='sgSeparateMeasurements';
  let lastWrap=null;
  function activeOrder(){
    const modal=document.getElementById('modal');
    const wrap=document.getElementById('garmentsWrap');
    return modal && modal.classList.contains('show') && wrap;
  }
  function getType(card){
    const r=card.querySelector('input[name^="garmentType"]:checked');
    if(r) return r.value;
    const s=card.querySelector('select.g-type, select');
    return s?s.value:'Garment';
  }
  function cards(){return Array.from(document.querySelectorAll('#garmentsWrap .garment-card'));}
  function syncClone(clone,original){
    clone.querySelectorAll('[data-measure]').forEach(inp=>{
      const key=inp.getAttribute('data-measure');
      const src=original.querySelector('[data-measure="'+CSS.escape(key)+'"]');
      if(src) inp.value=src.value;
      inp.addEventListener('input',()=>{if(src)src.value=inp.value;});
      inp.addEventListener('change',()=>{if(src)src.value=inp.value;});
    });
  }
  function renderPanel(){
    const wrap=document.getElementById('garmentsWrap');
    if(!wrap) return;
    let panel=document.getElementById(PANEL_ID);
    if(!panel){
      panel=document.createElement('div');
      panel.id=PANEL_ID;
      panel.className='sg-measure-panel';
      const addButton=wrap.parentNode.querySelector('.add-g');
      if(addButton) addButton.parentNode.insertBefore(panel,addButton.nextSibling);
      else wrap.parentNode.insertBefore(panel,wrap.nextSibling);
    }
    const cs=cards();
    if(!cs.length){panel.innerHTML='<div class="sg-measure-empty">Pehle garment add karein.</div>';return;}
    let idx=Number(panel.dataset.active||0);
    if(idx>=cs.length) idx=cs.length-1;
    panel.dataset.active=idx;
    cs.forEach(c=>{
      c.querySelectorAll('.measure-grid').forEach(g=>g.style.display='none');
    });
    panel.innerHTML='<div class="sg-measure-title">📏 Measurements</div><div class="sg-measure-sub">Garments section ke baad yahan garment-wise measurements bharein.</div><div class="sg-measure-tabs"></div><div class="sg-measure-body"></div>';
    const tabs=panel.querySelector('.sg-measure-tabs');
    cs.forEach((c,i)=>{
      const b=document.createElement('button');
      b.type='button'; b.className='sg-measure-tab'+(i===idx?' active':'');
      b.textContent='Garment '+(i+1)+' • '+getType(c);
      b.onclick=()=>{panel.dataset.active=i;renderPanel();};
      tabs.appendChild(b);
    });
    const card=cs[idx];
    const src=card.querySelector('.measure-grid');
    const body=panel.querySelector('.sg-measure-body');
    if(src){
      const clone=src.cloneNode(true);
      clone.style.display='grid';
      body.appendChild(clone);
      syncClone(clone,card);
    }else body.innerHTML='<div class="sg-measure-empty">Is garment ke liye measurement fields nahi mile.</div>';
  }
  function install(){
    const wrap=document.getElementById('garmentsWrap');
    if(!wrap) return;
    if(lastWrap!==wrap){
      lastWrap=wrap;
      const mo=new MutationObserver(()=>{setTimeout(renderPanel,30);});
      mo.observe(wrap,{childList:true,subtree:true});
    }
    cards().forEach(c=>{
      if(c.dataset.sgMeasureBound==='1') return;
      c.dataset.sgMeasureBound='1';
      c.addEventListener('change',e=>{
        if(e.target.matches('input[name^="garmentType"],select')) setTimeout(renderPanel,30);
      });
    });
    renderPanel();
  }
  const css=document.createElement('style');
  css.textContent='.sg-measure-panel{background:#fff;border:1px solid #ddd8ff;border-radius:18px;padding:14px;margin:12px 0}.sg-measure-title{font-size:18px;font-weight:900;color:#5144bd}.sg-measure-sub{font-size:12px;color:#73778c;margin:5px 0 10px}.sg-measure-tabs{display:flex;gap:7px;overflow:auto;padding-bottom:7px}.sg-measure-tab{white-space:nowrap;background:#efeeff;color:#5144bd;border:1px solid #ddd8ff;padding:8px 10px;border-radius:12px;font-size:11px;font-weight:800}.sg-measure-tab.active{background:#5b4bdb;color:#fff;border-color:#5b4bdb}.sg-measure-body .measure-grid{display:grid!important;margin-top:4px}.sg-measure-empty{text-align:center;color:#73778c;padding:16px}.garment-card .measure-grid{display:none!important}';
  document.head.appendChild(css);
  setInterval(()=>{if(activeOrder()) install();},500);

  /* In-app Back navigation.
     Every openM() screen gets one history entry. Android/browser Back therefore
     returns to the previous Silai Guru screen instead of exiting the app. */
  const SG_BACK_KEY='silaiGuruBackStack';
  let sgStack=[];
  let sgNavigating=false;
  let sgReady=false;

  function currentModalType(){
    const modal=document.getElementById('modal');
    if(!modal || !modal.classList.contains('show')) return null;
    const title=(document.getElementById('mt')||{}).textContent||'';
    const map={
      'Customers':'customers','New Order':'order','Orders':'orders',
      'Garments':'garments','Measurements':'measurements','Workers':'workers',
      'Offers':'offers','Shop Profile':'profile','Backup':'backup',
      'Settings':'settings','Plans & Upgrade':'plans'
    };
    return map[title]||null;
  }

  function pushScreen(type){
    if(!type || sgNavigating) return;
    sgStack.push(type);
    try{
      history.pushState({[SG_BACK_KEY]:true,stack:sgStack.slice()},'',location.href);
    }catch(e){}
  }

  function restoreScreen(type){
    if(!type || typeof window.openM!=='function') return;
    sgNavigating=true;
    try{window.openM(type);}catch(e){}
    sgNavigating=false;
  }

  function setupBackNavigation(){
    if(sgReady) return;
    sgReady=true;
    try{
      const st=history.state;
      if(!st || !st[SG_BACK_KEY]){
        history.replaceState({...(st||{}),[SG_BACK_KEY]:true,stack:[]},'',location.href);
      }
    }catch(e){}

    const originalOpenM=window.openM;
    const originalCloseM=window.closeM;
    if(typeof originalOpenM==='function'){
      window.openM=function(type){
        const result=originalOpenM.apply(this,arguments);
        pushScreen(type);
        return result;
      };
    }
    if(typeof originalCloseM==='function'){
      window.closeM=function(){
        if(sgNavigating){return originalCloseM.apply(this,arguments);}
        if(sgStack.length){
          history.back();
          return;
        }
        return originalCloseM.apply(this,arguments);
      };
    }

    window.addEventListener('popstate',function(e){
      const state=e.state||{};
      if(!state[SG_BACK_KEY]){
        try{history.pushState({[SG_BACK_KEY]:true,stack:sgStack.slice()},'',location.href);}catch(err){}
        return;
      }
      if(sgStack.length){
        sgStack.pop();
        const previous=sgStack.length?sgStack[sgStack.length-1]:null;
        if(previous){
          restoreScreen(previous);
        }else if(typeof originalCloseM==='function'){
          sgNavigating=true;
          originalCloseM();
          sgNavigating=false;
        }
        try{history.replaceState({[SG_BACK_KEY]:true,stack:sgStack.slice()},'',location.href);}catch(err){}
      }else{
        try{history.pushState({[SG_BACK_KEY]:true,stack:[]},'',location.href);}catch(err){}
      }
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setupBackNavigation,{once:true});
  else setupBackNavigation();
})();
