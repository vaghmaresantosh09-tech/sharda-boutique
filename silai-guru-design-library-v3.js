/* SILAI GURU FINAL DESIGN LIBRARY
   One clean source for the built-in garment design library.
   No loremflickr/stock-photo URLs: built-in designs do not consume a user's backup quota.
*/
(function(){
  'use strict';
  const sets={
    'Kurti':['Straight Kurti','A-Line Kurti','Anarkali Kurti','Long Kurti','Rayon Kurti','Palazzo Kurti','High-Low Kurti','Cotton Kurti','Party Wear Kurti','Short Kurti','Embroidered Kurti','Flared Kurti','V-Neck Kurti','Square Neck Kurti','Angrakha Kurti','Asymmetric Kurti','Chikankari Kurti','Block Print Kurti','Tiered Kurti','Designer Kurti'],
    'Blouse':['Padded Blouse','Princess Cut Blouse','Boat Neck Blouse','Back Open Blouse','Patch Work Blouse','Silk Blouse','Collar Neck Blouse','Deep Neck Blouse','Elbow Sleeve Blouse','Cold Shoulder Blouse','High Neck Blouse','Net Blouse','V-Neck Blouse','Round Neck Blouse','Square Neck Blouse','Sweetheart Blouse','Halter Neck Blouse','Peplum Blouse','Angrakha Blouse','Boat Back Blouse'],
    'Salwar Suit':['Straight Suit','Anarkali Suit','Palazzo Suit','Patiala Suit','Punjabi Suit','Sharara Suit','Churidar Suit','Cotton Suit','Party Wear Suit','Embroidered Suit','Printed Suit','Rayon Suit','A-Line Suit','Angrakha Suit','Jacket Suit','Gharara Suit','Layered Suit','Cape Suit','Festive Suit','Designer Suit'],
    'Kameez':['Straight Kameez','A-Line Kameez','Long Kameez','Embroidered Kameez','Front Slit Kameez','Side Slit Kameez','Cotton Kameez','Silk Kameez','Party Wear Kameez','Printed Kameez','High Neck Kameez','Designer Kameez','Anarkali Kameez','Angrakha Kameez','Panelled Kameez','Cape Kameez','Short Kameez','Festive Kameez','Collar Kameez','Layered Kameez'],
    'Saree Blouse':['Boat Neck','Sweetheart Neck','V Neck','Round Neck','Deep Back','Backless','High Neck','Elbow Sleeve','Puff Sleeve','Princess Cut','Peplum Blouse','Designer Blouse','Square Neck','Halter Neck','Keyhole Neck','U Neck','Collar Blouse','Back Tie Blouse','Ruffle Blouse','Embroidered Blouse'],
    'Lehenga':['Bridal Lehenga','A-Line Lehenga','Flared Lehenga','Panel Lehenga','Circular Lehenga','Sharara Lehenga','Printed Lehenga','Embroidered Lehenga','Party Lehenga','Silk Lehenga','Velvet Lehenga','Designer Lehenga','Panelled Lehenga','Ruffle Lehenga','Layered Lehenga','Indo-Western Lehenga','Mirror Work Lehenga','Sequin Lehenga','Pastel Lehenga','Festive Lehenga'],
    'Gown':['A-Line Gown','Ball Gown','Mermaid Gown','Empire Gown','Cape Gown','Tiered Gown','Anarkali Gown','Off Shoulder Gown','One Shoulder Gown','Floor Length Gown','Party Gown','Reception Gown','Embroidered Gown','Sequin Gown','Velvet Gown','Satin Gown','Printed Gown','Flared Gown','Designer Gown','Bridal Gown'],
    'Dress':['A-Line Dress','Fit and Flare Dress','Maxi Dress','Midi Dress','Shirt Dress','Wrap Dress','Tiered Dress','Princess Dress','Bodycon Dress','Kaftan Dress','Ruffle Dress','Pleated Dress','Floral Dress','Party Dress','Office Dress','Denim Dress','Embroidered Dress','Printed Dress','Long Dress','Designer Dress'],
    'Shirt':['Classic Shirt','Mandarin Collar Shirt','Peter Pan Collar Shirt','Peplum Shirt','Tunic Shirt','Longline Shirt','Ruffle Shirt','Oversized Shirt','Embroidered Shirt','Printed Shirt','Cuban Collar Shirt','Band Collar Shirt','Floral Shirt','Linen Shirt','Denim Shirt','Party Shirt','Formal Shirt','Short Shirt','Long Shirt','Designer Shirt'],
    'Pant':['Straight Pant','Slim Pant','Wide Leg Pant','Flared Pant','Cigarette Pant','Cargo Pant','Ankle Pant','Palazzo Pant','Tapered Pant','Pleated Pant','Bootcut Pant','Jogger Pant','Dhoti Pant','Culotte Pant','High Waist Pant','Paperbag Pant','Printed Pant','Formal Pant','Party Pant','Designer Pant'],
    'Salwar':['Patiala Salwar','Dhoti Salwar','Churidar Salwar','Straight Salwar','Semi Patiala Salwar','Afghani Salwar','Parallel Salwar','Tulip Salwar','Aladdin Salwar','Sharara Salwar','Gharara Salwar','Cotton Salwar','Rayon Salwar','Silk Salwar','Printed Salwar','Embroidered Salwar','Party Salwar','Loose Salwar','Slim Salwar','Designer Salwar'],
    'Choli':['Short Choli','Long Choli','Peplum Choli','Sleeveless Choli','Off Shoulder Choli','High Neck Choli','Backless Choli','Embroidered Choli','Princess Choli','Boat Neck Choli','Sweetheart Choli','Halter Choli','Ruffle Choli','Mirror Work Choli','Sequin Choli','Festive Choli','Bridal Choli','Printed Choli','Silk Choli','Designer Choli'],
    'Sherwani':['Classic Sherwani','Achkan Sherwani','Jodhpuri Sherwani','Indo-Western Sherwani','Embroidered Sherwani','Bandhgala Sherwani','Long Sherwani','Wedding Sherwani','Designer Sherwani','Silk Sherwani','Velvet Sherwani','Printed Sherwani','Pastel Sherwani','Royal Sherwani','Party Sherwani','Short Sherwani','Flared Sherwani','Textured Sherwani','Festive Sherwani','Groom Sherwani'],
    'Suit':['Straight Suit','A-Line Suit','Jacket Suit','Bandhgala Suit','Three Piece Suit','Designer Suit','Wedding Suit','Formal Suit','Party Suit','Embroidered Suit','Printed Suit','Velvet Suit','Silk Suit','Linen Suit','Slim Fit Suit','Classic Suit','Festive Suit','Reception Suit','Indo-Western Suit','Royal Suit'],
    'Blazer':['Single Button Blazer','Double Button Blazer','Cropped Blazer','Longline Blazer','Peplum Blazer','Tuxedo Blazer','Collarless Blazer','Printed Blazer','Oversized Blazer','Slim Fit Blazer','Velvet Blazer','Linen Blazer','Denim Blazer','Party Blazer','Formal Blazer','Embroidered Blazer','Checked Blazer','Pastel Blazer','Cropped Tuxedo Blazer','Designer Blazer'],
    'Waistcoat':['Classic Waistcoat','Long Waistcoat','Cropped Waistcoat','Embroidered Waistcoat','Nehru Waistcoat','Buttoned Waistcoat','Printed Waistcoat','Layered Waistcoat','Bandhgala Waistcoat','Denim Waistcoat','Silk Waistcoat','Velvet Waistcoat','Linen Waistcoat','Party Waistcoat','Wedding Waistcoat','Formal Waistcoat','Checked Waistcoat','Textured Waistcoat','Indo-Western Waistcoat','Designer Waistcoat'],
    'Pajama':['Straight Pajama','Churidar Pajama','Pathani Pajama','Cotton Pajama','Silk Pajama','Loose Pajama','Slim Pajama','Embroidered Pajama','Printed Pajama','Festive Pajama','Party Pajama','Comfort Pajama','Linen Pajama','Rayon Pajama','Designer Pajama','Classic Pajama','Wedding Pajama','Pathani Bottom','Pleated Pajama','Wide Pajama'],
    'School Uniform':['Summer Uniform','Winter Uniform','House Uniform','Sports Uniform','Prefect Uniform','Girls Uniform','Boys Uniform','Formal Uniform','School Shirt','School Trouser','School Skirt','School Blazer','School Kurta','School Salwar','School Tie Look','Primary Uniform','Secondary Uniform','Sports Kit','Assembly Uniform','Special Event Uniform'],
    'Coat':['Long Coat','Short Coat','Overcoat','Trench Coat','Tailored Coat','Cape Coat','Nehru Coat','Winter Coat','Wool Coat','Rain Coat','Double Breasted Coat','Single Breasted Coat','Longline Coat','Formal Coat','Party Coat','Wedding Coat','Velvet Coat','Printed Coat','Checked Coat','Designer Coat'],
    'Other':['Designer Set','Fusion Wear','Festive Wear','Casual Wear','Party Wear','Wedding Wear','Custom Style','Latest Style','Indo-Western Set','Co-Ord Set','Ethnic Set','Daily Wear Set','Office Wear Set','Brunch Wear','Resort Wear','Traditional Set','Modern Set','Embroidered Set','Printed Set','Designer Collection'],
    'Kurta':['Straight Kurta','Pathani Kurta','Short Kurta','Long Kurta','A-Line Kurta','Angrakha Kurta','Embroidered Kurta','Printed Kurta','Cotton Kurta','Silk Kurta','Party Wear Kurta','Designer Kurta','Bandhgala Kurta','Nehru Kurta','Pathani Style Kurta','Asymmetric Kurta','Longline Kurta','Festive Kurta','Linen Kurta','Wedding Kurta'],
    'Plazo':['Straight Palazzo','Flared Palazzo','Wide Leg Palazzo','Pleated Palazzo','Printed Palazzo','Cotton Palazzo','Rayon Palazzo','Party Wear Palazzo','Embroidered Palazzo','High Waist Palazzo','Palazzo Pants','Designer Palazzo','Silk Palazzo','Linen Palazzo','Layered Palazzo','Crushed Palazzo','Sharara Palazzo','Festive Palazzo','Daily Wear Palazzo','Wide Flare Palazzo']
  };

  const colors=['#e78aa8','#5d9de2','#d4a447','#69b7a7','#967fd0','#e47c58','#60758e','#d46b88','#7ea35c','#b98562','#6880c2','#b9689d','#e09c43','#679f88','#8d68b7'];
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  function wrap(body){return `<svg viewBox="0 0 400 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="garment design"><rect width="400" height="480" rx="24" fill="#faf9ff"/>${body}</svg>`}
  function detail(i,c){const dark='#3f3857';const gold='#d6a33d';const v=i%6;return `<path d="M170 ${105+v*2} Q200 ${118+v*3} 230 ${105+v*2}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M${170-v} 190 L${230+v} 190" stroke="#fff" stroke-width="4" opacity=".9"/><circle cx="200" cy="225" r="5" fill="${gold}"/><circle cx="200" cy="250" r="4" fill="${gold}"/><path d="M165 275 Q200 ${295+(i%4)*5} 235 275" fill="none" stroke="${dark}" stroke-width="3" opacity=".45"/>`}
  function top(type,i,c){
    const necks=[`M168 100 Q200 130 232 100`,`M168 100 L200 132 L232 100`,`M168 100 Q200 78 232 100`,`M174 102 Q200 116 226 102`,`M170 100 L200 116 L230 100`,`M180 100 Q200 92 220 100`];
    const n=necks[i%necks.length];
    const sleeve=i%5===0?`M165 108 L118 150 L138 184 L174 158`:i%5===1?`M164 112 L125 142 L145 166 L178 150`:i%5===2?`M166 112 L116 128 L130 170 L176 150`:i%5===3?`M168 110 L130 155 L154 180 L181 151`:`M166 112 L120 145 L142 177 L178 150`;
    const sleeve2=sleeve.replace(/M165|M164|M166|M168/g,'M235').replace(/L118|L125|L116|L130|L120/g,'L282').replace(/L138|L145|L130|L154|L142/g,'L262').replace(/L174|L178|L176|L181/g,'L222').replace(/L158|L150|L170|L151/g,'L250').replace(/L184|L166|L177|L180/g,'L274');
    const hem=i%4===0?'Q200 360 320 340':i%4===1?'L320 350':i%4===2?'Q200 345 320 350':'L320 340';
    const long=i%3===0;
    return wrap(`<path d="M${long?'175':'180'} 100 ${n} L${long?'165':'180'} 160 L${long?'150':'165'} 300 ${hem} L${long?'250':'235'} 300 L${long?'235':'160'} 160 Z" fill="${c}" stroke="#4a3e61" stroke-width="5"/><path d="${sleeve} Z" fill="${c}" stroke="#4a3e61" stroke-width="5"/><path d="${sleeve2} Z" fill="${c}" stroke="#4a3e61" stroke-width="5"/>${detail(i,c)}<path d="M165 300 Q200 320 235 300" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>`)
  }
  function lower(type,i,c){
    const wide=i%4===2||i%4===3;const high=wide?120:140;const hem=wide?350:365;
    return wrap(`<path d="M150 ${high} L190 ${high} L198 ${260} L${wide?'115':'160'} ${hem} L${wide?'200':'200'} ${hem-8} L${wide?'285':'240'} ${hem} L202 260 L210 ${high} Z" fill="${c}" stroke="#4a3e61" stroke-width="5"/><path d="M180 ${high+15} Q200 ${high+28} 220 ${high+15}" fill="none" stroke="#fff" stroke-width="7"/><path d="M200 160 L200 275" stroke="#fff" stroke-width="4" opacity=".65"/>${i%3===0?'<path d="M150 320 L250 320" stroke="#d6a33d" stroke-width="7" opacity=".9"/>':''}${i%5===0?'<circle cx="200" cy="210" r="6" fill="#d6a33d"/>':''}`)
  }
  function dress(type,i,c){
    const flare=145+(i%5)*18;const y=330+(i%3)*10;
    return wrap(`<path d="M170 100 Q200 ${125+(i%4)*3} 230 100 L245 185 Q${200+flare} 275 200 ${y} Q${200-flare} 275 155 185 Z" fill="${c}" stroke="#4a3e61" stroke-width="5"/><path d="M170 105 L128 145 L145 180 L174 158" fill="${c}" stroke="#4a3e61" stroke-width="5"/><path d="M230 105 L272 145 L255 180 L226 158" fill="${c}" stroke="#4a3e61" stroke-width="5"/>${detail(i,c)}<path d="M150 245 Q200 260 250 245" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/>${i%2?'<path d="M165 285 Q200 305 235 285" fill="none" stroke="#d6a33d" stroke-width="5"/>':''}`)
  }
  function coat(type,i,c){return wrap(`<path d="M166 96 Q200 120 234 96 L270 155 L245 175 L235 350 L165 350 L155 175 L130 155 Z" fill="${c}" stroke="#403852" stroke-width="6"/><path d="M166 96 L200 155 L234 96" fill="#fffaf4" stroke="#403852" stroke-width="5"/><path d="M200 155 L200 350" stroke="#403852" stroke-width="4"/>${[0,1,2].map(k=>`<circle cx="${200+(i%2?4:-4)}" cy="${205+k*42}" r="6" fill="#d6a33d"/>`).join('')}${i%3===0?'<path d="M155 175 L110 220 M245 175 L290 220" stroke="#403852" stroke-width="18" stroke-linecap="round"/>':''}`)}
  function sherwani(type,i,c){return wrap(`<path d="M170 82 Q200 112 230 82 L258 145 L240 165 L230 365 L170 365 L160 165 L142 145 Z" fill="${c}" stroke="#403852" stroke-width="6"/><path d="M170 82 L200 125 L230 82" fill="#fffaf4" stroke="#403852" stroke-width="5"/><path d="M200 125 L200 365" stroke="#403852" stroke-width="4"/>${[0,1,2,3].map(k=>`<circle cx="200" cy="${165+k*45}" r="5" fill="#d6a33d"/>`).join('')}<path d="M172 300 Q200 ${280+(i%3)*12} 228 300" fill="none" stroke="#d6a33d" stroke-width="6"/>`)}
  function school(i,c){return wrap(`<path d="M165 95 L235 95 L260 160 L235 185 L225 350 L175 350 L165 185 L140 160 Z" fill="${c}" stroke="#403852" stroke-width="6"/><path d="M165 95 L200 135 L235 95" fill="#fff" stroke="#403852" stroke-width="5"/><path d="M200 135 L200 350" stroke="#403852" stroke-width="4"/>${i%2?'<path d="M145 160 L115 190 L140 215" stroke="#403852" stroke-width="14" fill="none"/>':'<path d="M255 160 L285 190 L260 215" stroke="#403852" stroke-width="14" fill="none"/>'}<path d="M178 230 L222 230" stroke="#fff" stroke-width="6"/>`)}
  function visual(type,i){
    const c=colors[i%colors.length];
    if(type==='Pant'||type==='Salwar'||type==='Pajama'||type==='Plazo') return lower(type,i,c);
    if(type==='Gown'||type==='Dress'||type==='Lehenga') return dress(type,i,c);
    if(type==='Coat'||type==='Blazer'||type==='Waistcoat'||type==='Suit') return coat(type,i,c);
    if(type==='Sherwani') return sherwani(type,i,c);
    if(type==='School Uniform') return school(i,c);
    return top(type,i,c);
  }

  window.designVisual=visual;
  if(typeof DESIGN_TYPES!=='undefined'){
    Object.keys(sets).forEach(function(type){DESIGN_TYPES[type]=sets[type].slice();});
  }
  window.DESIGN_IMAGE_URLS=window.DESIGN_IMAGE_URLS||{};
  Object.keys(sets).forEach(function(type){
    window.DESIGN_IMAGE_URLS[type]={};
    sets[type].forEach(function(name){window.DESIGN_IMAGE_URLS[type][name]='';});
  });
  window.__sgDesignLibraryFinal=true;
})();
