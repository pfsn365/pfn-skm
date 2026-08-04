<script>
  var PFNLoginManagerInstance = (function() {

    var MOBILE_LOGIN_FIREBASE_CONFIG = {json_encode($smarty.const.MOBILE_LOGIN_FIREBASE_PFN)};
    var GOTHAM_AUTH_URL = "{$smarty.const.GOTHAM_URL_PFN_FRONTEND}/pfn/auth";

    function PFNLoginManager() {
      this.isInitialized = false;
      this.initializationPromise = null;

      this.firebaseConfig = {
        apiKey: MOBILE_LOGIN_FIREBASE_CONFIG.apiKey,
        authDomain: MOBILE_LOGIN_FIREBASE_CONFIG.authDomain,
        projectId: MOBILE_LOGIN_FIREBASE_CONFIG.projectId,
        storageBucket: MOBILE_LOGIN_FIREBASE_CONFIG.storageBucket,
        messagingSenderId: MOBILE_LOGIN_FIREBASE_CONFIG.messagingSenderId,
        appId: MOBILE_LOGIN_FIREBASE_CONFIG.appId,
        measurementId: MOBILE_LOGIN_FIREBASE_CONFIG.measurementId
      };
    }

    PFNLoginManager.prototype.initializeFirebase = function() {
      var self = this;

      return new Promise(function(resolve) {
        loadScriptAsync("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js", function() {
          loadScriptAsync("https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js", function() {

            firebase.initializeApp(self.firebaseConfig);
            self.googleProvider = new firebase.auth.GoogleAuthProvider();

            resolve(true);
          });
        });
      });
    }

    PFNLoginManager.prototype.initialize = function(initializationObj) {
      var self = this;

      if (self.initializationPromise) {
        return self.initializationPromise;
      }

      if (self.isInitialized) {
        return Promise.resolve(true);
      }

      return (self.initializationPromise = self.initializeFirebase()
        .then(function() {
          self.isInitialized = true;

          return true;
        })
      );
    }

    PFNLoginManager.prototype.loginWithGoogle = function() {
      var self = this;

      return firebase.auth().signInWithPopup(self.googleProvider)
        .then(function(result) {
          return firebase.auth().currentUser.getIdToken(true)
        })
        .then(function(idToken) {
          return self.verifyFirebaseIdToken(idToken)
        })
        .then(res => {
          if (res === true) {
            return true;
          }
        })
        .catch(function(error) {
          console.error("Google login error:", error);
          throw error;
        });
    }

    PFNLoginManager.prototype.verifyFirebaseIdToken = function(token) {
      return new Promise(function(resolve, reject) {
        var payload = {
          "idToken": token,
        }
        pureJSAjaxPost(GOTHAM_AUTH_URL,
          payload,
          function(res) {
            res = JSON.parse(res);
            if (res.status === true) {
              console.log(res.status);
              resolve(true);
            } else {
              resolve(false);
            }
          },
          reject,
          null,
          true);
      });
    }

    PFNLoginManager.prototype.createFirebaseUser = function(email, password, fullName) {
      var self = this;
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          console.log("cred:", userCredential);
          console.log("user:", user);
          return self.updateFirebaseUserName(fullName);
        })
        .then(() => {
          return self.sendFirebaseVerificationEmail(true);
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/email-already-in-use") {
            alert("Email already registered");
          } else {
            alert("User Creation Failed");
          }
        });
    }

    PFNLoginManager.prototype.sendFirebaseVerificationEmail = function(showAlert) {
      return firebase.auth().currentUser.sendEmailVerification()
        .then(() => {
          if (showAlert) {
            alert("Verification email sent");
          }
        })
        .catch((error) => {
          console.error("Error sending email verification:", error);
        });
    }

    PFNLoginManager.prototype.updateFirebaseUserName = function(fullName) {
      var self = this;
      return firebase.auth().currentUser.updateProfile({
          displayName: fullName,
        }).then(() => {
          console.log("user Name updated");
        })
        .catch((error) => {
          console.log("error updation user name");
        });
    }

    PFNLoginManager.prototype.signinFirebaseUser = function(email, password) {
      var self = this;
      return firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("cred:", userCredential);
          console.log("user is signed in successfully");
          if (userCredential.user.emailVerified) {
            return firebase.auth().currentUser.getIdToken(true)
          } else {
            self.sendFirebaseVerificationEmail(false);
            alert("Please verify the user via email first");
            return;
          }
        })
        .then((idToken) => {
          if (idToken) {
            return self.verifyFirebaseIdToken(idToken);
          }

          return;
        })
        .then(res => {
          if (res === true) {
            return true;
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Email or password is incorrect");
        });
    }

    PFNLoginManager.prototype.resetFirebasePassword = function(email) {
      return firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          console.log("password reset mail sent");
        })
        .catch(err => {
          console.log("password reset error:", err);
        })
    }

    return new PFNLoginManager();
  })();
</script>
