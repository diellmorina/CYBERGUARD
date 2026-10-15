(function () {
  const style = document.createElement('style');
  style.textContent = 'html { visibility: hidden; }';
  // A previous sign-in on this browser is remembered, so show the page right away
  // and let Firebase confirm in the background (it redirects if the session ended).
  if (!localStorage.getItem('cyberguard_uid')) {
    document.head.appendChild(style);
  }

  function redirectToSignIn() {
    const page = location.pathname.split('/').pop() || 'academy.html';
    location.replace(`auth.html?next=${encodeURIComponent(page)}`);
  }

  const config = window.CYBERGUARD_FIREBASE_CONFIG;
  const requiredConfig = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const isConfigured = typeof firebase !== 'undefined'
    && config
    && requiredConfig.every(key => typeof config[key] === 'string'
      && config[key].length > 0
      && !config[key].startsWith('YOUR_'));

  if (!isConfigured) {
    redirectToSignIn();
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        redirectToSignIn();
        return;
      }

      style.remove();

      if (typeof CloudSync === 'undefined') {
        return;
      }

      CloudSync.init(user);
      // Pull in the background, once per browser session; later pages rely on pushes.
      const syncedKey = 'cyberguard_synced_' + user.uid;
      if (sessionStorage.getItem(syncedKey)) {
        return;
      }
      CloudSync.pull()
        .then(changed => {
          sessionStorage.setItem(syncedKey, '1');
          if (changed) {
            location.reload();
          }
        })
        .catch(error => {
          console.error('Could not sync progress:', error);
        });
    }, redirectToSignIn);
  } catch (error) {
    console.error('Authentication check failed:', error);
    redirectToSignIn();
  }
})();
