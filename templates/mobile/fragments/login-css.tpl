<style>
* {
    outline: none;
}
@font-face {
    font-style: normal;
    font-weight: normal;
    font-family: "Poppins"; src: url("{$smarty.const.STATIC_URL}/font/poppins-regular.woff2") format("woff2");
    font-display: swap;
}

@font-face {
    font-style: normal;
    font-weight: 600;
    font-family: "Poppins"; src: url("{$smarty.const.STATIC_URL}/font/poppins-semibold.woff2") format("woff2");
    font-display: swap;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif;
}
.write-an-article { display: none; }
.login-container { display: flex; justify-content: center; flex-direction: column; }
.box { position: relative; min-height: 600px; width: 100%; height: 100%; background-color: #ffffff; padding: 15px 20px; text-align: center;}
.logo img { background: none; height: 16px; } 
.heading { line-height: 20px; font-size: 16px; color: #474747; font-weight: 700; margin: 10px; }
.sub-text { line-height: 20px; font-size: 14px; font-weight: 400; color: #999999; margin-bottom: 20px; }
.email-input-div { margin: 10px auto; padding: 0 10px; width: 100%; border: solid 1px #999999;; height: 40px; border-radius: 4px;}
.password-input-div, .name-input-div { margin: 10px auto; padding: 0 10px; width: 100%; border: solid 1px #ababab; height: 40px; border-radius: 4px;}
.mobile-input-div { width: 100%; border: solid 1px #999999;; height: 40px; border-radius: 4px; }
.otp-input-div { width: 196px; margin: auto; border: solid 1px #999999;;height: 40px; border-radius: 4px; }
.otp-input-div input::placeholder /* Chrome, Firefox, Opera, Safari 10.1+ */ { letter-spacing: normal !important;}
.otp-input-div input:-ms-input-placeholder /* Internet Explorer 10-11 */ { letter-spacing: normal !important; }
.otp-input-div input::-ms-input-placeholder /* Microsoft Edge */ { letter-spacing: normal !important; }
.email-input-div input::placeholder, .password-input-div input::placeholder, #phone-number-input::placeholder, #otp-input::placeholder { font-size: 14px; color: #999999; font-weight: 400; }
.form-input { box-shadow:none; width: 100%; border: none; height: 38px !important; border-radius: 3px; }
.banner-text { color: #d32f2f; background-color: #FBEBEB; position: relative; font-weight: 500; width: 100%; display: flex; height: 30px; justify-content: center; align-items: center; }
.form-input::placeholder { font-size: 12px; color: #808080; }
.form-input.password { width: 93%; }
.form-input.otp { text-align: center; letter-spacing: 10px; }
.input-error { border: 1px solid #D32F2F !important; }
img.input-icon { background: none; display: inline-block; vertical-align: middle; width: 16px; height: 10px; margin: 0 0 3px 0; }
.input-icon.password { cursor: pointer;  width: 16px; height: 10px; }
img.sso-icon { margin: 0;  width: 24px; height: 24px; }
a.forgot-link { height: 17px; font-size: 14px; text-align: right; display: block; color: #d32f2f; cursor: pointer; text-decoration: none; float: right;}
.sign-in, .register-btn, .change-password-btn { width: 100%; font-size: 14px; font-weight: bold; height: 40px; border-radius: 40px; border: none; color: #fff; padding: 6px 18px; margin-top: 10px; background-color: rgba(211, 47, 47, 0.6); cursor: not-allowed; }
button.active { background-color: #d32f2f; cursor: pointer; }
.send-otp { font-size: 14px; font-weight: bold; border: none; color: #fff; padding: 6px 18px; margin-top: 20px; background-color: #474747; cursor: not-allowed; width: 100%; height: 40px; margin: 20px auto; border-radius:40px; }
.send-btn { font-size: 14px; font-weight: bold; height: 40px; border-radius: 3px; border: none; color: #fff; padding: 6px 18px; margin-top: 10px; background-color: #E0E0E0; cursor: not-allowed; border-radius: 40px; width: 100%; }
.send-otp.active, .send-btn.active { background-color: #D32F2F; }
.name-submit { font-size: 14px; font-weight: bold; height: 40px; width: 100%; border-radius: 40px; border: none; color: #fff; padding: 6px 18px; margin-top: 20px; background-color: #E0E0E0; cursor: not-allowed; }
.name-submit.active { background-color: #D32F2F; }
.verify-otp { font-size: 14px; width: 100%; font-weight: bold; height: 40px; border-radius: 40px; border: none; color: #fff; padding: 6px 18px; margin-top: 20px; background-color: #E0E0E0; cursor: not-allowed; }
.verify-otp.active { background-color: #D32F2F;  cursor: pointer;}
.error { color: #d32f2f; display: block; font-size: 12px; margin: 10px 0 -10px; padding: 0 16px; }
.new-to-sk { height: 17px; font-size: 14px; font-weight: 400; color: #999999; float: left; }
.register, .resend { color: #d32f2f!important; cursor: pointer; }
.resend.disabled { color: #ababab; cursor: not-allowed; }
#terms-checkbox { margin-top: 30px; }
#otp-resend-timer { float: left; color: #999999; font-size: 14px; }
.resend-otp-timer { float: left; color: #D32F2F; font-size: 14px; cursor: pointer; }
.i-agree, .i-agree-as-affiliate { font-size: 12px; color: #999999; }
a.policies { color: #d52d28; cursor: pointer; }
a.policies:hover { text-decoration: underline; }
.other-login { float: right; font-size: 14px; color: #474747; cursor: pointer; font-weight: 500; }
.sso-google-button, .sso-fb-button, .sso-username-button, .sso-phone-button, .sso-apple-button { text-decoration: none !important; height:40px; border-radius: 40px; margin-top: 12px; font-size: 14px; cursor: not-allowed; background-color: #f5f5f5; border: solid 1px #999999;; color: #666666 !important; display: flex; align-items: center; justify-content: center; opacity: 0.6; }
.sso-google-button:hover, .sso-fb-button:hover { text-decoration:none!important; }
.sso-google-button.active { background-color: #fff; cursor: pointer; opacity: 1.0; }
.sso-fb-button.active { background-color: #fff; cursor: pointer; opacity: 1; }
.sso-apple-button.active { background-color: #fff; cursor: pointer; opacity: 1; }
.sso-username-button.active { background-color: #fff; cursor: pointer; opacity: 1; }
.sso-phone-button.active { background-color: #fff; cursor: pointer; opacity: 1; }
.info-text { font-size: 14px; line-height: 1.43; color: #555555; margin-top: 40px; margin-bottom: 30px; }
#info-msg { margin-bottom: 0; }
.close-btn { width: 24px; height: 24px; border-radius: 12px; border: none; background-color: #e8e8e8; float: right; cursor: pointer; color: #808080; }
.custom-input-element { position: relative; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }
.custom-input-element input { position: absolute; opacity: 0; cursor: pointer; display: none; }
.checkmark { position: absolute; top: 2px; left: 0; height: 16px; width: 16px; background-color: #fff; border: 1.5px solid #808080; border-radius: 2px; }
.custom-input-element:hover input ~ .checkmark { background-color: #ccc; }
.custom-input-element input:checked ~ .checkmark { background-color: #808080; }
.checkmark:after { content: ""; position: absolute; display: none; }
.custom-input-element input:checked ~ .checkmark:after { display: block; }
.custom-input-element input:checked ~ .for-radio { background-color: #fff; }
.custom-input-element .checkmark:after { left: 3px; top: 0px; width: 4px; height: 8px; border: solid white; border-width: 0 2px 2px 0; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg); }
.login-loading-overlay.active { display: block; z-index:10000;}
.login-loading-overlay{ display: none;  z-index:10000;}
.login-loader { border: 5px solid #f3f3f3; border-top: 5px solid #555; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; position: fixed; left: 50%; top: 50%; margin-left: -25px; margin-top: -25px; z-index:10000; }
.login-overlay { width: 100%; position: fixed; height: 100%; left: 0; top: 0; background: #FFF; opacity: 0.8; z-index:10000; }
.login-img { margin: 20px auto 0 auto; background: none !important; height: 103px !important; width: 212px !important; display: block; }
.login-footer { position: absolute; bottom: 0; left: 0; padding: 15px 40px; }
input, button {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", "Liberation Sans", sans-serif;
}
.login-separator-text {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #E9E9E9;
    margin: 20px 0;
    color: #666;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 0.1em;
}

.login-separator-text span {
    background: #fff;
    padding: 0 10px;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.iti__flag-container { height: 38px; }
.iti { width: 100%; }
.iti-mobile .iti--container { top: 183px; left: 20px; }
.iti-mobile .iti__country-list { width: 80%; }
.iti--separate-dial-code .iti__selected-flag, .iti--allow-dropdown .iti__flag-container:hover .iti__selected-flag { background-color: #fff !important; }
</style>
