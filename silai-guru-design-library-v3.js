/* SILAI GURU DESIGN LIBRARY V3
   Real garment-specific CC photo sources + larger design catalog.
   Built-in library photos are not copied into each user's backup quota. */
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
  const terms={
    'Kurti':'women,kurti,indian,fashion','Blouse':'women,blouse,indian,fashion','Salwar Suit':'women,salwar,suit,indian,fashion','Kameez':'women,kameez,indian,fashion','Saree Blouse':'women,saree,blouse,indian,fashion','Lehenga':'women,lehenga,indian,fashion','Gown':'women,gown,evening,fashion','Dress':'women,dress,fashion','Shirt':'women,shirt,fashion','Pant':'women,pants,fashion','Salwar':'women,salwar,indian,fashion','Choli':'women,choli,indian,fashion','Sherwani':'men,sherwani,indian,fashion','Suit':'men,suit,formal,fashion','Blazer':'blazer,formal,fashion','Waistcoat':'waistcoat,men,fashion','Pajama':'pajama,indian,mens,fashion','School Uniform':'school,uniform,fashion','Coat':'coat,formal,fashion','Other':'indian,ethnic,fashion','Kurta':'men,kurta,indian,fashion','Plazo':'women,palazzo,fashion'
  };
  function slug(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,',').replace(/^,|,$/g,'');}
  function photo(type,name,index){
    const base=terms[type]||'indian,fashion,garment';
    const style=slug(name).replace(/,/g,',');
    const q=encodeURIComponent(base+','+style).replace(/%2C/g,',');
    const lock=(type.length*97 + name.length*31 + index*137 + 41);
    return 'https://loremflickr.com/600/800/'+q+'/all?lock='+lock;
  }
  function install(){
    if(!window.DESIGN_TYPES || !window.DESIGN_IMAGE_URLS)return;
    Object.keys(sets).forEach(function(type){
      if(!window.DESIGN_TYPES[type])window.DESIGN_TYPES[type]=[];
      window.DESIGN_TYPES[type]=sets[type].slice();
      if(!window.DESIGN_IMAGE_URLS[type])window.DESIGN_IMAGE_URLS[type]={};
      sets[type].forEach(function(name,i){window.DESIGN_IMAGE_URLS[type][name]=photo(type,name,i);});
    });
    /* The original garmentDesignsFor() reads DESIGN_IMAGE_URLS at render time. */
    window.__sgDesignLibraryV3=true;
  }
  install();
  window.addEventListener('load',install,{once:true});
})();
