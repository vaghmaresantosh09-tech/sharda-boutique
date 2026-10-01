/* SILAI GURU — authoritative New Order garment picker.
   Garment selection happens before measurements. One picker, one flow. */
(function(){
  'use strict';
  const LADIES=[['👗','Kurti'],['🥻','Blouse'],['🥻','Saree'],['👚','Salwar Suit'],['✨','Gown'],['💃','Lehenga'],['👗','Frock'],['🩳','Plazo'],['🧥','Jacket'],['🌸','Choli'],['👘','Kameez'],['🎀','Dress']];
  const GENTS=[['👔','Shirt'],['👖','Pant'],['🧥','Kurta'],['🤵','Sherwani'],['🦺','Waistcoat'],['🧥','Blazer'],['🧥','Coat'],['👕','T-Shirt'],['🩳','Shorts'],['🌙','Night Wear'],['🥋','Pajama'],['🎽','Suit']];
  function esc2(v){return typeof window.esc==='function'?window.esc(v):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function icon(name){const hit=LADIES.concat(GENTS).find(x=>x[1]===name);return hit?hit[0]:'✂️';}
  function picker(i){
    return '<div class="garment-card sg-order-garment-picker" id="garment-'+i+'" data-selected-type="" data-removed-measures="[]">'
      +'<div class="garment-head"><div><div class="garment-title">👗 Select Garment</div><div class="muted">Pehle garment select karein, phir uska design aur measurement.</div></div>'+(i>0?'<button type="button" class="remove-g" onclick="removeGarment('+i+')">Remove</button>':'')+'</div>'
      +'<div class="sg-order-category"><button type="button" class="sg-order-cat active" onclick="sgOrderTab('+i+',\'ladies\')">👩 Ladies Garments</button><button type="button" class="sg-order-cat" onclick="sgOrderTab('+i+',\'gents\')">👨 Gents Garments</button></div>'
      +'<div id="sg-order-icons-'+i+'" class="sg-order-icons">'+iconsFor(i,LADIES)+'</div></div>';
  }
  function iconsFor(i,list){return list.map(x=>'<button type="button" class="sg-order-icon" onclick="sgSelectOrderGarment('+i+',\''+esc2(x[1]).replace(/'/g,"\\'")+'\')"><span>'+x[0]+'</span><b>'+esc2(x[1])+'</b></button>').join('');}
  function selectedCard(i,type){
    const names=typeof window.orderMeasurementNames==='function'?window.orderMeasurementNames(type):[];
    const fields=names.map(n=>'<div class="field"><div style="display:flex;align-items:center;justify-content:space-between;gap:6px"><label>'+esc2(n)+'</label><button type="button" class="remove-g sg-remove-measure" onclick="removeOrderMeasurement('+i+',this.dataset.name)" data-name="'+esc2(n)+'" title="Remove this measurement">−</button></div><input class="g-measure" data-name="'+esc2(n)+'" placeholder="inches"></div>').join('');
    return '<div class="garment-card sg-order-selected" id="garment-'+i+'" data-selected-type="'+esc2(type)+'" data-removed-measures="[]">'
      +'<div class="garment-head"><div><div class="garment-title">'+icon(type)+' '+esc2(type)+'</div><div class="muted">Garment selected • ab design select karein</div></div><div style="display:flex;gap:6px"><button type="button" class="secondary" onclick="sgRechooseOrderGarment('+i+')">Change</button>'+(i>0?'<button type="button" class="remove-g" onclick="removeGarment('+i+')">Remove</button>':'')+'</div></div>'
      +'<button type="button" class="sg-design-pick" onclick="sgChooseOrderDesign('+i+',\''+esc2(type).replace(/'/g,"\\'")+'\')">🎨 '+(window.orderDesignTargets&&window.orderDesignTargets[i]?'Change Design':'Select Design')+'</button>'
      +'<div class="section-title">📏 Measurements</div><div class="measure-grid g-fields">'+fields+'</div></div>';
  }
  window.sgSelectOrderGarment=function(i,type){const card=document.getElementById('garment-'+i);if(!card)return;card.outerHTML=selectedCard(i,type);if(typeof window.openDesignCatalogForOrder==='function')setTimeout(()=>window.openDesignCatalogForOrder(type,i),0);};
  window.sgOrderTab=function(i,tab){const box=document.getElementById('garment-'+i);if(!box)return;box.querySelectorAll('.sg-order-cat').forEach((b,n)=>b.classList.toggle('active',(tab==='ladies'&&n===0)||(tab==='gents'&&n===1)));const host=document.getElementById('sg-order-icons-'+i);if(host)host.innerHTML=iconsFor(i,tab==='gents'?GENTS:LADIES);};
  window.sgRechooseOrderGarment=function(i){const c=document.getElementById('garment-'+i);if(c)c.outerHTML=picker(i);};
  window.sgChooseOrderDesign=function(i,type){if(typeof window.openDesignCatalogForOrder==='function')window.openDesignCatalogForOrder(type,i);};
  window.garmentCard=function(i,type){return type?selectedCard(i,type):picker(i);};
  window.initGarments=function(){const w=document.getElementById('garmentsWrap');if(w&&!w.children.length)w.innerHTML=picker(0);};
  window.addGarment=function(){const w=document.getElementById('garmentsWrap');if(!w)return;const i=w.children.length;w.insertAdjacentHTML('beforeend',picker(i));};
  document.addEventListener('submit',function(e){if(e.target&&e.target.id==='orderForm'){const bad=[...document.querySelectorAll('#garmentsWrap .garment-card')].some(c=>!(c.dataset.selectedType||'').trim());if(bad){e.preventDefault();alert('Please select a garment before saving the order.');}}},true);
})();
