(function(){
  'use strict';
  const ROOT_ID='sg-direct-order-layout';
  function addDefaultGarment(){
    const wrap=document.getElementById('garmentsWrap');
    if(!wrap || wrap.children.length) return;
    if(typeof window.garmentCard==='function'){
      try{ wrap.insertAdjacentHTML('beforeend', window.garmentCard(0,'Kurti')); return; }catch(e){}
    }
    const card=document.createElement('div');
    card.className='garment-card';
    card.innerHTML='<div class="garment-head"><div class="garment-title">Garment 1 • Kurti</div></div><div class="field"><label>Garment Type</label><select class="g-type"><option selected>Kurti</option><option>Blouse</option><option>Pant</option><option>Plazo</option><option>Shirt</option><option>Blazer</option><option>Salwar</option><option>Dress</option><option>Lehenga</option><option>Gown</option><option>Other</option></select></div><div class="measure-grid">'+['Height','Shoulder','Armhole','Upper Chest','Chest','Waist','Hip','Neck Front','Neck Back','Sleeve'].map(function(x){return '<div class="field"><label>'+x+'</label><input class="g-measure" data-name="'+x+'"></div>';}).join('')+'</div>';
    wrap.appendChild(card);
  }
  function ensureDirectOrder(){
    const modal=document.getElementById('modal');
    const title=document.getElementById('mt');
    if(!modal || !modal.classList.contains('show') || !title || title.textContent.trim()!=='New Order') return;
    const wrap=document.getElementById('garmentsWrap');
    if(!wrap) return;
    addDefaultGarment();
    let add=document.getElementById('sgDirectAddGarment');
    if(!add){
      add=document.createElement('button');
      add.type='button'; add.id='sgDirectAddGarment'; add.className='add-g'; add.textContent='＋ Add Another Garment';
      wrap.insertAdjacentElement('afterend',add);
      add.addEventListener('click',function(){
        if(typeof window.garmentCard==='function'){
          const idx=wrap.children.length;
          try{wrap.insertAdjacentHTML('beforeend',window.garmentCard(idx,'Kurti'));return;}catch(e){}
        }
        const copy=wrap.firstElementChild;
        if(copy){const clone=copy.cloneNode(true);wrap.appendChild(clone);}
      });
    }
    const source=document.getElementById('orderDesignSourceArea');
    if(source && add.nextElementSibling!==source) add.insertAdjacentElement('afterend',source);
    if(typeof window.renderPanel==='function') window.renderPanel();
  }
  const mo=new MutationObserver(function(){setTimeout(ensureDirectOrder,50);});
  function start(){
    mo.observe(document.body,{childList:true,subtree:true});
    setInterval(ensureDirectOrder,500);
    ensureDirectOrder();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
