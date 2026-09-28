(function(){
'use strict';
const PANEL_ID='sgSeparateMeasurements';
let lastWrap=null;
function isOrder(){const m=document.getElementById('modal');return !!(m&&m.classList.contains('show')&&document.getElementById('garmentsWrap'));}
function cards(){return Array.from(document.querySelectorAll('#garmentsWrap .garment-card'));}
function type(c){const r=c.querySelector('input[name^="garmentType"]:checked');if(r)return r.value;const s=c.querySelector('select.g-type,select');return s?s.value:'Garment';}
function render(){
 const w=document.getElementById('garmentsWrap'); if(!w)return;
 const add=w.parentNode.querySelector('.add-g');
 if(add) add.style.display='block';
 let p=document.getElementById(PANEL_ID);
 if(!p){p=document.createElement('section');p.id=PANEL_ID;p.className='sg-measure-panel';}
 const cs=cards();
 if(!cs.length){p.innerHTML='<div class="sg-measure-title">📏 Measurements</div><div class="sg-measure-empty">Pehle garment add karein.</div>';if(add)add.insertAdjacentElement('afterend',p);else w.insertAdjacentElement('afterend',p);return;}
 let i=Math.max(0,Math.min(Number(p.dataset.active||0),cs.length-1));p.dataset.active=i;
 p.innerHTML='<div class="sg-measure-title">📏 Measurements</div><div class="sg-measure-sub">Garments section ke neeche yahan garment-wise measurements bharein.</div><div class="sg-measure-tabs"></div><div class="sg-measure-body"></div>';
 const tabs=p.querySelector('.sg-measure-tabs');
 cs.forEach((c,n)=>{const b=document.createElement('button');b.type='button';b.className='sg-measure-tab'+(n===i?' active':'');b.textContent='Garment '+(n+1)+' • '+type(c);b.addEventListener('click',()=>{p.dataset.active=n;render()});tabs.appendChild(b)});
 const src=cs[i].querySelector('.measure-grid');const body=p.querySelector('.sg-measure-body');
 if(!src){body.innerHTML='<div class="sg-measure-empty">Is garment ke liye measurement fields nahi mile.</div>';}else{const clone=src.cloneNode(true);clone.style.display='grid';clone.querySelectorAll('input,select,textarea').forEach((x,n)=>{const originals=src.querySelectorAll('input,select,textarea');const o=originals[n];if(o){x.value=o.value;x.addEventListener('input',()=>o.value=x.value);x.addEventListener('change',()=>o.value=x.value)}});body.appendChild(clone)}
 if(add)add.insertAdjacentElement('afterend',p);else w.insertAdjacentElement('afterend',p);
}
function install(){if(!isOrder())return;const w=document.getElementById('garmentsWrap');if(!w)return;if(lastWrap!==w){lastWrap=w;new MutationObserver(()=>setTimeout(render,50)).observe(w,{childList:true,subtree:true})}render();}
const s=document.createElement('style');s.textContent='.sg-measure-panel{background:#fff;border:1px solid #ddd8ff;border-radius:18px;padding:14px;margin:14px 0}.sg-measure-title{font-size:18px;font-weight:900;color:#5144bd}.sg-measure-sub{font-size:12px;color:#73778c;margin:5px 0 10px}.sg-measure-tabs{display:flex;gap:7px;overflow:auto;padding-bottom:8px}.sg-measure-tab{white-space:nowrap;background:#efeeff;color:#5144bd;border:1px solid #ddd8ff;padding:8px 10px;border-radius:12px;font-size:11px;font-weight:800}.sg-measure-tab.active{background:#5b4bdb;color:#fff}.sg-measure-body .measure-grid{display:grid!important;margin-top:4px}.sg-measure-empty{text-align:center;color:#73778c;padding:16px}.garment-card .measure-grid{display:none!important}';document.head.appendChild(s);setInterval(install,300);
})();
