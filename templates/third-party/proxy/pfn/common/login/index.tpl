{include file="templates/third-party/proxy/pfn/common//login/firebaseManager.tpl"}
<style>
  #mobile-login-box .sso-google-button,
  #sign-in-box .sso-phone-button {
    margin-top: 0;
  }
</style>
{if $is_desktop}
  {include file='desktop/fragments/login-css.tpl'}
{else}
  {include file='mobile/fragments/login-css.tpl'}
{/if}

{include file='./styles.tpl'}
<style>
  .logo img {
    width: 200px;
    height: 50px;
  }

  .login-heading {
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    margin: 10px 0;
    color: #474747;
  }

  #mobile-login-box .sso-google-button,
  #sign-in-box .sso-phone-button {
    margin-top: 0;
  }

  .us-email-mobile-login-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  #new-layout-box .sso-google-button {
    border-radius: 50px;
    height: 55px;
    border: 1px solid hsl(0, 0%, 60%);
    background: #FFF;
    filter: drop-shadow(0px 4px 4px #E9F2FA);
  }

  #new-layout-box .sso-fb-button {
    border-radius: 50px;
    height: 55px;
    border: 1px solid #E9E9E9;
    background: #FFF;
    margin-bottom: 30px;
  }

  #new-layout-box .sso-username-button,
  #new-layout-box .sso-phone-button {
    flex-direction: column;
    text-decoration: none !important;
    border-radius: 0px;
    margin-top: 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #E9E9E9;
    background: #FFF;
    color: #666666 !important;
    width: 70px;
    height: 65px;
  }

  #new-layout-box .sso-username-button:hover,
  #new-layout-box .sso-phone-button:hover,
  #new-layout-box .sso-fb-button:hover {
    border: 1px solid hsl(0, 0%, 60%);
  }

  .login-loading-overlay.with-context .login-loader {
    border: none;
    animation: none;
  }

  .login-loading-overlay.cmc .login-overlay {
    opacity: 1;
  }

  .login-loading-overlay.cmc .login-loader {
    width: 150px;
    height: 113px;
    margin-left: -75px;
    margin-top: -59.5px;
    background-image: url("{$smarty.const.STATIC_URL}/skm/assets/images/loader--login--cmc.gif");
    background-repeat: no-repeat;
    background-size: 150px 113px;
  }

  .login-footer .policies {
    color: #0857C3;
  }
</style>

<div class="login-loading-overlay">
  <div class="login-overlay"></div>
  <div class="login-loader"></div>
</div>
<div class="login-container">
  <div class="banner-text hidden"></div>
  <div id="sign-in-box" class="box">
    <div id="signin-captcha" class="g-recaptcha" data-size="invisible" data-callback="signIn"></div>
    <div class="logo"><img width="200" height="50"
        src="{$smarty.const.STATIC_URL}/skm/assets/third-party/pfsn-logo-black.png" /></div>
    <div class="heading">Sign In to Pro Football & Sports Network</div>
    <div class="email-input-div">
      <input class="form-input" id="email-input" type="text" placeholder="Email" title="Email" />
    </div>
    <div class="password-input-div">
      <input class="form-input password" id="password-input" type="password" placeholder="Password" title="Password"/>
      <img class="input-icon password" src="{$smarty.const.STATIC_URL}/skm/assets/affiliate/reads_icon.svg"
        title="Show password" onclick="toggleShowPassword(this);" />
    </div>
    <label id="signin-error" class="error hidden"></label>
    <button class="sign-in active" onclick="firebaseSignIn(this);">Sign In</button>
    <div style="margin: 10px auto; display: inline-block; width: 100%;">
      <label class="new-to-sk">New user? <span class="register"
          onclick="switchUI('register-box');">Register</span></label>
      <a class="forgot-link" onclick="switchUI('reset-password-box');">Forgot password?</a>
    </div>

    <div class="login-separator-text"><span>OR</span></div>

    <a class="sso-phone-button active hidden" onclick="switchUI('mobile-login-box');">
      <img class="input-icon sso-icon" width="16" height="24" style="width:16px"
        src="{$smarty.const.STATIC_URL}/skm/assets/images/mobile.svg" /> &nbsp;&nbsp;
      Sign in with Mobile
    </a>
    <a class="sso-google-button active" onclick="sso(this, 'google');">
      <img class="input-icon sso-icon" width="24" height="24"
        src="{$smarty.const.STATIC_URL}/skm/assets/images/google.svg" /> &nbsp;&nbsp;
      Sign in with Google
    </a>
    <div class="login-footer">
      <label class="i-agree">By signing in with Google, you agree to Pro Football & Sports Network's <a class="policies"
          href="/privacy-policy">Privacy Policy</a>.</label>
    </div>
  </div>

  <div id="reset-password-box" class="box hidden">
    <div id="reset-password-captcha" class="g-recaptcha" data-size="invisible" data-callback="sendPasswordResetRequest">
    </div>
    {if $is_desktop}
      <div class="logo"><img width="200" height="50"
          src="{$smarty.const.STATIC_URL}/skm/assets/third-party/pfsn-logo-black.png" /></div>
    {/if}
    <div class="heading">Forgot Password</div>
    <div class="email-input-div">
      <input class="form-input" id="password-reset-email-input" type="text" placeholder="Email" title="Email"
        oninput="validateResetEmail();" onchange="validateResetEmail();" />
    </div>
    <label id="forgot-error" class="error hidden"></label>
    <button class="send-btn" onclick="passwordReset(this);">Send</button>
    <div style="margin: 20px 0;clear: both; display:flex; justify-content:center;align-items:center;flex-direction:column;gap:20px;">
      <div>
      <span style="float: left; color: #999999; font-size: 14px;">Have an account?</span>
      <span style="float: left; color: #0857C3; font-size: 14px; cursor: pointer"
        onclick="switchUI('sign-in-box');">&nbsp;Sign In</span>
      </div>
      <span class="other-login" style="color: #0857C3;" onclick="resetUI(this);">Try another sign-in method</span>
    </div>
    <div class="login-footer">
      <label class="i-agree">By signing in with Google, you agree to Pro Football & Sports Network's <a class="policies"
          href="/privacy-policy">Privacy Policy</a>.</label>
    </div>
  </div> 

  <div id="register-box" class="box hidden">
    <div id="register-captcha" class="g-recaptcha" data-size="invisible" data-callback="sendRegisterRequest"></div>
    {if $is_desktop}
    <div class="logo"><img width="200" height="50"
        src="{$smarty.const.STATIC_URL}/skm/assets/third-party/pfsn-logo-black.png" /></div>
    {/if}
    <div class="heading">Create an Account With<br>Pro Football & Sports Network</div>
    <div class="email-input-div">
      <input class="form-input" id="register-email-input" type="text" placeholder="Email" title="Email"
        oninput="verifyRegister(event);" onchange="verifyRegister(event);" />
    </div>
    <div class="name-input-div">
      <input class="form-input" id="register-name-input" placeholder="Name" oninput="verifyRegister(event);"
        onchange="verifyRegister(event);" />
    </div>
    <div class="password-input-div">
      <input class="form-input password" id="register-password-input" type="password" placeholder="Password"
        title="Password" oninput="verifyRegister(event);" onchange="verifyRegister(event);" />
      <img class="input-icon password" src="{$smarty.const.STATIC_URL}/skm/assets/affiliate/reads_icon.svg"
        title="Show password" onclick="toggleShowPassword(this);" />
    </div>
    <div class="password-input-div">
      <input class="form-input password" id="register-confirm-password-input" type="password"
        placeholder="Confirm Password" title="Confirm Password" oninput="verifyRegister(event);"
        onchange="verifyRegister(event);" />
      <img class="input-icon password" src="{$smarty.const.STATIC_URL}/skm/assets/affiliate/reads_icon.svg"
        title="Show password" onclick="toggleShowPassword(this);" />
    </div>
    <label id="register-error" class="error hidden"></label>
    <label class="custom-input-element">
      <input id="register-terms-checkbox" type="checkbox" onchange="verifyRegister(event);" />
      <span class="checkmark"></span>
    </label>
    <label class="i-agree" style="margin-left: 20px;">I agree to Pro Football & Sports Network's <a class="policies"
        href="/privacy-policy">Privacy
        Policy</a>.</label>
    <button class="register-btn" onclick="register(this);">Register</button>
    <div style="margin: 20px 0;clear: both;">
      <span style="float: left; color: #999999; font-size: 14px;">Have an account?</span>
      <span style="float: left; color: #0857C3; font-size: 14px; cursor: pointer"
        onclick="switchUI('sign-in-box');">&nbsp;Sign In</span>
      <span class="other-login hidden" onclick="resetUI(this);">Try other log in method</span>
    </div>
    <div class="login-footer">
      <label class="i-agree">By signing in with Google, you agree to Pro Football & Sports Network's <a class="policies"
          href="/privacy-policy">Privacy Policy</a>.</label>
    </div>
  </div>
</div>

<script>
  //common functions
  function showLoadingBlock(sourceContext) {
    sourceContext = sourceContext || window.sourceContext;

    addClass($(".login-loading-overlay"), 'active');

    if (sourceContext) {
      addClass($(".login-loading-overlay"), "with-context");
      addClass($(".login-loading-overlay"), sourceContext);
    }
  }

  function hideLoadingBlock() {
    removeClass($(".login-loading-overlay"), 'active');
    removeClass($(".login-loading-overlay"), "with-context");
  }

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    var urlObject = new URL(url);
    return urlObject.searchParams.get(name);
  }

  function isEmailValid(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isPasswordValid(pass) {
    var passRegex = {literal} /^(?=\S{6,72})(?=\S*[\W])(?=\S*[A-Z])(?=\S*[\d])\S*$/; {/literal}
    return passRegex.test(pass);
  }

  function toggleShowPassword(ele) {
    var parent = ele.parentNode;
    var passwordInput = parent.querySelector('.form-input');
    if (hasClass(ele, 'show')) {
      removeClass(ele, 'show');
      ele.src = 'https://statics.sportskeeda.com/skm/assets/affiliate/reads_icon.svg';
      ele.setAttribute('title', 'Show password');
      passwordInput.setAttribute('type', 'password');
    } else {
      addClass(ele, 'show');
      ele.src = 'https://statics.sportskeeda.com/skm/assets/images/hide.svg';
      ele.setAttribute('title', 'Hide password');
      passwordInput.setAttribute('type', 'text');
    }
  }

  function switchUI(elementId) {
    if ($('#' + elementId)) {
      hideAllBoxes();
      removeClass($('#' + elementId), 'hidden');
    }
  }

  function resetUI(event) {
    hideAllBoxes();
    removeClass($('#sign-in-box'), 'hidden');
  }

  function hideAllBoxes() {
    var boxes = $all('.box');
    for (var i = 0; i < boxes.length; i++) {
      addClass(boxes[i], 'hidden');
    }
  }

  function sso(ele, provider) {
    if (!hasClass(ele, 'active')) {
      return;
    }
    showLoadingBlock();
    ele.innerHTML = 'Logging in... Hang in there';

    PFNLoginManagerInstance.loginWithGoogle()
      .then(res => {
        if (res) {
          trackGAEvent("pfn_login_success");
          var link = decodeURIComponent(getParameterByName('after-login'));
          if (link !== "") {
            window.location.href = link;
          }
        }
      })
      .catch(function(err) {
        hideLoadingBlock();
        console.error(err);
      });
    return;
  }

  //register helper functions
  function verifyRegister(e) {
    var target = e.currentTarget;
    var email = $('#register-email-input').value.trim();
    var fullname = $('#register-name-input').value.trim();
    var password = $('#register-password-input').value;
    var confirmPassword = $('#register-confirm-password-input').value;
    var errorDiv = $('#register-error');
    var registerBtn = $('.register-btn');
    addClass(errorDiv, 'hidden');
    removeClass(registerBtn, 'active');
    if (email.length <= 0 || password.length <= 0) {
      removeClass(registerBtn, 'active');
      return;
    }
    if (fullname.length <= 0) {
      errorDiv.innerText = 'Name can not be empty.';
      removeClass(errorDiv, 'hidden');
      removeClass(registerBtn, 'active');
      return;
    }
    if (!isEmailValid(email)) {
      errorDiv.innerText = 'Email address is invalid.';
      removeClass(errorDiv, 'hidden');
      removeClass(registerBtn, 'active');
      return;
    }
    if (!isPasswordValid(password)) {
      errorDiv.innerText =
        'Password should be atleast 6 characters long and must contain a number, a special character and an upper case alphabet.';
      removeClass(errorDiv, 'hidden');
      removeClass(registerBtn, 'active');
      return;
    }
    if (confirmPassword.length > 0 && password !== confirmPassword) {
      errorDiv.innerText = 'Password and confirm password do not match.';
      removeClass(errorDiv, 'hidden');
      removeClass(registerBtn, 'active');
      return;
    }
    if (!$('#register-terms-checkbox').checked) {
      return;
    }
    addClass(registerBtn, 'active');
  }

  function register(ele) {
    if (!hasClass(ele, 'active')) {
      return;
    }
    showLoadingBlock();
    ele.innerHTML = 'Registering User... Hang in there';
    removeClass(ele, "active");

    var email = $('#register-email-input').value.trim().toLowerCase();
    var fullname = $('#register-name-input').value.trim();
    var password = $('#register-password-input').value;
    var confirmPassword = $('#register-confirm-password-input').value;
    if (password !== confirmPassword) {
      return
    }

    PFNLoginManagerInstance.createFirebaseUser(email, password, fullname)
      .then(()=> {
        window.location.reload();
      })
      .catch(function(err) {
        hideLoadingBlock();
        console.error(err);
      });
    return;
  }

  function firebaseSignIn(ele) {
    const email = $('#email-input').value.trim().toLowerCase();
    if (!isEmailValid(email)) {
      alert("Enter a valid email");
      return
    }

    const password = $('#password-input').value;
    if (!email || !password || !hasClass(ele, 'active')) {
      return;
    }

    showLoadingBlock();
    ele.innerHTML = 'Logging in... Hang in there';
    removeClass(ele, "active");

    PFNLoginManagerInstance.signinFirebaseUser(email, password)
    .then(res => {
      if (res) {
        trackGAEvent("pfn_login_success");
        const link = decodeURIComponent(getParameterByName('after-login'));
        if (link !== "") {
          window.location.href = link;
        }
      } else {
        ele.innerHTML = "Sign in";
        addClass(ele, "active");
      }
    })
    .catch(function(err) {
      hideLoadingBlock();
      console.error(err);
    });

    return;
  }

  //reset password helper functions
  function validateResetEmail() {
    var email = $('#password-reset-email-input').value;
    addClass($('#forgot-error'), 'hidden');
    if (email.length > 0 && !isEmailValid(email)) {
      $('#forgot-error').innerText = 'Email invalid';
      removeClass($('#forgot-error'), 'hidden');
      removeClass($('.send-btn'), 'active');
    } else {
      addClass($('#forgot-error'), 'hidden');
      addClass($('.send-btn'), 'active');
    }
  }

  function passwordReset(ele) {
    if (!hasClass(ele, 'active')) {
      return;
    }

    showLoadingBlock();
    
    const email = $("#password-reset-email-input").value.trim().toLowerCase();

    PFNLoginManagerInstance.resetFirebasePassword(email)
    .then(()=>{
      alert("Password reset email sent");
      window.location.reload();
    })
    .catch(err => console.log(err));
  }

  var cookieName = 'fw_user_url';
  var expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 12);
  var link = getParameterByName('after-login');
  if (!link) {
    link = "/";
  }

  document.cookie = cookieName + "=" + link + ";expires=" + expiryDate + ";domain=.profootballnetwork.com;path=/";

  if (getCurrentUserID()) {
    window.location = (link ? link : '/');
  }

  function initializeFirebaseLogin(initializationObj) {
    return PFNLoginManagerInstance.initialize(initializationObj)
      .catch(function() {
        if (window.location.hash.slice(1)) {
          switchUI(window.location.hash.slice(1) + '-box');
        }
      });
  }

  (function(){
    initializeFirebaseLogin();
  })();
</script>
