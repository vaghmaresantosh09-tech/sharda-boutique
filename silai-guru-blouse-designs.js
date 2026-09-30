/* SILAI GURU blouse design visuals */
(function(){
  const oldVisual=window.designVisual;
  if(typeof oldVisual!=='function')return;
  window.designVisual=function(t,i){
    const x=String(t||'').toLowerCase();
    if(!(x.includes('blouse')||x.includes('choli'))) return oldVisual(t,i);
    const q=[['#f39ab2','#7a3550','#fff1f5'],['#d8b15a','#76510d','#fff8df'],['#4fa6a2','#174f4c','#e9fbfa'],['#6f82d8','#26356e','#eef1ff'],['#a97bd6','#513276','#f5efff'],['#e98a54','#743512','#fff0e8']][(+i||0)%6];
    const c=q[0],d=q[1],l=q[2];
    let neck='M76 58Q100 76 124 58';
    if(x.includes('padded'))neck='M72 60Q100 42 128 60';
    else if(x.includes('princess'))neck='M74 52Q100 70 126 52';
    else if(x.includes('boat'))neck='M70 54Q100 72 130 54';
    else if(x.includes('back open'))neck='M76 48Q100 82 124 48';
    else if(x.includes('patch'))neck='M72 52L100 78 128 52';
    else if(x.includes('collar'))neck='M78 46L100 66 122 46';
    else if(x.includes('deep neck'))neck='M78 48L100 90 122 48';
    else if(x.includes('high neck'))neck='M80 42H120V64Q100 78 80 64Z';
    else if(x.includes('net'))neck='M76 52Q100 74 124 52';
    const sleeve=x.includes('cold shoulder')
      ? '<path d="M65 42l-13 18 13 10 10-12M135 42l13 18-13 10-10-12" fill="'+c+'" stroke="'+d+'" stroke-width="5"/>'
      : '<path d="M65 42l-18 28 18 12 12-18M135 42l18 28-18 12-12-18" fill="'+c+'" stroke="'+d+'" stroke-width="5"/>';
    const extra=x.includes('net')
      ? '<path d="M78 48L100 82 122 48" fill="none" stroke="'+l+'" stroke-width="3" stroke-dasharray="4 4"/>'
      : x.includes('patch')
      ? '<path d="M82 62l8 8 8-8 8 8 8-8 8 8" fill="none" stroke="'+l+'" stroke-width="4"/>'
      : '';
    const id='sgb'+(+i||0);
    return '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="184" height="134" rx="22" fill="#fff"/><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+c+'"/><stop offset="1" stop-color="'+l+'"/></linearGradient></defs>'+sleeve+'<path d="M78 34h44l8 18 10 8-8 14-10-9v45H78V65l-10 9-8-14 10-8z" fill="url(#'+id+')" stroke="'+d+'" stroke-width="5"/><path d="'+neck+'" fill="none" stroke="'+l+'" stroke-width="6"/>'+extra+'</svg>';
  };
})();
