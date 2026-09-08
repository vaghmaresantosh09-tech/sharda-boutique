SHARDA BOUTIQUE - App + Google Drive Backup/Synchronization

इस version में:
1. Android पर App की तरह install किया जा सकता है (PWA).
2. Customer data पहले की तरह browser में local save होता है.
3. Google Drive Connect करने के बाद Save Customer पर automatic cloud backup होता है.
4. दूसरे मोबाइल पर उसी Google account और उसी OAuth Client ID से app खोलकर Drive से data Load किया जा सकता है.
5. Google Drive में "SHARDA BOUTIQUE" folder और "SHARDA_BOUTIQUE_DATA.json" file बनेगी.
6. Measurements, garments, photos, amount, advance, balance, notes आदि backup में जाते हैं.

IMPORTANT:
Google Drive sync चलाने के लिए app को HTTPS website पर चलाना जरूरी है (जैसे GitHub Pages). सीधे file:// से Drive OAuth नहीं चलेगा.

ONE-TIME GOOGLE SETUP:
1. Google Cloud Console खोलें: https://console.cloud.google.com/
2. नया Project बनाएं.
3. Google Drive API enable करें.
4. OAuth consent screen configure करें.
5. OAuth Client ID बनाएं: Web application.
6. Authorized JavaScript origins में अपनी HTTPS website का address डालें, उदाहरण:
   https://YOUR-USERNAME.github.io
7. Client ID copy करें. Password/OTP किसी को न दें.

APP में:
1. App खोलें.
2. "Google OAuth Client ID" में अपना Client ID डालें.
3. "Google Drive Connect" दबाएं.
4. अपने Google account से permission दें.
5. इसके बाद नया Customer Save करने पर automatic Drive backup होगा.
6. दूसरे mobile में वही app + वही Google account खोलें और "Drive से Load" दबाएं.

ध्यान दें:
- यह version same Google account के साथ multi-mobile sync के लिए बनाया गया है.
- दो mobiles पर एक साथ अलग-अलग changes करके तुरंत Save करने पर last upload वाला data दूसरे को overwrite कर सकता है. पहले Load/Sync करके फिर बदलाव करना बेहतर है.
- Internet बंद होने पर local save रहेगा; Internet वापस आने पर अगला successful Save Drive backup करेगा.
- Google Drive API के लिए Google की official documentation: https://developers.google.com/workspace/drive/api
