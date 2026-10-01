/* SILAI GURU — Supabase Phone OTP foundation
 * Real OTP is enabled only after a Supabase project URL + publishable/anon key are configured.
 * Never put a service-role key in this file or in the browser.
 */
(function(){
'use strict';
window.SILAI_GURU_AUTH={
  provider:'supabase',
  mode:'phone-otp',
  configured:false,
  sessionRequired:true,
  async sendOtp(){throw new Error('Supabase phone OTP is not configured yet. Add the project URL and publishable/anon key.');},
  async verifyOtp(){throw new Error('Supabase phone OTP is not configured yet.');},
  async getSession(){return null;},
  async signOut(){return true;}
};
})();
