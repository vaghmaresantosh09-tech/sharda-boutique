/* SILAI GURU — original blouse neck design library */
(function(){
  'use strict';
  const names=[
    'Round Neck Blouse','Deep Round Neck Blouse','V Neck Blouse','Deep V Neck Blouse',
    'Square Neck Blouse','Boat Neck Blouse','U Neck Blouse','Sweetheart Neck Blouse',
    'Keyhole Neck Blouse','Collar Neck Blouse','High Neck Blouse','Scallop Neck Blouse',
    'Pot Neck Blouse','Deep U Back Blouse','Dori Back Blouse','Diamond Back Blouse',
    'Window Back Blouse','Tie-Up Back Blouse','Pearl Dori Back Blouse','Butterfly Back Blouse',
    'Double Dori Back Blouse','Button Back Blouse','Maggam Neck Blouse','Designer Cut Neck Blouse'
  ];
  const palettes=[
    ['#e88aa6','#6f2947','#fff4f7'],['#d9b35c','#74510b','#fff9e7'],
    ['#55aaa5','#174e4a','#e9fbfa'],['#7187d9','#27376f','#eef1ff'],
    ['#a57bd2','#4f3275','#f6efff'],['#e78a58','#743714','#fff0e8']
  ];
  function svgFor(name,i){
    const x=name.toLowerCase(), q=palettes[i%palettes.length], c=q[0],d=q[1],l=q[2],id='sgbn'+i;
    const back=/(back|dori|diamond|window|tie-up|pearl|butterfly|button)/.test(x);
    let neck='M72 54 Q100 74 128 54';
    if(x.includes('deep round')) neck='M70 50 Q100 94 130 50';
    else if(x.includes('deep v')) neck='M70 48 L100 94 L130 48';
    else if(x.includes('v neck')) neck='M72 48 L100 80 L128 48';
    else if(x.includes('square')) neck='M72 48 H128 V76 Q100 88 72 76 Z';
    else if(x.includes('boat')) neck='M66 50 Q100 68 134 50';
    else if(x.includes('u neck')) neck='M72 48 Q72 82 100 88 Q128 82 128 48';
    else if(x.includes('sweetheart')) neck='M70 52 Q82 42 100 60 Q118 42 130 52 Q128 78 100 90 Q72 78 70 52';
    else if(x.includes('keyhole')) neck='M76 48 Q100 66 124 48 M100 62 a10 10 0 1 0 0 20 a10 10 0 1 0 0-20';
    else if(x.includes('collar')) neck='M76 46 L90 62 L100 52 L110 62 L124 46';
    else if(x.includes('high neck')) neck='M78 42 H122 V62 Q100 74 78 62 Z';
    else if(x.includes('scallop')) neck='M70 52 Q78 68 86 52 Q94 68 102 52 Q110 68 118 52 Q126 68 130 52';
    else if(x.includes('pot')) neck='M76 46 Q100 40 124 46 Q128 74 100 92 Q72 74 76 46';
    else if(x.includes('deep u')) neck='M70 48 Q70 98 100 108 Q130 98 130 48';
    else if(x.includes('diamond')) neck='M100 42 L132 70 L100 98 L68 70 Z';
    else if(x.includes('window')) neck='M72 46 H128 V94 H72 Z';
    else if(x.includes('tie-up')) neck='M70 48 Q100 86 130 48';
    else if(x.includes('dori')) neck='M70 48 Q100 78 130 48';
    else if(x.includes('butterfly')) neck='M100 58 Q78 40 68 58 Q82 78 100 70 Q118 78 132 58 Q122 40 100 58';
    else if(x.includes('button')) neck='M72 48 H128 V88 H72 Z';
    else if(x.includes('maggam')) neck='M72 50 Q100 78 128 50 M78 58 Q100 86 122 58';
    else if(x.includes('designer cut')) neck='M72 48 L88 66 L100 50 L112 66 L128 48 Q126 78 100 90 Q74 78 72 48';
    const body=back
      ? '<path d="M76 38h48l10 18 16 12-12 18-14-12v38H76V74L62 86 50 68l16-12z" fill="url(#'+id+')" stroke="'+d+'" stroke-width="5"/>'
      : '<path d="M76 38h48l10 18 16 12-12 18-14-12v38H76V74L62 86 50 68l16-12z" fill="url(#'+id+')" stroke="'+d+'" stroke-width="5"/>';
    let details='';
    if(x.includes('dori')||x.includes('tie-up')||x.includes('pearl')){
      details='<path d="M72 54 L100 104 L128 54" fill="none" stroke="'+l+'" stroke-width="4"/><circle cx="72" cy="54" r="4" fill="'+d+'"/><circle cx="128" cy="54" r="4" fill="'+d+'"/>';
    }
    if(x.includes('pearl')) details+='<circle cx="92" cy="88" r="3" fill="'+d+'"/><circle cx="100" cy="94" r="3" fill="'+d+'"/><circle cx="108" cy="88" r="3" fill="'+d+'"/>';
    if(x.includes('button')) details+='<circle cx="100" cy="60" r="3" fill="'+d+'"/><circle cx="100" cy="70" r="3" fill="'+d+'"/><circle cx="100" cy="80" r="3" fill="'+d+'"/>';
    if(x.includes('maggam')) details+='<circle cx="82" cy="60" r="2.5" fill="'+d+'"/><circle cx="90" cy="68" r="2.5" fill="'+d+'"/><circle cx="110" cy="68" r="2.5" fill="'+d+'"/><circle cx="118" cy="60" r="2.5" fill="'+d+'"/>';
    return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img"><rect x="7" y="7" width="186" height="136" rx="22" fill="#fff"/><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+c+'"/><stop offset="1" stop-color="'+l+'"/></linearGradient></defs>'+body+'<path d="'+neck+'" fill="none" stroke="'+l+'" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'+details+'</svg>';
  }
  function install(){
    if(!window.DESIGN_TYPES || typeof window.designVisual!=='function') return;
    window.DESIGN_TYPES.Blouse=names.slice();
    window.DESIGN_IMAGE_URLS=window.DESIGN_IMAGE_URLS||{};
    /* Do not use random internet photos for blouse cards. */
    window.DESIGN_IMAGE_URLS.Blouse={};
    const old=window.designVisual;
    window.designVisual=function(t,i){
      const x=String(t||'').toLowerCase();
      if(x==='blouse'||x.includes('blouse')) return svgFor(names[Number(i)||0]||names[0],Number(i)||0);
      return old(t,i);
    };
    window.__sgBlouseNeckV2=true;
  }
  install();
  window.addEventListener('load',install,{once:true});
})();
