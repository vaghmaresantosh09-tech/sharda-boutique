/* SILAI GURU — clean navigation + empty Design Library folders
   New Order garment selection stays inside New Order.
   Design Library initially contains ONLY garment folders/icons.
   Designs will be added later, one garment at a time. */
(function(){
  'use strict';
  var KEY='__silaiGuruCleanView';
  var restoring=false;
  function getState(){return history.state&&history.state[KEY]?history.state:null;}
  function push(view){
    if(restoring)return;
    var s=getState();
    if(s&&s.view===view)return;
    try{history.pushState({[KEY]:true,view:view},'',location.href)}catch(e){}
  }
  function cleanLibrary(){
    var modal=document.getElementById('modal'),title=document.getElementById('mt'),body=document.getElementById('mb');
    if(!modal||!title||!body)return;
    title.textContent='🎨 SILAI GURU Design Library';
    var types=['Kurti','Blouse','Salwar Suit','Kameez','Saree Blouse','Lehenga','Gown','Dress','Shirt','Pant','Salwar','Choli','Sherwani','Suit','Blazer','Waistcoat','Pajama','School Uniform','Coat','Other'];
    body.innerHTML='<div class="card"><div class="library-note">📁 Har garment ka alag design folder hai. Abhi folders khali hain. Designs hum ek-ek garment ke andar baad mein add karenge.</div><div class="garment-library">'+types.map(function(t,i){return '<button type="button" class="garment-library-card sg-empty-folder" data-garment="'+t.replace(/&/g,'&amp;').replace(/"/g,'&quot;')+'"><div class="libpic">'+(typeof window.garmentVisual==='function'?window.garmentVisual(t):'<div style="font-size:52px">👗</div>')+'</div><b>'+t+'</b><small>📁 Empty Folder</small></button>';}).join('')+'</div></div>';
    body.querySelectorAll('.sg-empty-folder').forEach(function(btn){
      btn.addEventListener('click',function(){openEmptyFolder(btn.getAttribute('data-garment'));});
    });
    modal.classList.add('modal','show');
  }
  function openEmptyFolder(type){
    push('empty-design-folder:'+type);
    var title=document.getElementById('mt'),body=document.getElementById('mb');
    if(!title||!body)return;
    title.textContent='📁 '+type+' Designs';
    body.innerHTML='<div class="design-back"><button type="button" class="secondary" id="sgFolderBack">← Garments</button><b>'+type+'</b></div><div class="card" style="text-align:center;padding:35px 18px"><div style="font-size:70px">📁</div><h3>Design Folder Empty</h3><p class="muted">Is '+type+' folder mein abhi koi design nahi hai.</p><p class="muted">Pehle Design Library ko clear rakhte hain. Baad mein hum isi folder ke andar ek-ek actual design add karenge.</p></div>';
    var b=document.getElementById('sgFolderBack');if(b)b.onclick=function(){cleanLibrary();};
  }
  function wrapDesignCatalog(){
    if(window.__sgCleanDesignWrapped || typeof window.openDesignCatalog!=='function')return;
    window.__sgCleanDesignWrapped=true;
    var original=window.openDesignCatalog;
    window.openDesignCatalog=function(type){
      var name=String(type||'').trim();
      if(name)push('design-catalog:'+name);
      return original.apply(this,arguments);
    };
  }
  function installEmptyLibrary(){
    if(typeof window.openGarmentLibrary!=='function')return;
    if(window.__sgEmptyLibraryInstalled && window.__sgEmptyLibraryTarget===window.openGarmentLibrary)return;
    window.__sgEmptyLibraryInstalled=true;
    window.__sgEmptyLibraryTarget=window.openGarmentLibrary;
    window.openGarmentLibrary=function(){push('design-library');cleanLibrary();};
  }
  function init(){
    try{if(!getState())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){}
    wrapDesignCatalog();
    installEmptyLibrary();
    setTimeout(wrapDesignCatalog,100);
    setTimeout(installEmptyLibrary,100);
    setTimeout(wrapDesignCatalog,500);
    setTimeout(installEmptyLibrary,500);
  }
  window.addEventListener('load',init);
  var timer=setInterval(function(){wrapDesignCatalog();installEmptyLibrary();},250);
  setTimeout(function(){clearInterval(timer);},10000);
  window.addEventListener('popstate',function(e){
    var s=e&&e.state;
    if(!s||!s[KEY])return;
    if(s.view==='design-library'){
      restoring=true;try{cleanLibrary();}finally{restoring=false;}
    }else if(s.view&&s.view.indexOf('empty-design-folder:')===0){
      restoring=true;try{openEmptyFolder(s.view.slice(21));}finally{restoring=false;}
    }else if(s.view&&s.view.indexOf('design-catalog:')===0 && typeof window.openDesignCatalog==='function'){
      restoring=true;try{window.openDesignCatalog(s.view.slice(15));}finally{restoring=false;}
    }else if(s.view==='dashboard'){
      var m=document.getElementById('modal');if(m)m.classList.remove('show');
    }
  });
})();
