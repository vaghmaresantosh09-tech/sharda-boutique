from pathlib import Path
import re

p = Path('silai-guru.html')
s = p.read_text(encoding='utf-8')

# Expand each garment folder with a useful set of named designs.
extra = {
    'Kurti':['V-Neck Kurti','Square Neck Kurti','Angrakha Kurti','Asymmetric Kurti','Chikankari Kurti','Block Print Kurti','Tiered Kurti','Designer Kurti'],
    'Blouse':['V-Neck Blouse','Round Neck Blouse','Square Neck Blouse','Sweetheart Blouse','Halter Neck Blouse','Peplum Blouse','Angrakha Blouse','Boat Back Blouse'],
    'Salwar Suit':['A-Line Suit','Angrakha Suit','C-Cut Suit','Layered Suit','Cape Suit','Jacket Suit','Gharara Suit','Sharara Kurta Suit'],
    'Kameez':['Straight Kameez','A-Line Kameez','Anarkali Kameez','Angrakha Kameez','Front Slit Kameez','Side Slit Kameez','Embroidered Kameez','Printed Kameez'],
    'Saree Blouse':['U-Neck Saree Blouse','V-Neck Saree Blouse','Square Neck Saree Blouse','Sweetheart Saree Blouse','Keyhole Saree Blouse','High Neck Saree Blouse','Peplum Saree Blouse','Back Tie Saree Blouse'],
    'Lehenga':['A-Line Lehenga','Flared Lehenga','Panelled Lehenga','Ruffle Lehenga','Circular Lehenga','Layered Lehenga','Bridal Lehenga','Indo-Western Lehenga'],
    'Gown':['A-Line Gown','Ball Gown','Mermaid Gown','Empire Gown','Cape Gown','Tiered Gown','Anarkali Gown','Off Shoulder Gown'],
    'Dress':['A-Line Dress','Fit and Flare Dress','Maxi Dress','Midi Dress','Shirt Dress','Wrap Dress','Tiered Dress','Princess Dress'],
    'Shirt':['Mandarin Collar Shirt','Peter Pan Collar Shirt','Peplum Shirt','Tunic Shirt','Longline Shirt','Ruffle Shirt','Oversized Shirt','Embroidered Shirt'],
    'Pant':['Straight Pant','Slim Pant','Wide Leg Pant','Flared Pant','Cigarette Pant','Cargo Pant','Ankle Pant','Palazzo Pant'],
    'Salwar':['Patiala Salwar','Dhoti Salwar','Churidar Salwar','Straight Salwar','Semi Patiala Salwar','Afghani Salwar','Parallel Salwar','Tulip Salwar'],
    'Choli':['Short Choli','Long Choli','Peplum Choli','Sleeveless Choli','Off Shoulder Choli','High Neck Choli','Backless Choli','Embroidered Choli'],
    'Blazer':['Single Button Blazer','Double Button Blazer','Cropped Blazer','Longline Blazer','Peplum Blazer','Tuxedo Blazer','Collarless Blazer','Printed Blazer'],
    'Suit':['Straight Suit','A-Line Suit','Jacket Suit','Bandhgala Suit','Three Piece Suit','Designer Suit','Wedding Suit','Formal Suit'],
    'Waistcoat':['Classic Waistcoat','Long Waistcoat','Cropped Waistcoat','Embroidered Waistcoat','Nehru Waistcoat','Buttoned Waistcoat','Printed Waistcoat','Layered Waistcoat'],
    'Sherwani':['Classic Sherwani','Achkan Sherwani','Jodhpuri Sherwani','Indo-Western Sherwani','Embroidered Sherwani','Bandhgala Sherwani','Long Sherwani','Wedding Sherwani'],
    'Pajama':['Straight Pajama','Churidar Pajama','Pathani Pajama','Cotton Pajama','Silk Pajama','Loose Pajama','Slim Pajama','Embroidered Pajama'],
    'School Uniform':['Summer Uniform','Winter Uniform','House Uniform','Sports Uniform','Prefect Uniform','Girls Uniform','Boys Uniform','Formal Uniform'],
    'Coat':['Long Coat','Short Coat','Overcoat','Trench Coat','Tailored Coat','Cape Coat','Nehru Coat','Winter Coat'],
    'Other':['Designer Set','Fusion Wear','Festive Wear','Casual Wear','Party Wear','Wedding Wear','Custom Style','Latest Style'],
}

ds = s.find('const DESIGN_TYPES={')
if ds < 0:
    raise SystemExit('DESIGN_TYPES not found')
de = s.find('};', ds)
if de < 0:
    raise SystemExit('DESIGN_TYPES end not found')
block = s[ds:de+2]
for typ, names in extra.items():
    m = re.search(r'(^|\n)\s*' + re.escape(typ) + r':\[([^\]]*)\]', block)
    if not m:
        continue
    body = m.group(2)
    for name in names:
        if "'" + name + "'" not in body:
            body += (',' if body.strip() else '') + "'" + name + "'"
    block = block[:m.start(2)] + body + block[m.end(2):]
s = s[:ds] + block + s[de+2:]

# Replace the visual generator with detailed garment flats, not generic clothing icons.
start = s.find('function designVisual(type,index){')
if start < 0:
    raise SystemExit('designVisual function not found')
nxt = s.find('function ', start + 10)
if nxt < 0:
    raise SystemExit('next function boundary not found')

visual = r'''function designVisual(type,index){
  const colors=['#e98aa5','#5e9be8','#d6a64a','#6db9a8','#9a83dc','#e77b55','#5c718f','#d56c8a','#7da05a','#b78663','#6c83c4','#b96a9e','#e2a04a','#6e9f87','#8e6bb8'];
  const c=colors[index%colors.length], dark='#3f3857', cream='#fffaf4', gold='#d9a441';
  const necks=[`M174 92 Q200 120 226 92`,`M172 92 L200 124 L228 92`,`M172 96 Q200 70 228 96`,`M176 92 L200 112 L224 92`,`M172 94 Q200 112 228 94`];
  const neck=necks[index%necks.length];
  const short=['Blouse','Saree Blouse','Choli'].includes(type);
  const lower=['Pant','Salwar','Pajama'].includes(type);
  const wide=['Lehenga','Gown','Dress'].includes(type);
  const jacket=['Blazer','Suit','Waistcoat','Sherwani','Coat'].includes(type);
  const indian=['Kurti','Kameez','Salwar Suit'].includes(type);
  let art='';
  if(lower){
    art=`<path d="M145 78 Q200 105 255 78 L268 120 Q200 145 132 120 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="M148 112 L190 112 L184 330 L135 330 Z M210 112 L252 112 L265 330 L216 330 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="M150 125 Q200 148 250 125" fill="none" stroke="${cream}" stroke-width="5"/><path d="M160 150 V300 M240 150 V300" stroke="${cream}" stroke-width="3" opacity=".75"/>`;
  }else if(wide){
    art=`<path d="M164 74 Q200 105 236 74 L258 166 Q322 235 350 338 H50 Q78 235 142 166 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="${neck}" fill="none" stroke="${cream}" stroke-width="7"/><path d="M200 122 V330" stroke="${cream}" stroke-width="4" opacity=".85"/><path d="M96 250 Q200 285 304 250" fill="none" stroke="${cream}" stroke-width="5"/><path d="M118 276 Q200 305 282 276" fill="none" stroke="${gold}" stroke-width="3"/>`;
  }else if(jacket){
    art=`<path d="M152 70 L248 70 L276 325 H124 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="M176 70 L200 116 L224 70" fill="none" stroke="${cream}" stroke-width="7"/><path d="M200 116 V320" stroke="${dark}" stroke-width="3"/><path d="M166 146 L200 180 L234 146" fill="none" stroke="${cream}" stroke-width="5"/><circle cx="200" cy="184" r="6" fill="${gold}"/><circle cx="200" cy="214" r="6" fill="${gold}"/><path d="M140 250 H180 M220 250 H260" stroke="${cream}" stroke-width="4"/>`;
  }else if(indian){
    art=`<path d="M154 72 L246 72 L274 164 L252 316 H148 L126 164 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="M136 106 L82 155 L106 184 L160 140 M264 106 L318 155 L294 184 L240 140" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="${neck}" fill="none" stroke="${cream}" stroke-width="7"/><path d="M200 126 V305" stroke="${cream}" stroke-width="4" opacity=".8"/><path d="M150 205 Q200 230 250 205" fill="none" stroke="${cream}" stroke-width="5"/><path d="M150 246 Q200 272 250 246" fill="none" stroke="${gold}" stroke-width="3"/>`;
  }else if(short){
    const sleeves=index%4===3?'':`<path d="M142 104 L82 150 L106 180 L160 138 M258 104 L318 150 L294 180 L240 138" fill="${c}" stroke="${dark}" stroke-width="4"/>`;
    art=`${sleeves}<path d="M154 76 L246 76 L270 160 L252 258 H148 L130 160 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="${neck}" fill="none" stroke="${cream}" stroke-width="7"/><path d="M166 128 Q200 154 234 128" fill="none" stroke="${gold}" stroke-width="4"/><path d="M150 222 Q200 246 250 222" fill="none" stroke="${cream}" stroke-width="5"/><circle cx="184" cy="170" r="5" fill="${gold}"/><circle cx="216" cy="170" r="5" fill="${gold}"/>`;
  }else{
    art=`<path d="M154 74 L246 74 L272 160 L252 315 H148 L128 160 Z" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="M140 106 L88 154 L112 184 L162 140 M260 106 L312 154 L288 184 L238 140" fill="${c}" stroke="${dark}" stroke-width="4"/><path d="${neck}" fill="none" stroke="${cream}" stroke-width="7"/><path d="M200 122 V305" stroke="${cream}" stroke-width="4"/><circle cx="200" cy="162" r="5" fill="${gold}"/><circle cx="200" cy="190" r="5" fill="${gold}"/><path d="M154 235 Q200 258 246 235" fill="none" stroke="${cream}" stroke-width="5"/>`;
  }
  const motif=index%4===0?`<path d="M175 208 Q200 184 225 208 Q200 232 175 208Z" fill="none" stroke="${gold}" stroke-width="3"/>`:index%4===1?`<path d="M160 285 Q200 305 240 285" fill="none" stroke="${gold}" stroke-width="4"/><path d="M170 296 Q200 312 230 296" fill="none" stroke="${cream}" stroke-width="3"/>`:index%4===2?`<circle cx="174" cy="245" r="4" fill="${gold}"/><circle cx="190" cy="254" r="4" fill="${gold}"/><circle cx="206" cy="254" r="4" fill="${gold}"/><circle cx="222" cy="245" r="4" fill="${gold}"/>`:`<path d="M165 150 L235 150 M160 158 L240 158" stroke="${gold}" stroke-width="3"/>`;
  return `<svg viewBox="0 0 400 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${type} fashion design"><defs><linearGradient id="g${index}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="#ffffff"/></linearGradient><filter id="s${index}"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity=".14"/></filter></defs><rect x="10" y="10" width="380" height="360" rx="28" fill="#fbf9ff"/><path d="M48 330 Q200 350 352 330" fill="none" stroke="#ddd7ff" stroke-width="3"/><g filter="url(#s${index})">${art}</g><g>${motif}</g><text x="200" y="45" text-anchor="middle" font-family="Arial" font-size="17" font-weight="800" fill="${dark}">${type}</text><text x="200" y="355" text-anchor="middle" font-family="Arial" font-size="11" fill="#777">Fashion design • ${index+1}</text></svg>`;
}
'''

s = s[:start] + visual + s[nxt:]

# Do not show unrelated external photos in another garment's folder. Every card gets its own
# category-specific design artwork, so the library is consistent and does not consume user backup storage.
s = re.sub(r"image:\(type==='Kurti'\?KURTI_IMAGE_URLS\[name\]:\(DESIGN_IMAGE_URLS\[type\]\?\.\[name\]\|\|''\)\)", "image:''", s)

s = s.replace('SG_DESIGN_LIBRARY_V2', 'SG_DESIGN_LIBRARY_V3')
if 'SG_DESIGN_LIBRARY_V3' not in s:
    s = s.replace('</head>', '<!-- SG_DESIGN_LIBRARY_V3 -->\n</head>', 1)

p.write_text(s, encoding='utf-8')
print('Silai Guru design library V3 installed: category-specific garment designs with expanded choices.')
