document.addEventListener('DOMContentLoaded', () => {
  const account = document.getElementById('profile-auth-account');
  const status = document.getElementById('profile-auth-status');
  const signInLink = document.getElementById('profile-auth-sign-in');
  const signOutButton = document.getElementById('profile-auth-sign-out');
  const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const config = window.CYBERGUARD_FIREBASE_CONFIG;

  function showSignedOut(message) {
    account.textContent = message;
    signInLink.hidden = false;
    signOutButton.hidden = true;
  }

  if (typeof firebase === 'undefined') {
    showSignedOut('Could not load Firebase. You can still use your local profile.');
    return;
  }

  const isConfigured = config
    && requiredConfig.every(key => typeof config[key] === 'string'
      && config[key].length > 0
      && !config[key].startsWith('YOUR_'));

  if (!isConfigured) {
    showSignedOut('Firebase sign-in is not configured. Your local profile is available.');
    return;
  }

  let auth;
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    auth = firebase.auth();
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    showSignedOut('Could not connect to Firebase. Your local profile is available.');
    return;
  }

  auth.onAuthStateChanged(user => {
    if (user) {
      account.textContent = `Signed in as ${user.email || user.displayName || 'your account'}`;
      signInLink.hidden = true;
      signOutButton.hidden = false;
      status.textContent = '';
    } else {
      showSignedOut('You are not signed in.');
    }
  }, error => {
    console.error('Could not check Firebase sign-in state:', error);
    showSignedOut('Could not check sign-in status. Try reloading the page.');
  });

  signOutButton.addEventListener('click', async () => {
    signOutButton.disabled = true;
    status.textContent = '';
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Firebase sign-out failed:', error);
      status.textContent = 'Unable to sign out. Please try again.';
    } finally {
      signOutButton.disabled = false;
    }
  });
});
