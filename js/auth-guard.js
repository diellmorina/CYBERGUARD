(function () {
  const style = document.createElement('style');
  style.textContent = 'html { visibility: hidden; }';
  document.head.appendChild(style);

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

      if (typeof CloudSync === 'undefined') {
        style.remove();
        return;
      }

      CloudSync.init(user);
      CloudSync.pull()
        .then(changed => {
          // Reload once so the page renders the freshly synced progress.
          if (changed && !sessionStorage.getItem('cyberguard_synced_reload')) {
            sessionStorage.setItem('cyberguard_synced_reload', '1');
            location.reload();
            return;
          }
          sessionStorage.removeItem('cyberguard_synced_reload');
          style.remove();
        })
        .catch(error => {
          console.error('Could not sync progress:', error);
          style.remove();
        });
    }, redirectToSignIn);
  } catch (error) {
    console.error('Authentication check failed:', error);
    redirectToSignIn();
  }
})();
