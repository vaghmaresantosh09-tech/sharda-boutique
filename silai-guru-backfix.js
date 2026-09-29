/* SILAI GURU — app-level browser history + garment design/source fixes + WhatsApp add-on */
(function(){
  'use strict';
  const KEY='__silaiGuruView';
  let restoring=false;
  const titleMap={
    '➕ New Order':'order','New Order':'order','👥 Customers':'customers','Customers':'customers',
    '📋 Orders':'orders','Orders':'orders','📏 Measurements':'measure','Measurements':'measure',
    '💰 Payments':'payments','Payments':'payments','🚚 Delivery':'delivery','Delivery':'delivery',
    '📊 Reports':'reports','Reports':'reports','🏪 Shop Profile':'profile','Shop Profile':'profile',
    '☁️ Backup':'backup','Backup':'backup','🧑‍🔧 Workers':'workers','Workers':'workers',
    '👗 Garments':'garments','Garments':'garments','🎨 Design Library':'designs','Design Library':'designs',
    '⚙️ Settings':'settings','Settings':'settings','💎 Plans & Upgrade':'plans','Plans & Upgrade':'plans',
    '📏 Measurement Templates':'garment-measurements'
  };
  function currentView(){
    const el=document.getElementById('mt'),raw=String(el&&el.textContent||'').trim();
    if(titleMap[raw])return titleMap[raw];
    if(/^📏 .+ Measurements$/.test(raw))return 'garment-measurement-editor:'+raw.slice(3,-13);
    if(/^🧵 .+ Services$/.test(raw))return 'garment-services:'+raw.slice(3,-9);
    if(/^👗 .+ Designs$/.test(raw))return 'design-catalog:'+raw.slice(3,-8);
    if(raw==='📁 My Garment Folder')return 'garment-folder';
    return raw?'custom:'+raw:'dashboard';
  }
  function state(){return history.state&&history.state[KEY]?history.state:null;}
  window.__sgRecordView=function(view){
    if(restoring||!view)return;
    const v=String(view),s=state();
    if(s&&s.view===v)return;
    history.pushState({[KEY]:true,view:v},'',location.href);
  };
  try{if(!state())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){}
  function findGarmentIndex(name){
    try{const a=typeof window.getGarmentMaster==='function'?window.getGarmentMaster():[];return a.findIndex(g=>String(g.name)===String(name));}catch(e){return -1;}
  }
  function restore(view){
    restoring=true;
    try{
      if(!view||view==='dashboard'){const m=document.getElementById('modal');if(m)m.classList.remove('show');return;}
      if(view==='garment-measurements'&&typeof window.openGarmentMeasurementManager==='function')return window.openGarmentMeasurementManager();
      if(view==='garments'&&typeof window.openGarmentsManager==='function')return window.openGarmentsManager();
      if(view.indexOf('garment-measurement-editor:')===0){const i=findGarmentIndex(view.slice(27));if(i>=0&&typeof window.openGarmentMeasurementEditor==='function')return window.openGarmentMeasurementEditor(i);return;}
      if(view.indexOf('garment-services:')===0){const i=findGarmentIndex(view.slice(17));if(i>=0&&typeof window.openGarmentServiceEditor==='function')return window.openGarmentServiceEditor(i);return;}
      if(view.indexOf('design-catalog:')===0&&typeof window.openDesignCatalog==='function')return window.openDesignCatalog(view.slice(15));
      if(view==='garment-folder'&&typeof window.openGarmentFolder==='function')return window.openGarmentFolder();
      if(/^[a-z-]+$/.test(view)&&typeof window.openM==='function')return window.openM(view);
      const m=document.getElementById('modal');if(m)m.classList.remove('show');
    }finally{restoring=false;}
  }
  window.addEventListener('popstate',function(e){const s=e&&e.state;if(!s||!s[KEY])return;restore(s.view||'dashboard')},true);
  window.addEventListener('load',function(){try{if(!state())history.replaceState({[KEY]:true,view:'dashboard'},'',location.href)}catch(e){};installWhatsAppAddon();installBlouseNeckDesignLibrary();});

  /* Every garment icon in New Order opens its own related design library. */
  (function installGarmentDesignClickFix(){
    if(window.__sgGarmentDesignClickFix)return;
    window.__sgGarmentDesignClickFix=true;
    function cleanName(v){return String(v||'').replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu,'').replace(/\s+/g,' ').trim();}
    function ensureDesignSources(type){
      const box=document.querySelector('.design-sources');if(!box)return;
      const hasText=t=>Array.from(box.querySelectorAll('button,label,a')).some(el=>cleanName(el.textContent).toLowerCase().includes(t));
      if(!hasText('camera')){
        const label=document.createElement('label');label.className='source-chip';
        label.innerHTML='📷 Camera<input type="file" accept="image/*" capture="environment" style="position:absolute;opacity:0;width:1px;height:1px">';
        const input=label.querySelector('input');if(input)input.addEventListener('change',function(){if(typeof window.saveUploadedDesign==='function')window.saveUploadedDesign(type,input)});box.appendChild(label);
      }
      if(!hasText('gallery')){
        const label=document.createElement('label');label.className='source-chip';
        label.innerHTML='🖼️ Gallery<input type="file" accept="image/*" style="position:absolute;opacity:0;width:1px;height:1px">';
        const input=label.querySelector('input');if(input)input.addEventListener('change',function(){if(typeof window.saveUploadedDesign==='function')window.saveUploadedDesign(type,input)});box.appendChild(label);
      }
      if(!hasText('websites')){
        const b=document.createElement('button');b.type='button';b.className='source-chip';b.textContent='🌐 Websites';
        b.addEventListener('click',function(){
          if(typeof window.openOrderWebsites==='function')return window.openOrderWebsites(type,0);
          const q=encodeURIComponent(String(type)+' garment designs');window.open('https://www.google.com/search?tbm=isch&q='+q,'_blank','noopener');
        });box.appendChild(b);
      }
    }
    function openForElement(el){
      if(!el)return false;
      const b=el.querySelector('b'),name=cleanName(b?b.textContent:el.textContent);
      if(!name||name==='All Garments'||typeof window.openDesignCatalog!=='function')return false;
      if(window.__sgRecordView)window.__sgRecordView('design-catalog:'+name);
      window.openDesignCatalog(name);setTimeout(function(){ensureDesignSources(name)},0);return true;
    }
    document.addEventListener('click',function(e){
      const el=e.target&&e.target.closest?e.target.closest('.sg-type-icon'):null;if(!el)return;
      if(el.dataset.sgDesignHandled==='1')return;el.dataset.sgDesignHandled='1';e.preventDefault();e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();openForElement(el);
    },true);
    const observer=new MutationObserver(function(){document.querySelectorAll('.sg-type-icon').forEach(function(el){if(!el.getAttribute('role'))el.setAttribute('role','button');if(!el.getAttribute('tabindex'))el.setAttribute('tabindex','0');el.setAttribute('aria-label','Open '+cleanName(el.textContent)+' designs')})});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  })();

  /* IMPORTANT: Do not replace non-Kurti designs with unrelated stock photos. */

  /* BLOUSE NECK DESIGN LIBRARY
     These are built-in SVG presentation designs. They are not copied into user backup storage. */
  function installBlouseNeckDesignLibrary(){
    if(window.__sgBlouseNeckDesignLibrary)return;
    window.__sgBlouseNeckDesignLibrary=true;

    const necks=[
      ['Round Neck','round'],['V Neck','v'],['Deep V Neck','deep-v'],['U Neck','u'],['Deep U Neck','deep-u'],
      ['Square Neck','square'],['Boat Neck','boat'],['Sweetheart Neck','sweetheart'],['Halter Neck','halter'],['High Neck','high'],
      ['Collar Neck','collar'],['Keyhole Neck','keyhole'],['Scallop Neck','scallop'],['Notch Neck','notch'],['Pot Neck','pot'],
      ['Leaf Neck','leaf'],['Tulip Neck','tulip'],['Princess Neck','princess'],['Asymmetric Neck','asymmetric'],['Jewel Neck','jewel'],
      ['Ruffle Neck','ruffle'],['Bateau Neck','bateau'],['Back U Neck','back-u'],['Back V Neck','back-v']
    ];

    const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const palettes=[['#f5a4bd','#7b3652'],['#e5bd62','#77500d'],['#76c5bd','#175d57'],['#8294e7','#2f3d82'],['#c19be2','#593a78'],['#f0a16d','#7c3e20']];

    function neckPath(kind){
      const p={
        round:'M76 55 Q100 82 124 55',
        v:'M76 53 L100 83 L124 53',
        'deep-v':'M76 52 L100 105 L124 52',
        u:'M76 52 Q100 92 124 52',
        'deep-u':'M76 52 Q100 108 124 52',
        square:'M76 52 L76 76 L124 76 L124 52',
        boat:'M72 52 Q100 69 128 52',
        sweetheart:'M76 55 Q88 78 100 63 Q112 78 124 55',
        halter:'M84 49 L100 70 L116 49 Q110 84 100 91 Q90 84 84 49',
        high:'M82 51 Q100 62 118 51 L116 70 Q100 78 84 70 Z',
        collar:'M76 50 L100 70 L124 50 L119 84 L100 71 L81 84 Z',
        keyhole:'M76 52 Q100 82 124 52 Q118 63 100 63 Q82 63 76 52 M92 67 Q100 57 108 67 Q108 79 100 86 Q92 79 92 67',
        scallop:'M76 54 Q82 72 88 54 Q94 72 100 54 Q106 72 112 54 Q118 72 124 54',
        notch:'M76 52 L91 68 L100 57 L109 68 L124 52',
        pot:'M79 51 Q100 64 121 51 Q118 88 100 95 Q82 88 79 51',
        leaf:'M76 52 Q100 66 124 52 Q112 91 100 101 Q88 91 76 52',
        tulip:'M76 52 Q91 68 100 55 Q109 68 124 52 Q117 92 100 96 Q83 92 76 52',
        princess:'M76 52 Q100 86 124 52 M88 60 L92 95 M112 60 L108 95',
        asymmetric:'M76 51 Q96 58 124 79',
        jewel:'M82 52 Q100 68 118 52 Q116 73 100 80 Q84 73 82 52',
        ruffle:'M76 53 Q82 65 88 53 Q94 65 100 53 Q106 65 112 53 Q118 65 124 53 M82 60 Q100 78 118 60',
        bateau:'M72 51 Q100 62 128 51 Q124 65 100 70 Q76 65 72 51',
        'back-u':'M76 55 Q100 98 124 55',
        'back-v':'M76 54 L100 103 L124 54'
      };return p[kind]||p.round;
    }

    function neckSvg(name,kind,index,back){
      const q=palettes[index%palettes.length],fabric=q[0],line=q[1];
      const path=neckPath(kind);
      const label=back?'BACK':'FRONT';
      return '<svg viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(name)+'"><rect x="8" y="8" width="184" height="164" rx="22" fill="#fff"/><path d="M62 45 L82 28 Q100 38 118 28 L138 45 L154 73 L132 88 L120 69 L120 150 L80 150 L80 69 L68 88 L46 73 Z" fill="'+fabric+'" stroke="'+line+'" stroke-width="5"/><path d="'+path+'" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="'+path+'" fill="none" stroke="'+line+'" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="100" y="166" text-anchor="middle" font-size="9" font-family="Arial" font-weight="700" fill="'+line+'">'+label+'</text></svg>';
    }

    function isBlousePage(){
      const text=[...document.querySelectorAll('#mt,h1,h2,h3,.design-back')].map(x=>x.textContent||'').join(' ').toLowerCase();
      return text.includes('blouse');
    }

    function patch(){
      if(!isBlousePage())return;
      const grid=document.querySelector('.design-grid');
      if(!grid)return;
      grid.dataset.sgBlouseNeck='1';
      const existing=[...grid.querySelectorAll('.design-card')];
      existing.forEach((card,i)=>{
        const item=necks[i];
        if(!item){card.remove();return;}
        card.classList.add('sg-neck-card');
        const img=card.querySelector('.design-img');
        const nameEl=card.querySelector('.design-name');
        if(nameEl)nameEl.textContent=item[0];
        if(img)img.innerHTML=neckSvg(item[0],item[1],i,false);
        const actions=card.querySelector('.design-actions');
        if(actions){
          const btns=[...actions.querySelectorAll('button')];
          if(btns[0])btns[0].textContent='☆ Save';
          if(btns[1])btns[1].textContent='👁️ Show';
          if(btns[2])btns[2].textContent='✓ Select';
        }
      });
      let cards=[...grid.querySelectorAll('.design-card')];
      for(let i=cards.length;i<necks.length;i++){
        const [name,kind]=necks[i];
        const card=document.createElement('div');
        card.className='design-card sg-neck-card';
        card.innerHTML='<div class="design-img">'+neckSvg(name,kind,i,false)+'</div><div class="design-name">'+esc(name)+'</div><div class="design-actions"><button type="button">☆ Save</button><button type="button">👁️ Show</button><button type="button">✓ Select</button></div>';
        grid.appendChild(card);
      }
      const count=document.querySelector('.folder-count');if(count)count.textContent=necks.length+' Neck Designs';
      const heading=[...document.querySelectorAll('h1,h2,h3')].find(x=>/\d+\s*Designs/i.test(x.textContent||''));
      if(heading)heading.textContent='Blouse · '+necks.length+' Neck Designs';
      const search=document.querySelector('.design-search');if(search)search.placeholder='🔎 Search blouse neck design...';
      const note=document.querySelector('.library-note');if(note)note.textContent='Blouse ke liye actual neck-shape designs — Front & Back styles.';
    }

    document.addEventListener('click',function(e){
      const b=e.target.closest&&e.target.closest('.sg-neck-card .design-actions button');
      if(!b)return;
      const card=b.closest('.sg-neck-card');
      const idx=[...document.querySelectorAll('.sg-neck-card')].indexOf(card);
      const item=necks[idx];if(!item)return;
      const svg=card.querySelector('.design-img svg');
      e.preventDefault();e.stopPropagation();
      if(/show/i.test(b.textContent||'')){
        if(typeof openDesignPreview==='function')openDesignPreview({name:item[0],type:'Blouse',svg:svg?svg.outerHTML:''});
        else if(typeof openDesignPreviewModal==='function')openDesignPreviewModal(item[0],svg?svg.outerHTML:'');
      }else if(/select/i.test(b.textContent||'')){
        const d={id:'builtin-blouse-neck-'+item[1],name:item[0],type:'Blouse',category:'Neck Design',index:idx,svg:svg?svg.outerHTML:''};
        if(typeof selectDesign==='function')selectDesign(d);else alert('✓ '+item[0]+' select ho gaya');
      }
    },true);

    const style=document.createElement('style');
    style.id='sg-blouse-neck-library-style';
    style.textContent='.sg-neck-card .design-img{background:linear-gradient(145deg,#fff,#faf8ff)}.sg-neck-card .design-img svg{width:100%;height:100%;object-fit:contain}.sg-neck-card .design-name{font-size:13px}.sg-neck-card .design-actions button{min-height:34px}.sg-neck-card{border-color:#ddd7ff}';
    document.head.appendChild(style);

    const observer=new MutationObserver(function(){patch()});
    observer.observe(document.body,{childList:true,subtree:true});
    [0,300,800,1600,3000].forEach(ms=>setTimeout(patch,ms));
    window.__sgPatchBlouseNecks=patch;
  }

  /* OPTIONAL WHATSAPP SERVICES ADD-ON */
  function installWhatsAppAddon(){
    if(window.__sgWhatsAppAddon)return;
    window.__sgWhatsAppAddon=true;
    const style=document.createElement('style');style.id='sg-whatsapp-addon-style';
    style.textContent='.sg-wa-addon{position:relative}.sg-wa-badge{position:absolute;top:7px;right:7px;background:#fff0c9;color:#765500;border-radius:99px;padding:3px 6px;font-size:9px;font-weight:900}.sg-wa-modal{position:fixed;inset:0;background:#0007;z-index:120;display:none;align-items:flex-end;padding:0}.sg-wa-modal.show{display:flex}.sg-wa-sheet{background:#fff;width:100%;max-width:760px;margin:auto;border-radius:24px 24px 0 0;padding:18px;max-height:90vh;overflow:auto}.sg-wa-feature{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #eee}.sg-wa-feature:last-child{border-bottom:0}.sg-wa-icon{font-size:22px;width:30px}.sg-wa-note{background:#fff7df;border:1px solid #efd58b;border-radius:13px;padding:11px;font-size:12px;color:#6b5300;margin-top:12px}.sg-wa-price{background:#f4f1ff;border:1px solid #ddd7ff;border-radius:14px;padding:13px;margin-top:12px}.sg-wa-price b{color:#5144bd}.sg-wa-close{float:right;background:#eee}.sg-wa-subscribe{background:#5b4bdb;color:#fff;width:100%;margin-top:12px}.sg-wa-disabled{background:#eee;color:#777;width:100%;margin-top:8px}';
    document.head.appendChild(style);
    function addCard(){
      const containers=Array.from(document.querySelectorAll('.icons'));
      const grid=containers.find(function(x){return !x.closest('.bottom') && !x.querySelector('.sg-wa-addon')});
      if(!grid || document.querySelector('.sg-wa-addon'))return;
      const card=document.createElement('button');card.type='button';card.className='ico sg-wa-addon';card.setAttribute('aria-label','WhatsApp Services');
      card.innerHTML='<span class="sg-wa-badge">ADD-ON</span><span class="dash-icon"><span style="font-size:38px">💬</span></span><small>WhatsApp<br>Services</small>';
      card.addEventListener('click',openModal);grid.appendChild(card);
    }
    function ensureModal(){
      if(document.getElementById('sgWaModal'))return document.getElementById('sgWaModal');
      const m=document.createElement('div');m.id='sgWaModal';m.className='sg-wa-modal';
      m.innerHTML='<div class="sg-wa-sheet" role="dialog" aria-modal="true" aria-labelledby="sgWaTitle"><button type="button" class="sg-wa-close" id="sgWaClose">✕</button><h2 id="sgWaTitle" style="margin-top:0">💬 WhatsApp Services</h2><p class="muted">Customer ko automatic order aur business messages bhejne ki optional paid facility.</p><div class="sg-wa-feature"><span class="sg-wa-icon">🧾</span><div><b>Order & Bill Message</b><div class="muted">Order confirmation aur bill details.</div></div></div><div class="sg-wa-feature"><span class="sg-wa-icon">📅</span><div><b>Delivery Reminder</b><div class="muted">Customer ko delivery-related reminder.</div></div></div><div class="sg-wa-feature"><span class="sg-wa-icon">💰</span><div><b>Payment / Balance Reminder</b><div class="muted">Advance aur remaining balance ki information.</div></div></div><div class="sg-wa-feature"><span class="sg-wa-icon">✉️</span><div><b>Predefined Messages</b><div class="muted">Tailor apne business ke approved message templates use kar sakega.</div></div></div><div class="sg-wa-price"><b>Optional Paid Add-on</b><div style="font-size:12px;margin-top:5px">Price abhi final nahi kiya gaya hai. Provider/API cost check karke suitable plan price set ki jayegi.</div></div><div class="sg-wa-note">📱 Normal WhatsApp sharing existing app flow me rahegi. Ye add-on automatic WhatsApp Business Platform/API messaging ke liye hai.</div><button type="button" class="sg-wa-subscribe" id="sgWaSubscribe">Coming Soon — Price Later</button><button type="button" class="sg-wa-disabled" id="sgWaClose2">Close</button></div>';
      document.body.appendChild(m);m.addEventListener('click',function(e){if(e.target===m)m.classList.remove('show')});
      document.getElementById('sgWaClose').addEventListener('click',function(){m.classList.remove('show')});document.getElementById('sgWaClose2').addEventListener('click',function(){m.classList.remove('show')});
      document.getElementById('sgWaSubscribe').addEventListener('click',function(){alert('WhatsApp Services ka price aur automatic API activation baad me final kiya jayega.')});return m;
    }
    function openModal(){ensureModal().classList.add('show')}
    function watch(){addCard();setTimeout(addCard,250);setTimeout(addCard,1000)}
    watch();const ob=new MutationObserver(function(){addCard()});ob.observe(document.body,{childList:true,subtree:true});
  }
})();