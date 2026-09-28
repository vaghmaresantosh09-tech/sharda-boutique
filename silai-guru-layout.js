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
      wrap.parentNode.insertBefore(panel,wrap.nextElementSibling);
    }
    const cs=cards();
    if(!cs.length){panel.innerHTML='<div class="sg-measure-empty">Pehle garment add karein.</div>';return;}
    let idx=Number(panel.dataset.active||0);
    if(idx>=cs.length) idx=cs.length-1;
    panel.dataset.active=idx;
    cs.forEach((c,i)=>{
      c.querySelectorAll('.measure-grid').forEach(g=>g.style.display='none');
    });
    panel.innerHTML='<div class="sg-measure-title">📏 Measurements</div><div class="sg-measure-sub">Jis garment ki measurement bharni hai, usko select karein.</div><div class="sg-measure-tabs"></div><div class="sg-measure-body"></div>';
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
})();
