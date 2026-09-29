/* SILAI GURU DESIGN PHOTOS V5
   Shared garment-category photos. These are presentation assets and are not copied into user backup storage.
*/
(function(){
  'use strict';
  const tags={
    Kurti:'women,kurti,indian,clothing,fashion', Blouse:'women,blouse,indian,clothing,fashion',
    'Salwar Suit':'women,salwar,kameez,indian,clothing,fashion', Kameez:'women,kameez,indian,clothing,fashion',
    'Saree Blouse':'women,saree,blouse,indian,clothing,fashion', Lehenga:'women,lehenga,indian,clothing,fashion',
    Gown:'women,gown,evening,dress,fashion', Dress:'women,dress,clothing,fashion',
    Shirt:'women,shirt,clothing,fashion', Pant:'women,pants,trousers,clothing,fashion',
    Salwar:'women,salwar,indian,clothing,fashion', Choli:'women,choli,indian,clothing,fashion',
    Sherwani:'men,sherwani,indian,clothing,fashion', Suit:'men,suit,formal,clothing,fashion',
    Blazer:'men,blazer,formal,clothing,fashion', Waistcoat:'men,waistcoat,formal,clothing,fashion',
    Pajama:'men,pajama,indian,clothing,fashion', 'School Uniform':'school,uniform,clothing,fashion',
    Coat:'coat,outerwear,clothing,fashion', Other:'indian,ethnic,clothing,fashion',
    Kurta:'men,kurta,indian,clothing,fashion', Plazo:'women,palazzo,pants,indian,clothing,fashion'
  };
  function typeFromPage(){
    if(window.currentDesignType && tags[window.currentDesignType]) return window.currentDesignType;
    const h=[...document.querySelectorAll('h1,h2,h3,h4,.design-back,.folder-box')].map(x=>x.textContent||'').join(' ');
    const names=Object.keys(tags).sort((a,b)=>b.length-a.length);
    return names.find(t=>h.toLowerCase().includes(t.toLowerCase())) || 'Other';
  }
  function url(type,index){
    const q=(tags[type]||tags.Other).replace(/\s+/g,',');
    const lock=(type.length*1009+index*7919+17)%100000;
    return 'https://loremflickr.com/600/800/'+q+'?lock='+lock;
  }
  function patch(){
    const type=typeFromPage();
    const cards=[...document.querySelectorAll('.design-card')];
    cards.forEach((card,i)=>{
      const box=card.querySelector('.design-img'); if(!box) return;
      let img=box.querySelector('img.sg-v5-photo');
      if(!img){
        img=document.createElement('img');
        img.className='sg-v5-photo';
        img.loading='lazy';
        img.alt=((card.querySelector('.design-name')||{}).textContent||type+' design').trim();
        img.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
        const fallback=box.querySelector('svg');
        if(fallback) fallback.style.display='none';
        box.prepend(img);
      }
      img.src=url(type,i);
      img.onerror=function(){this.remove(); const svg=box.querySelector('svg'); if(svg) svg.style.display='block';};
    });
  }
  function start(){
    patch();
    const mo=new MutationObserver(()=>patch());
    mo.observe(document.body,{childList:true,subtree:true});
    setTimeout(patch,500); setTimeout(patch,1500); setTimeout(patch,3000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
