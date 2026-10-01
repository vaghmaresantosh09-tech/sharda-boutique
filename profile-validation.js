/* SILAI GURU — single authoritative onboarding validation
   No stacked profile patches. This file owns the profile gate UI + validation.
*/
(function () {
  'use strict';
  const CITY_SOURCE = 'https://raw.githubusercontent.com/bhanuc/indian-list/master/state-city.json';
  const PIN_BASE = 'https://aniket-thapa.github.io/india-pincode-api';
  const states = [
    'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'
  ];
  const emailDomains = ['gmail.com','gmail.in','yahoo.com','yahoo.in','outlook.com','hotmail.com','rediffmail.com'];
  const fallbackCities = {
    Gujarat:['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh','Gandhinagar','Anand','Bharuch','Navsari','Valsad','Vapi','Nadiad','Palanpur','Patan','Mehsana','Morbi','Porbandar','Godhra'],
    Maharashtra:['Mumbai','Pune','Nagpur','Nashik','Thane','Navi Mumbai','Aurangabad','Solapur','Kolhapur','Amravati','Nanded','Satara','Sangli','Latur','Akola'],
    Rajasthan:['Jaipur','Jodhpur','Udaipur','Kota','Ajmer','Bikaner','Alwar','Bharatpur','Sikar','Pali','Bhilwara','Sri Ganganagar'],
    Delhi:['Delhi','New Delhi'],
    Karnataka:['Bengaluru','Mysuru','Mangaluru','Belagavi','Hubballi','Dharwad','Shivamogga','Tumakuru','Ballari'],
    Madhya Pradesh:['Bhopal','Indore','Jabalpur','Gwalior','Ujjain','Sagar','Satna','Ratlam','Rewa','Dewas'],
    Uttar Pradesh:['Lucknow','Kanpur','Agra','Varanasi','Noida','Ghaziabad','Meerut','Prayagraj','Bareilly','Aligarh','Moradabad','Gorakhpur'],
    Tamil Nadu:['Chennai','Coimbatore','Madurai','Salem','Tiruchirappalli','Tirunelveli','Erode','Vellore','Thanjavur','Tiruppur'],
    Telangana:['Hyderabad','Warangal','Nizamabad','Karimnagar','Khammam'],
    West Bengal:['Kolkata','Siliguri','Asansol','Durgapur','Howrah','Malda'],
    Gujarat:['Ahmedabad','Surat','Vadodara','Rajkot','Bhavnagar','Jamnagar','Junagadh','Gandhinagar','Anand','Bharuch','Navsari','Valsad','Vapi','Nadiad','Palanpur','Patan','Mehsana','Morbi','Porbandar','Godhra']
  };
  let cityData = null;
  let selectedPincodes = [];
  let pinRequestToken = 0;

  const $ = id => document.getElementById(id);
  const norm = s => String(s || '').trim().replace(/\s+/g,' ').toLowerCase();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const esc = s => String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  function addStyle(){
    if ($('sg-profile-gate-style')) return;
    const st=document.createElement('style'); st.id='sg-profile-gate-style';
    st.textContent=`
      #pnRow,#pmRow{position:relative}
      .sg-owner-row{display:grid;grid-template-columns:110px 1fr;gap:8px}
      .sg-prefix{padding:11px;border:1px solid #e5e6ef;border-radius:11px;background:#fff;font-weight:700}
      .sg-mobile-wrap{display:grid;grid-template-columns:64px 1fr;gap:0}
      .sg-mobile-code{display:flex;align-items:center;justify-content:center;border:1px solid #e5e6ef;border-right:0;border-radius:11px 0 0 11px;background:#f6f5ff;color:#5144bd;font-weight:900}
      .sg-mobile-input{border-radius:0 11px 11px 0!important}
      .sg-help{font-size:11px;color:#73778c;margin-top:2px;line-height:1.3}
      .sg-profile-error{display:block;color:#c62828;font-size:12px;font-weight:700;line-height:1.35;margin-top:3px}
      .sg-profile-ok{display:block;color:#16704a;font-size:11px;font-weight:700;margin-top:3px}
      .sg-suggesting{font-size:11px;color:#5144bd;margin-top:3px}
      #profileSaveBtn[disabled]{cursor:not-allowed;filter:saturate(.55)}
      @media(max-width:500px){.sg-owner-row{grid-template-columns:100px 1fr}}
    `;
    document.head.appendChild(st);
  }

  function fieldError(el,msg){
    const box=el.closest('.field') || el.parentElement;
    const old=box && box.querySelector('.sg-profile-error'); if(old)old.remove();
    el.setCustomValidity(msg || '');
    if(msg){
      el.setAttribute('aria-invalid','true');
      const m=document.createElement('small'); m.className='sg-profile-error'; m.textContent=msg; box.appendChild(m);
    }else el.removeAttribute('aria-invalid');
  }

  function setupMarkup(){
    const form=$('pf'); if(!form) return false;
    addStyle();
    const pn=$('pn'), pm=$('pm'), pe=$('pe'), pst=$('pst'), pc=$('pc'), pp=$('pp');
    if(!pn||!pm||!pe||!pst||!pc||!pp) return false;
    pn.setAttribute('autocomplete','name'); pn.setAttribute('placeholder','Owner ka proper naam');
    pm.setAttribute('autocomplete','tel-national'); pm.setAttribute('inputmode','numeric'); pm.setAttribute('maxlength','10'); pm.setAttribute('placeholder','9876543210');
    pe.setAttribute('type','email'); pe.setAttribute('autocomplete','email'); pe.setAttribute('placeholder','name@gmail.com');
    pst.setAttribute('autocomplete','address-level1'); pst.setAttribute('placeholder','Gujarat');
    pc.setAttribute('autocomplete','address-level2'); pc.setAttribute('placeholder','Surat');
    pp.setAttribute('autocomplete','postal-code'); pp.setAttribute('inputmode','numeric'); pp.setAttribute('maxlength','6'); pp.setAttribute('placeholder','395001');

    const pnField=pn.closest('.field');
    if(pnField && !$('pnPrefix')){
      const label=pnField.querySelector('label'); if(label) label.textContent='Shop Owner Name *';
      const wrap=document.createElement('div'); wrap.className='sg-owner-row';
      const sel=document.createElement('select'); sel.id='pnPrefix'; sel.className='sg-prefix'; sel.setAttribute('aria-label','Name prefix');
      ['Mr.','Mrs.','Miss'].forEach(x=>{const o=document.createElement('option');o.value=x;o.textContent=x;sel.appendChild(o);});
      pn.replaceWith(wrap); wrap.append(sel,pn);
    }
    const pmField=pm.closest('.field');
    if(pmField && !pm.parentElement.classList.contains('sg-mobile-wrap')){
      const label=pmField.querySelector('label'); if(label) label.textContent='Mobile Number *';
      const wrap=document.createElement('div'); wrap.className='sg-mobile-wrap';
      const code=document.createElement('span'); code.className='sg-mobile-code'; code.textContent='+91';
      pm.classList.add('sg-mobile-input'); pm.replaceWith(wrap); wrap.append(code,pm);
      const h=document.createElement('small'); h.className='sg-help'; h.textContent='India mobile number: 10 digits, 6–9 se start'; pmField.appendChild(h);
    }
    const peField=pe.closest('.field');
    if(peField && !$('sg-email-domains')){
      const dl=document.createElement('datalist'); dl.id='sg-email-domains';
      emailDomains.forEach(d=>{const o=document.createElement('option');o.value='@'+d;dl.appendChild(o);});
      document.body.appendChild(dl); pe.setAttribute('list',dl.id);
      const h=document.createElement('small'); h.className='sg-help'; h.textContent='Examples: name@gmail.com · name@gmail.in · name@yahoo.com'; peField.appendChild(h);
    }
    [['pst','sg-state-list'],['pc','sg-city-list'],['pp','sg-pin-list']].forEach(([id,dlid])=>{
      const el=$(id); if(!el) return; if(!$ (dlid)){};
    });
    ensureDatalist('sg-state-list',pst); ensureDatalist('sg-city-list',pc); ensureDatalist('sg-pin-list',pp);
    return true;
  }

  function ensureDatalist(id,input){
    if(!input) return;
    let dl=$(id); if(!dl){dl=document.createElement('datalist');dl.id=id;document.body.appendChild(dl);} input.setAttribute('list',id);
  }
  function fillList(id,items){
    const dl=$(id); if(!dl)return; dl.innerHTML='';
    items.slice(0,120).forEach(v=>{const o=document.createElement('option');o.value=v;dl.appendChild(o);});
  }

  async function loadCities(){
    if(cityData) return cityData;
    try{
      const r=await fetch(CITY_SOURCE,{cache:'force-cache'}); if(!r.ok) throw new Error('city list');
      cityData=await r.json(); localStorage.setItem('sg_city_data_v1',JSON.stringify(cityData));
    }catch(e){
      try{cityData=JSON.parse(localStorage.getItem('sg_city_data_v1')||'null');}catch(_){cityData=null;}
      if(!cityData) cityData=fallbackCities;
    }
    return cityData;
  }
  function citiesForState(state){
    if(!state) return [];
    if(Array.isArray(cityData)){
      const a=cityData.filter(x=>norm(x.state).replace(/\s+/g,' ')==norm(state).replace(/\s+/g,' ')).map(x=>String(x.name||'').replace(/\*$/,'')).filter(Boolean);
      if(a.length)return [...new Set(a)].sort();
    }
    const k=Object.keys(cityData||{}).find(x=>norm(x)===norm(state));
    return k ? [...new Set((cityData[k]||[]).map(x=>String(x).replace(/\*$/,'')).filter(Boolean))].sort() : [];
  }

  async function updateCities(){
    const state=$('pst')?.value.trim(); const city=$('pc');
    selectedPincodes=[]; fillList('sg-pin-list',[]); if($('pp')) $('pp').value='';
    await loadCities();
    const list=citiesForState(state); fillList('sg-city-list',list);
    fieldError(city,''); fieldError($('pp'),''); validate(false);
  }

  async function loadPincodes(){
    const state=$('pst')?.value.trim(), city=$('pc')?.value.trim();
    if(!state||!city)return;
    const token=++pinRequestToken; selectedPincodes=[];
    fillList('sg-pin-list',[]); if($('pp')) $('pp').value='';
    const url=`${PIN_BASE}/districts/${slug(state)}/${slug(city)}.json`;
    try{
      const r=await fetch(url,{cache:'force-cache'}); if(!r.ok) throw new Error('pincode list');
      const data=await r.json();
      if(token!==pinRequestToken)return;
      selectedPincodes=[...new Set((data.offices||[]).map(x=>String(x.pincode||'')).filter(x=>/^\d{6}$/.test(x)))].sort();
      fillList('sg-pin-list',selectedPincodes);
      const msg=$('pp')?.closest('.field')?.querySelector('.sg-suggesting'); if(msg)msg.remove();
      if(selectedPincodes.length){
        const h=document.createElement('small');h.className='sg-suggesting';h.textContent=`${selectedPincodes.length} related pincode suggestions loaded`;$('pp').closest('.field').appendChild(h);
      }
      validate(false);
    }catch(e){
      if(token!==pinRequestToken)return;
      const h=document.createElement('small');h.className='sg-suggesting';h.textContent='Pincode list load nahi hui — exact pincode verify hona zaroori hai.';$('pp').closest('.field').appendChild(h);
      validate(false);
    }
  }

  async function validate(show=true){
    const prefix=$('pnPrefix')?.value||'Mr.';
    const name=$('pn')?.value.trim()||'';
    const mobile=$('pm')?.value.replace(/\D/g,'')||'';
    const shop=$('ps')?.value.trim()||'';
    const email=$('pe')?.value.trim()||'';
    const address=$('pa')?.value.trim()||'';
    const state=$('pst')?.value.trim()||'';
    const city=$('pc')?.value.trim()||'';
    const pin=$('pp')?.value.trim()||'';
    let ok=true, first=null;
    const fail=(el,msg)=>{ok=false;if(!first)first=el;fieldError(el,msg);};
    [[$('pn'),name.length>=2 && /^[A-Za-z\u0900-\u097F][A-Za-z\u0900-\u097F .'-]{1,59}$/.test(name),'Proper shop owner name likhiye.'],
     [$('pm'),/^[6-9]\d{9}$/.test(mobile),'10 digit Indian mobile number likhiye.'],
     [$('ps'),shop.length>=3 && /[A-Za-z\u0900-\u097F]/.test(shop),'Proper shop name likhiye.'],
     [$('pe'),/^[^\s@]+@(?:gmail\.com|gmail\.in|yahoo\.com|yahoo\.in|outlook\.com|hotmail\.com|rediffmail\.com)$/i.test(email),'Valid email likhiye, jaise name@gmail.com.'],
     [$('pa'),address.length>=10 && /[A-Za-z\u0900-\u097F]/.test(address) && /\d/.test(address),'Address mein proper details aur house/shop number likhiye.'],
     [$('pst'),states.some(s=>norm(s)===norm(state)),'State list me se valid State/UT select kijiye.'],
     [$('pc'),false,'Selected State ke liye City list me se valid City select kijiye.'],
     [$('pp'),/^[1-9]\d{5}$/.test(pin),'6 digit valid pincode likhiye.']].forEach(([el,test,msg])=>{if(el){fieldError(el,'');if(!test)fail(el,msg);}});
    const validCities=citiesForState(state);
    const cityOk=validCities.some(c=>norm(c)===norm(city));
    fieldError($('pc'),''); if(!cityOk)fail($('pc'),'City selected State ki list me se hona chahiye.');
    const pinOk=selectedPincodes.includes(pin);
    fieldError($('pp'),''); if(!pinOk)fail($('pp'),'Is selected City ka valid pincode select kijiye.');
    if(!selectedPincodes.length && cityOk) ok=false;
    const btn=$('profileSaveBtn');
    if(btn){btn.disabled=!ok;btn.style.opacity=ok?'1':'.65';btn.setAttribute('aria-disabled',String(!ok));}
    if(show && !ok && first){try{first.focus();first.scrollIntoView({behavior:'smooth',block:'center'});}catch(_){} }
    return ok;
  }

  function gateSubmit(){
    const btn=$('profileSaveBtn'); if(!btn)return;
    btn.addEventListener('click',async function(ev){
      if(btn.disabled){ev.preventDefault();ev.stopImmediatePropagation();await validate(true);return;}
      const ok=await validate(true);
      if(!ok){ev.preventDefault();ev.stopImmediatePropagation();return;}
      const pn=$('pn'),pm=$('pm');
      const oldName=pn.value, oldMobile=pm.value;
      pn.value=`${$('pnPrefix').value} ${oldName}`.trim();
      pm.value='+91'+oldMobile.replace(/\D/g,'');
      setTimeout(()=>{pn.value=oldName;pm.value=oldMobile;},0);
    },true);
  }

  async function boot(){
    if(!setupMarkup()) return;
    const pst=$('pst'),pc=$('pc'),pp=$('pp'),pe=$('pe'),pm=$('pm');
    fillList('sg-state-list',states);
    await loadCities();
    pst.addEventListener('input',updateCities); pst.addEventListener('change',updateCities);
    pc.addEventListener('input',()=>{validate(false); if(citiesForState(pst.value).some(c=>norm(c)===norm(pc.value))) loadPincodes();});
    pc.addEventListener('change',loadPincodes);
    pp.addEventListener('input',validate);
    pe.addEventListener('input',validate); pm.addEventListener('input',()=>{pm.value=pm.value.replace(/\D/g,'').slice(0,10);validate(false);});
    ['pn','ps','pa'].forEach(id=>$(id)?.addEventListener('input',()=>validate(false)));
    $('pnPrefix')?.addEventListener('change',()=>validate(false));
    gateSubmit();
    validate(false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();
