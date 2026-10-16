document.addEventListener('DOMContentLoaded', initializeAuthPage);

function initializeAuthPage() {
  const form = document.getElementById('email-auth-form');
  const googleButton = document.getElementById('google-sign-in');
  const submitButton = document.getElementById('email-submit');
  const switchButton = document.getElementById('auth-switch');
  const switchPrompt = document.getElementById('auth-switch-prompt');
  const confirmField = document.getElementById('password-confirm-field');
  const confirmInput = document.getElementById('auth-password-confirm');
  const passwordInput = document.getElementById('auth-password');
  const title = document.getElementById('auth-title');
  const intro = document.querySelector('.auth-intro');
  const authPanel = document.getElementById('auth-panel');
  const signedInPanel = document.getElementById('signed-in-panel');
  const signedInEmail = document.getElementById('signed-in-email');
  const status = document.getElementById('auth-status');
  const signOutButton = document.getElementById('sign-out');
  const forgotButton = document.getElementById('forgot-password');
  const authButtons = [googleButton, submitButton, forgotButton];
  const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];

  let auth = null;
  let isSignUp = false;
  let redirectAfterSignIn = false;

  const requestedPage = new URLSearchParams(location.search).get('next');
  const hasNextPage = /^[a-z0-9-]+\.html$/i.test(requestedPage || '')
    && !['auth.html', 'index.html'].includes(requestedPage.toLowerCase());
  const nextPage = hasNextPage ? requestedPage : 'academy.html';
  document.getElementById('signed-in-continue').href = nextPage;

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `auth-status is-${type}`;
  }

  function setMode(signUp) {
    isSignUp = signUp;
    title.textContent = signUp ? 'Create your account' : 'Welcome back';
    intro.textContent = signUp
      ? 'Create an account to continue with CyberGuard.'
      : 'Sign in to your CyberGuard account to continue.';
    submitButton.textContent = signUp ? 'Create Account' : 'Sign In';
    switchPrompt.textContent = signUp ? 'Already have an account?' : 'Don’t have an account?';
    switchButton.textContent = signUp ? 'Sign in' : 'Create one';
    forgotButton.hidden = signUp;
    confirmField.hidden = !signUp;
    confirmInput.required = signUp;
    passwordInput.autocomplete = signUp ? 'new-password' : 'current-password';
    form.reset();
    showStatus('', 'info');
  }

  function showAuthError(error) {
    console.error('Firebase authentication failed:', error);
    const messages = {
      'auth/email-already-in-use': 'An account already exists for this email. Sign in instead.',
      'auth/invalid-email': 'Enter a valid email address.',
      'auth/invalid-credential': 'Email or password is incorrect.',
      'auth/user-not-found': 'No account was found for this email.',
      'auth/wrong-password': 'Email or password is incorrect.',
      'auth/weak-password': 'Choose a password with at least 6 characters.',
      'auth/too-many-requests': 'Too many attempts. Wait a while and try again.',
      'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing.',
      'auth/popup-blocked': 'Your browser blocked the sign-in window. Allow popups and try again.',
      'auth/unauthorized-domain': 'This site is not authorized in Firebase. Add its domain under Authentication settings.',
      'auth/operation-not-allowed': 'Enable this sign-in method in Firebase Authentication settings.',
      'auth/network-request-failed': 'Could not reach Firebase. Check your connection and try again.',
      'auth/invalid-api-key': 'The Firebase configuration is invalid. Check js/firebase-config.js.'
    };
    showStatus(messages[error.code] || 'Sign-in failed. Check your Firebase setup and try again.', 'error');
  }

  switchButton.addEventListener('click', () => setMode(!isSignUp));

  if (typeof firebase === 'undefined') {
    authButtons.forEach(button => { button.disabled = true; });
    showStatus('Firebase could not be loaded. Check your internet connection and reload this page.', 'error');
    return;
  }

  const config = window.CYBERGUARD_FIREBASE_CONFIG;
  const isConfigured = config
    && requiredConfig.every(key => typeof config[key] === 'string'
      && config[key].length > 0
      && !config[key].startsWith('YOUR_'));

  if (!isConfigured) {
    authButtons.forEach(button => { button.disabled = true; });
    showStatus('Authentication is not configured yet. Add your Firebase web app settings in js/firebase-config.js.', 'info');
    return;
  }

  try {
    firebase.initializeApp(config);
    auth = firebase.auth();
  } catch (error) {
    authButtons.forEach(button => { button.disabled = true; });
    console.error('Firebase initialization failed:', error);
    showStatus('Firebase could not be initialized. Check js/firebase-config.js.', 'error');
    return;
  }

  const namePanel = document.getElementById('name-panel');
  const nameInput = document.getElementById('auth-name');
  let namePending = false;

  function saveLocalName(user, name) {
    const storedUid = localStorage.getItem('cyberguard_uid');
    if (storedUid && storedUid !== user.uid) {
      localStorage.removeItem('cyberguard_profile');
      localStorage.removeItem('cyberguard_activities');
    }
    localStorage.setItem('cyberguard_uid', user.uid);
    const profile = Storage.getProfile();
    profile.displayName = name;
    localStorage.setItem('cyberguard_profile', JSON.stringify(profile));
  }

  namePanel.addEventListener('submit', async event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const user = auth.currentUser;
    if (!name || !user) return;
    document.getElementById('name-submit').disabled = true;
    try {
      await user.updateProfile({ displayName: name });
    } catch (error) {
      console.error('Could not save the display name to the account:', error);
    }
    saveLocalName(user, name);
    namePending = false;
    location.replace(nextPage);
  });

  auth.onAuthStateChanged(user => {
    const isNewUser = user && user.metadata.creationTime === user.metadata.lastSignInTime;
    if (isNewUser && redirectAfterSignIn && !namePending) {
      namePending = true;
    }
    if (user && namePending) {
      authPanel.hidden = true;
      signedInPanel.hidden = true;
      namePanel.hidden = false;
      title.textContent = 'Welcome to CyberGuard!';
      intro.textContent = 'Tell us what to call you.';
      showStatus('', 'info');
      nameInput.value = user.displayName || '';
      nameInput.focus();
      return;
    }
    if (user && (hasNextPage || redirectAfterSignIn)) {
      location.replace(nextPage);
      return;
    }
    authPanel.hidden = Boolean(user);
    signedInPanel.hidden = !user;
    if (user) {
      signedInEmail.textContent = user.email || user.displayName || 'Signed-in user';
      title.textContent = 'You’re signed in';
      intro.textContent = 'Your CyberGuard account is ready.';
      showStatus('', 'info');
    } else {
      setMode(isSignUp);
    }
  }, error => {
    showAuthError(error);
  });

  forgotButton.addEventListener('click', async () => {
    const emailInput = document.getElementById('auth-email');
    const email = emailInput.value.trim();
    if (!email || !emailInput.checkValidity()) {
      showStatus('Enter your email address above, then click “Forgot password?”.', 'error');
      emailInput.focus();
      return;
    }
    forgotButton.disabled = true;
    try {
      await auth.sendPasswordResetEmail(email);
      showStatus('If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.', 'success');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        showStatus('If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.', 'success');
      } else {
        showAuthError(error);
      }
    } finally {
      forgotButton.disabled = false;
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = passwordInput.value;

    if (isSignUp && password !== confirmInput.value) {
      showStatus('The passwords do not match.', 'error');
      confirmInput.focus();
      return;
    }

    submitButton.disabled = true;
    redirectAfterSignIn = true;
    showStatus(isSignUp ? 'Creating your account…' : 'Signing in…', 'info');
    try {
      if (isSignUp) {
        await auth.createUserWithEmailAndPassword(email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      redirectAfterSignIn = false;
      showAuthError(error);
    } finally {
      submitButton.disabled = false;
    }
  });

  googleButton.addEventListener('click', async () => {
    googleButton.disabled = true;
    redirectAfterSignIn = true;
    showStatus('Opening Google sign-in…', 'info');
    try {
      await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    } catch (error) {
      redirectAfterSignIn = false;
      showAuthError(error);
    } finally {
      googleButton.disabled = false;
    }
  });

  signOutButton.addEventListener('click', async () => {
    signOutButton.disabled = true;
    try {
      await auth.signOut();
    } catch (error) {
      showAuthError(error);
    } finally {
      signOutButton.disabled = false;
    }
  });
}
