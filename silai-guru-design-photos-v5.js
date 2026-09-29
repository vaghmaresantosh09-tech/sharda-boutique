/* SILAI GURU DESIGN PHOTOS V6
   Expanded shared garment-category design library.
   Built-in design images are presentation assets and are not copied into user backup storage.
*/
(function(){
  'use strict';

  const tags={
    Kurti:'women,kurti,indian,clothing,fashion',
    Blouse:'women,blouse,indian,clothing,fashion',
    'Salwar Suit':'women,salwar,kameez,indian,clothing,fashion',
    Kameez:'women,kameez,indian,clothing,fashion',
    'Saree Blouse':'women,saree,blouse,indian,clothing,fashion',
    Lehenga:'women,lehenga,indian,clothing,fashion',
    Gown:'women,gown,evening,dress,fashion',
    Dress:'women,dress,clothing,fashion',
    Shirt:'women,shirt,clothing,fashion',
    Pant:'women,pants,trousers,clothing,fashion',
    Salwar:'women,salwar,indian,clothing,fashion',
    Choli:'women,choli,indian,clothing,fashion',
    Sherwani:'men,sherwani,indian,clothing,fashion',
    Suit:'men,suit,formal,clothing,fashion',
    Blazer:'men,blazer,formal,clothing,fashion',
    Waistcoat:'men,waistcoat,formal,clothing,fashion',
    Pajama:'men,pajama,indian,clothing,fashion',
    'School Uniform':'school,uniform,clothing,fashion',
    Coat:'coat,outerwear,clothing,fashion',
    Other:'indian,ethnic,clothing,fashion',
    Kurta:'men,kurta,indian,clothing,fashion',
    Plazo:'women,palazzo,pants,indian,clothing,fashion'
  };

  const names={
    Kurti:['Straight Kurti','A-Line Kurti','Anarkali Kurti','Long Kurti','Rayon Kurti','Palazzo Kurti','Angrakha Kurti','High-Low Kurti','Front Slit Kurti','Cowl Kurti','Flared Kurti','Short Kurti','Side Slit Kurti','Collar Kurti','Panel Kurti','Asymmetric Kurti','Layered Kurti','Princess Kurti','Printed Kurti','Embroidered Kurti','Office Kurti','Festive Kurti','Denim Kurti','Jacket Style Kurti'],
    Blouse:['Padded Blouse','Princess Cut Blouse','Boat Neck Blouse','Back Open Blouse','Patch Work Blouse','Silk Blouse','Collar Neck Blouse','Deep Neck Blouse','Elbow Sleeve Blouse','Cold Shoulder Blouse','High Neck Blouse','Net Blouse','Sweetheart Blouse','V Neck Blouse','Square Neck Blouse','Halter Neck Blouse','Peplum Blouse','Cape Blouse','Keyhole Blouse','Ruffle Sleeve Blouse','Back Tie Blouse','Full Sleeve Blouse','Sleeveless Blouse','Embroidered Blouse'],
    'Salwar Suit':['Straight Suit','Anarkali Suit','Palazzo Suit','Patiala Suit','Punjabi Suit','Sharara Suit','Churidar Suit','Afghani Suit','Front Slit Suit','Layered Suit','Jacket Suit','Angrakha Suit','Floor Length Suit','Short Kurta Suit','Printed Suit','Embroidered Suit','Party Wear Suit','Office Wear Suit','Cotton Suit','Silk Suit','Georgette Suit','Festive Suit','Peplum Suit','Cape Style Suit'],
    Kameez:['Straight Kameez','Anarkali Kameez','A-Line Kameez','Long Kameez','Short Kameez','Panel Kameez','Angrakha Kameez','Flared Kameez','Front Slit Kameez','Side Slit Kameez','Collar Kameez','Jacket Kameez','Layered Kameez','Asymmetric Kameez','Printed Kameez','Embroidered Kameez','Festive Kameez','Party Kameez','Cotton Kameez','Silk Kameez','Chiffon Kameez','Net Kameez','Peplum Kameez','Cape Kameez'],
    'Saree Blouse':['Classic Saree Blouse','Padded Saree Blouse','Princess Saree Blouse','Boat Neck Saree Blouse','Back Open Saree Blouse','Deep Neck Saree Blouse','High Neck Saree Blouse','Collar Saree Blouse','Elbow Sleeve Saree Blouse','Full Sleeve Saree Blouse','Sleeveless Saree Blouse','Halter Saree Blouse','Peplum Saree Blouse','Cape Saree Blouse','Ruffle Saree Blouse','Keyhole Saree Blouse','Square Neck Saree Blouse','Sweetheart Saree Blouse','Back Tie Saree Blouse','Embroidered Saree Blouse','Net Saree Blouse','Silk Saree Blouse','Mirror Work Blouse','Party Wear Blouse'],
    Lehenga:['Bridal Lehenga','A-Line Lehenga','Flared Lehenga','Panel Lehenga','Circular Lehenga','Fish Cut Lehenga','Layered Lehenga','Peplum Lehenga','Jacket Lehenga','Cape Lehenga','Sharara Lehenga','Pastel Lehenga','Silk Lehenga','Velvet Lehenga','Embroidered Lehenga','Mirror Work Lehenga','Sequin Lehenga','Festive Lehenga','Reception Lehenga','Sangeet Lehenga','Printed Lehenga','Minimal Lehenga','Modern Lehenga','Traditional Lehenga'],
    Gown:['Anarkali Gown','A-Line Gown','Flared Gown','Floor Length Gown','Mermaid Gown','Princess Gown','Cape Gown','Jacket Gown','One Shoulder Gown','Off Shoulder Gown','High Neck Gown','V Neck Gown','Ruffle Gown','Layered Gown','Sequin Gown','Embroidered Gown','Party Gown','Bridal Gown','Reception Gown','Silk Gown','Velvet Gown','Net Gown','Sleeve Gown','Minimal Gown'],
    Dress:['A-Line Dress','Maxi Dress','Midi Dress','Shirt Dress','Wrap Dress','Fit & Flare Dress','Bodycon Dress','Princess Dress','Tiered Dress','Kaftan Dress','Cape Dress','Ruffle Dress','Pleated Dress','Flared Dress','One Shoulder Dress','Off Shoulder Dress','High Neck Dress','V Neck Dress','Denim Dress','Cotton Dress','Party Dress','Floral Dress','Embroidered Dress','Long Sleeve Dress'],
    Shirt:['Classic Shirt','Slim Fit Shirt','Oversized Shirt','Long Shirt','Tunic Shirt','Mandarin Collar Shirt','Peter Pan Collar Shirt','Bow Collar Shirt','Ruffle Shirt','Pleated Shirt','Wrap Shirt','Cropped Shirt','Peplum Shirt','Denim Shirt','Linen Shirt','Cotton Shirt','Printed Shirt','Embroidered Shirt','Office Shirt','Party Shirt','Full Sleeve Shirt','Half Sleeve Shirt','Bell Sleeve Shirt','Layered Shirt'],
    Pant:['Straight Pant','Wide Leg Pant','Palazzo Pant','Cigarette Pant','Ankle Pant','Flared Pant','Bootcut Pant','Tapered Pant','Pleated Pant','Paperbag Pant','Cargo Pant','Jogger Pant','Dhoti Pant','Sharara Pant','Patiala Pant','Culotte Pant','High Waist Pant','Mid Waist Pant','Side Zip Pant','Front Zip Pant','Printed Pant','Cotton Pant','Denim Pant','Formal Pant'],
    Salwar:['Classic Salwar','Patiala Salwar','Churidar Salwar','Afghani Salwar','Dhoti Salwar','Parallel Salwar','Straight Salwar','Low Crotch Salwar','Pleated Salwar','Gathered Salwar','Elastic Waist Salwar','Cotton Salwar','Silk Salwar','Printed Salwar','Embroidered Salwar','Party Salwar','Loose Salwar','Narrow Salwar','Ankle Salwar','Full Length Salwar','Sharara Salwar','Jacket Salwar','Festive Salwar','Classic Punjabi Salwar'],
    Choli:['Classic Choli','Bridal Choli','Back Open Choli','Deep Neck Choli','High Neck Choli','Padded Choli','Princess Choli','Boat Neck Choli','Sleeveless Choli','Full Sleeve Choli','Elbow Sleeve Choli','Halter Choli','Peplum Choli','Cape Choli','Ruffle Choli','Embroidered Choli','Mirror Work Choli','Sequin Choli','Silk Choli','Velvet Choli','Party Choli','Festive Choli','Modern Choli','Traditional Choli'],
    Sherwani:['Classic Sherwani','Achkan Sherwani','Jodhpuri Sherwani','Indo-Western Sherwani','Bandhgala Sherwani','Asymmetric Sherwani','Long Sherwani','Short Sherwani','Embroidered Sherwani','Silk Sherwani','Velvet Sherwani','Jacquard Sherwani','Printed Sherwani','Pastel Sherwani','Royal Sherwani','Wedding Sherwani','Reception Sherwani','Party Sherwani','Minimal Sherwani','Mirror Work Sherwani','Thread Work Sherwani','Button Detail Sherwani','Layered Sherwani','Modern Sherwani'],
    Suit:['Two Piece Suit','Three Piece Suit','Slim Fit Suit','Classic Fit Suit','Double Breasted Suit','Single Breasted Suit','Tuxedo Suit','Bandhgala Suit','Jodhpuri Suit','Wedding Suit','Party Suit','Formal Suit','Business Suit','Linen Suit','Cotton Suit','Velvet Suit','Printed Suit','Check Suit','Stripe Suit','Plain Suit','Peak Lapel Suit','Notch Lapel Suit','Shawl Collar Suit','Modern Suit'],
    Blazer:['Classic Blazer','Slim Fit Blazer','Double Breasted Blazer','Single Breasted Blazer','Bandhgala Blazer','Nehru Blazer','Jacket Blazer','Long Blazer','Cropped Blazer','Textured Blazer','Printed Blazer','Check Blazer','Stripe Blazer','Linen Blazer','Velvet Blazer','Party Blazer','Wedding Blazer','Office Blazer','Casual Blazer','Formal Blazer','Peak Lapel Blazer','Notch Lapel Blazer','Shawl Collar Blazer','Modern Blazer'],
    Waistcoat:['Classic Waistcoat','Nehru Waistcoat','Jodhpuri Waistcoat','Single Breasted Waistcoat','Double Breasted Waistcoat','Long Waistcoat','Short Waistcoat','Printed Waistcoat','Check Waistcoat','Stripe Waistcoat','Silk Waistcoat','Velvet Waistcoat','Linen Waistcoat','Cotton Waistcoat','Wedding Waistcoat','Party Waistcoat','Formal Waistcoat','Casual Waistcoat','Embroidered Waistcoat','Textured Waistcoat','Button Detail Waistcoat','Contrast Waistcoat','Layered Waistcoat','Modern Waistcoat'],
    Pajama:['Classic Pajama','Straight Pajama','Pathani Pajama','Churidar Pajama','Afghani Pajama','Loose Pajama','Narrow Pajama','Cotton Pajama','Silk Pajama','Linen Pajama','Printed Pajama','Embroidered Pajama','Party Pajama','Wedding Pajama','Festive Pajama','Pathani Style Pajama','Elastic Pajama','Drawstring Pajama','Ankle Pajama','Full Length Pajama','Comfort Pajama','Traditional Pajama','Modern Pajama','Royal Pajama'],
    'School Uniform':['Boys Uniform','Girls Uniform','Shirt & Pant Uniform','Shirt & Skirt Uniform','Tunic Uniform','Pinafore Uniform','Blazer Uniform','Winter Uniform','Summer Uniform','Sports Uniform','House Uniform','Primary Uniform','Senior Uniform','Formal Uniform','Daily Uniform','Assembly Uniform','Tie Uniform','Sweater Uniform','Cardigan Uniform','Track Uniform','Lab Uniform','Activity Uniform','School Dress','School Kurta'],
    Coat:['Classic Coat','Long Coat','Short Coat','Trench Coat','Overcoat','Peacoat','Double Breasted Coat','Single Breasted Coat','Fitted Coat','Flared Coat','Cape Coat','Collar Coat','Hooded Coat','Wool Coat','Cashmere Coat','Winter Coat','Formal Coat','Party Coat','Printed Coat','Check Coat','Belted Coat','Button Coat','Layered Coat','Modern Coat'],
    Kurta:['Classic Kurta','Straight Kurta','Long Kurta','Short Kurta','Pathani Kurta','A-Line Kurta','Angrakha Kurta','Asymmetric Kurta','Collar Kurta','Band Collar Kurta','Front Slit Kurta','Side Slit Kurta','Jacket Kurta','Layered Kurta','Printed Kurta','Embroidered Kurta','Cotton Kurta','Silk Kurta','Linen Kurta','Festive Kurta','Wedding Kurta','Party Kurta','Minimal Kurta','Modern Kurta'],
    Plazo:['Classic Palazzo','Wide Leg Palazzo','Printed Palazzo','Pleated Palazzo','Layered Palazzo','High Waist Palazzo','Elastic Waist Palazzo','Side Pocket Palazzo','Flared Palazzo','Party Palazzo','Festive Palazzo','Cotton Palazzo','Silk Palazzo','Georgette Palazzo','Embroidered Palazzo','Plain Palazzo','Striped Palazzo','Floral Palazzo','Ankle Palazzo','Full Length Palazzo','Sharara Palazzo','Palazzo Pant','Palazzo Suit Bottom','Modern Palazzo'],
    Other:['Classic Ethnic Design','Modern Ethnic Design','Festive Design','Party Wear Design','Wedding Design','Traditional Design','Contemporary Design','Minimal Design','Embroidered Design','Printed Design','Silk Design','Cotton Design','Designer Cut','Layered Design','Jacket Style','Cape Style','Flared Style','Straight Style','A-Line Style','Asymmetric Style','Collar Style','High Neck Style','V Neck Style','Custom Style']
  };

  function typeFromPage(){
    if(window.currentDesignType && tags[window.currentDesignType]) return window.currentDesignType;
    const h=[...document.querySelectorAll('h1,h2,h3,h4,.design-back,.folder-box')].map(x=>x.textContent||'').join(' ');
    const names=Object.keys(tags).sort((a,b)=>b.length-a.length);
    const low=h.toLowerCase();
    return names.find(t=>low.includes(t.toLowerCase())) || 'Other';
  }

  function imageUrl(type,index,name){
    const base=(tags[type]||tags.Other).replace(/\s+/g,',');
    const lock=((type.length+1)*1009+(index+1)*7919)%999999;
    return 'https://loremflickr.com/600/800/'+base+'?lock='+lock;
  }

  function makeCard(type,name,index){
    const card=document.createElement('div');
    card.className='design-card sg-v6-card';
    card.innerHTML='<div class="design-img"><img class="sg-v6-photo" loading="lazy" alt="'+name.replace(/"/g,'&quot;')+'" src="'+imageUrl(type,index,name)+'"></div><div class="design-name">'+name+'</div><div class="design-actions"><button type="button">☆ Save</button><button type="button">🛍️ Buy Material</button><button type="button">👁️ Show</button></div>';
    return card;
  }

  function patch(){
    const grid=document.querySelector('.design-grid');
    if(!grid) return;
    const type=typeFromPage();
    const list=names[type]||names.Other;
    grid.dataset.sgV6Type=type;

    let cards=[...grid.querySelectorAll('.design-card')];
    cards.forEach((card,i)=>{
      const nameEl=card.querySelector('.design-name');
      if(i<list.length && nameEl) nameEl.textContent=list[i];
      const box=card.querySelector('.design-img');
      if(box){
        let img=box.querySelector('img.sg-v6-photo');
        if(!img){
          img=document.createElement('img');
          img.className='sg-v6-photo';
          img.loading='lazy';
          box.prepend(img);
        }
        img.alt=list[i]||type+' design';
        img.src=imageUrl(type,i,list[i]||type+' design');
        img.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
        const svg=box.querySelector('svg'); if(svg) svg.style.display='none';
      }
    });

    cards=[...grid.querySelectorAll('.design-card')];
    for(let i=cards.length;i<list.length;i++) grid.appendChild(makeCard(type,list[i],i));

    // Keep exactly the expanded library count and remove accidental duplicate cards from old patches.
    [...grid.querySelectorAll('.sg-v6-card')].forEach((card,i)=>{
      if(i>=list.length) card.remove();
    });

    const countEl=document.querySelector('.folder-count');
    if(countEl) countEl.textContent=list.length+' Designs';
    const heading=[...document.querySelectorAll('h1,h2,h3')].find(x=>/\d+\s*Designs/i.test(x.textContent||''));
    if(heading) heading.textContent=type+' · '+list.length+' Designs';
  }

  function start(){
    patch();
    let busy=false;
    const mo=new MutationObserver(()=>{
      if(busy) return;
      busy=true;
      requestAnimationFrame(()=>{patch();busy=false;});
    });
    mo.observe(document.body,{childList:true,subtree:true});
    [500,1200,2500,4500].forEach(ms=>setTimeout(patch,ms));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
