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
   The Garments library is a fixed modal. Keep the modal itself non-scrolling,
   but make the sheet the single touch-scroll surface so Android Chrome cannot
   lock the page after opening the folder. Also make the close button work on
   pointer/touch events even if another document-level handler is listening. */
(function installGarmentScreenTouchFix(){
  if(window.__sgGarmentScreenTouchFix)return;
  window.__sgGarmentScreenTouchFix=true;
  function apply(){
    var modal=document.getElementById('modal');
    if(!modal)return;
    modal.style.touchAction='none';
    modal.style.overscrollBehavior='contain';
    var sheet=modal.querySelector('.sheet');
    if(sheet){
      sheet.style.maxHeight='92vh';
      sheet.style.overflowY='auto';
      sheet.style.overflowX='hidden';
      sheet.style.webkitOverflowScrolling='touch';
      sheet.style.touchAction='pan-y';
      sheet.style.overscrollBehavior='contain';
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