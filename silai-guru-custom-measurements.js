(function(){
'use strict';
var STYLE_ID='sg-custom-measure-style-v1';
function addStyle(){if(document.getElementById(STYLE_ID))return;var s=document.createElement('style');s.id=STYLE_ID;s.textContent='.sg-custom-measure{margin-top:10px;padding:10px;border:1px solid #ddd8ff;background:#faf9ff;border-radius:12px}.sg-custom-add{width:100%;background:#efeeff;color:#5144bd;padding:9px;font-size:12px}.sg-custom-editor{margin-top:8px}.sg-custom-row{display:flex;gap:7px;align-items:center}.sg-custom-row input{flex:1}.sg-custom-save{background:#5b4bdb;color:#fff;padding:8px 10px;font-size:12px}.sg-custom-list{display:grid;gap:7px;margin-top:8px}.sg-custom-item{display:flex;align-items:center;gap:7px;background:#fff;border:1px solid #e5e6ef;border-radius:10px;padding:7px}.sg-custom-item b{flex:1;font-size:12px}.sg-custom-item input{width:95px}.sg-custom-remove{background:#ffe9e9;color:#b42318;padding:7px 9px;font-size:11px}.sg-custom-future{font-size:11px;color:#666;display:flex;align-items:center;gap:5px;margin-top:7px}.sg-custom-future input{width:auto}';document.head.appendChild(s)}
function attach(){addStyle();document.querySelectorAll('.measure-grid').forEach(function(grid){if(grid.dataset.customMeasureReady==='1')return;grid.dataset.customMeasureReady='1';var box=document.createElement('div');box.className='sg-custom-measure';box.innerHTML='<button type="button" class="sg-custom-add">＋ Add Custom Measurement</button><div class="sg-custom-editor" hidden><div class="sg-custom-row"><input class="sg-custom-name" placeholder="Measurement name (e.g. Biceps, Mori)"><input class="sg-custom-value" placeholder="Value" inputmode="decimal"><button type="button" class="sg-custom-save">Add</button></div><label class="sg-custom-future"><input type="checkbox" class="sg-custom-future-check"> Future orders me bhi dikhaye</label></div><div class="sg-custom-list"></div>';grid.insertAdjacentElement('afterend',box);var editor=box.querySelector('.sg-custom-editor');box.querySelector('.sg-custom-add').addEventListener('click',function(){editor.hidden=!editor.hidden;if(!editor.hidden)editor.querySelector('.sg-custom-name').focus()});box.querySelector('.sg-custom-save').addEventListener('click',function(){var n=editor.querySelector('.sg-custom-name').value.trim(),v=editor.querySelector('.sg-custom-value').value.trim();if(!n){alert('Measurement ka naam likhiye.');return}if(!v){alert('Measurement value likhiye.');return}var row=document.createElement('div');row.className='sg-custom-item';row.innerHTML='<b></b><input class="sg-custom-item-value"><button type="button" class="sg-custom-remove">−</button>';row.querySelector('b').textContent=n;row.querySelector('.sg-custom-item-value').value=v;row.querySelector('.sg-custom-remove').addEventListener('click',function(){row.remove()});box.querySelector('.sg-custom-list').appendChild(row);if(editor.querySelector('.sg-custom-future-check').checked){try{var a=JSON.parse(localStorage.getItem('sg_custom_measurement_templates')||'[]');if(!a.some(function(x){return x.name===n})){a.push({name:n});localStorage.setItem('sg_custom_measurement_templates',JSON.stringify(a))}}catch(e){}}editor.querySelector('.sg-custom-name').value='';editor.querySelector('.sg-custom-value').value='';editor.hidden=true})})}
new MutationObserver(function(){setTimeout(attach,100)}).observe(document.body,{childList:true,subtree:true});setTimeout(attach,300);

(function installTouchSafeGarmentDesignTapFix(){
  if(window.__sgTouchSafeGarmentDesignFix)return;
  window.__sgTouchSafeGarmentDesignFix=true;
  var lastKey='',lastAt=0;
  function clean(v){return String(v||'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/\s+/g,' ').trim();}
  function openDesign(el){
    if(!el)return;
    var b=el.querySelector('b');
    var type=clean(b?b.textContent:el.textContent);
    if(!type||type==='All Garments')return;
    if(typeof window.openDesignCatalog!=='function')return;
    var now=Date.now(),key=type;
    if(key===lastKey&&now-lastAt<900)return;
    lastKey=key;lastAt=now;
    el.dataset.sgDesignHandled='1';
    setTimeout(function(){
      if(typeof window.__sgRecordView==='function')window.__sgRecordView('design-catalog:'+type);
      window.openDesignCatalog(type);
    },0);
  }
  function handle(e){
    var t=e&&e.target;
    var el=t&&t.closest?t.closest('.sg-type-icon'):null;
    if(!el)return;
    openDesign(el);
  }
  window.addEventListener('pointerup',handle,true);
  window.addEventListener('click',handle,true);
  window.addEventListener('touchend',handle,true);
  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest('.sg-type-icon'):null;
    if(!el)return;
    setTimeout(function(){openDesign(el)},20);
  },false);
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var el=e.target&&e.target.closest?e.target.closest('.sg-type-icon'):null;
    if(!el)return;
    setTimeout(function(){openDesign(el)},20);
  },false);
})();

/* Android-safe Garments screen scrolling/closing fix.
   The Garments library is a fixed modal. The modal keeps vertical gesture
   handling enabled, while the sheet remains the single touch-scroll surface.
   This avoids Android Chrome touch-lock while keeping the overlay contained. */
(function installGarmentScreenTouchFix(){
  if(window.__sgGarmentScreenTouchFix)return;
  window.__sgGarmentScreenTouchFix=true;
  function apply(){
    var modal=document.getElementById('modal');
    if(!modal)return;
    modal.style.touchAction='pan-y';
    modal.style.overscrollBehavior='contain';
    var sheet=modal.querySelector('.sheet');
    if(sheet){
      sheet.style.maxHeight='92vh';
      sheet.style.minHeight='0';
      sheet.style.overflowY='auto';
      sheet.style.overflowX='hidden';
      sheet.style.webkitOverflowScrolling='touch';
      sheet.style.touchAction='pan-y';
      sheet.style.overscrollBehavior='contain';
      sheet.style.pointerEvents='auto';
    }
    var mb=document.getElementById('mb');
    if(mb){mb.style.pointerEvents='auto';mb.style.touchAction='pan-y';}
    var close=modal.querySelector('.close');
    if(close&&!close.dataset.sgCloseReady){
      close.dataset.sgCloseReady='1';
      function doClose(e){
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
        if(typeof window.closeM==='function')window.closeM();else modal.classList.remove('show');
      }
      close.addEventListener('pointerup',doClose,true);
      close.addEventListener('touchend',doClose,{capture:true,passive:false});
      close.addEventListener('click',doClose,true);
    }
  }
  apply();
  new MutationObserver(function(){apply()}).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('resize',apply,{passive:true});
})();
})();
/* Blouse design type visuals requested by user. */
(function(){
  if(window.__sgBlouseDesignVisuals)return;
  window.__sgBlouseDesignVisuals=true;
  function install(){
    if(typeof window.designVisual!=='function')return;
    var base=window.designVisual;
    window.designVisual=function(t,i){
      var x=String(t||'').toLowerCase();
      if(!(x.includes('blouse')||x.includes('choli')))return base(t,i);
      var q=[['#f39ab2','#7a3550','#fff1f5'],['#d8b15a','#76510d','#fff8df'],['#4fa6a2','#174f4c','#e9fbfa'],['#6f82d8','#26356e','#eef1ff'],['#a97bd6','#513276','#f5efff'],['#e98a54','#743512','#fff0e8']][(+i||0)%6];
      var c=q[0],d=q[1],l=q[2],neck='M76 58Q100 76 124 58';
      if(x.includes('padded'))neck='M72 60Q100 42 128 60';
      else if(x.includes('princess'))neck='M74 52Q100 70 126 52';
      else if(x.includes('boat'))neck='M70 54Q100 72 130 54';
      else if(x.includes('back open'))neck='M76 48Q100 82 124 48';
      else if(x.includes('patch'))neck='M72 52L100 78 128 52';
      else if(x.includes('collar'))neck='M78 46L100 66 122 46';
      else if(x.includes('deep neck'))neck='M78 48L100 90 122 48';
      else if(x.includes('high neck'))neck='M80 42H120V64Q100 78 80 64Z';
      else if(x.includes('net'))neck='M76 52Q100 74 124 52';
      var sleeve=x.includes('cold shoulder')
        ?'<path d="M65 42l-13 18 13 10 10-12M135 42l13 18-13 10-10-12" fill="'+c+'" stroke="'+d+'" stroke-width="5"/>'
        :'<path d="M65 42l-18 28 18 12 12-18M135 42l18 28-18 12-12-18" fill="'+c+'" stroke="'+d+'" stroke-width="5"/>';
      var extra=x.includes('net')
        ?'<path d="M78 48L100 82 122 48" fill="none" stroke="'+l+'" stroke-width="3" stroke-dasharray="4 4"/>'
        :x.includes('patch')
        ?'<path d="M82 62l8 8 8-8 8 8 8-8 8 8" fill="none" stroke="'+l+'" stroke-width="4"/>':'';
      var id='sgb'+(+i||0);
      return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="184" height="134" rx="22" fill="#fff"/><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+c+'"/><stop offset="1" stop-color="'+l+'"/></linearGradient></defs>'+sleeve+'<path d="M78 34h44l8 18 10 8-8 14-10-9v45H78V65l-10 9-8-14 10-8z" fill="url(#'+id+')" stroke="'+d+'" stroke-width="5"/><path d="'+neck+'" fill="none" stroke="'+l+'" stroke-width="6"/>'+extra+'</svg>';
    };
  }
  install();
  setTimeout(install,100);
  setTimeout(install,500);
})();
