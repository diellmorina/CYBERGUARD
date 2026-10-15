// Syncs the learner's progress with Cloud Firestore (users/{uid}) so it follows them across devices.
const CloudSync = (() => {
  const PROFILE_KEY = 'cyberguard_profile';
  const ACTIVITIES_KEY = 'cyberguard_activities';
  const UID_KEY = 'cyberguard_uid';
  const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000];
  const PUSH_DELAY_MS = 1000;
  const PULL_TIMEOUT_MS = 6000;

  let docRef = null;
  let currentUid = null;
  let pushTimer = null;
  let overwriteNext = false;
  let pushQueue = Promise.resolve();

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error(`Could not read ${key}:`, error);
      return fallback;
    }
  }

  function calculateLevel(xp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
    }
    return 1;
  }

  function union(a, b) {
    return Array.from(new Set([...(a || []), ...(b || [])]));
  }

  function unionById(a, b) {
    const byId = new Map();
    [...(b || []), ...(a || [])].forEach(item => byId.set(item.id, item));
    return Array.from(byId.values());
  }

  // `preferred` wins on conflicting scalar values; lists are always combined.
  function mergeProfiles(preferred, other) {
    if (!preferred) return other;
    if (!other) return preferred;

    const completedLessons = union(other.completedLessons, preferred.completedLessons);
    const quizAttempts = unionById(preferred.quizAttempts, other.quizAttempts)
      .sort((x, y) => new Date(x.completedAt) - new Date(y.completedAt));

    const earnedXP = completedLessons.length * 20
      + quizAttempts.reduce((sum, attempt) => sum + (attempt.xpEarned || 0), 0);
    const totalXP = Math.max(earnedXP, preferred.totalXP || 0, other.totalXP || 0);

    const isDefaultName = name => !name || name === 'Cyber Learner';
    const displayName = isDefaultName(preferred.displayName) && !isDefaultName(other.displayName)
      ? other.displayName
      : preferred.displayName;

    return {
      ...other,
      ...preferred,
      displayName,
      completedLessons,
      quizAttempts,
      achievements: union(other.achievements, preferred.achievements),
      totalXP,
      level: calculateLevel(totalXP),
      createdAt: [preferred.createdAt, other.createdAt].filter(Boolean).sort()[0],
      settings: { ...(other.settings || {}), ...(preferred.settings || {}) }
    };
  }

  function mergeActivities(preferred, other) {
    return unionById(preferred, other)
      .sort((x, y) => new Date(x.timestamp) - new Date(y.timestamp))
      .slice(-100);
  }

  function readLocal() {
    return {
      profile: readJson(PROFILE_KEY, null),
      activities: readJson(ACTIVITIES_KEY, [])
    };
  }

  function writeLocal(state) {
    if (state.profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(state.profile));
    } else {
      localStorage.removeItem(PROFILE_KEY);
    }
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(state.activities || []));
  }

  function parseRemote(snapshot) {
    if (!snapshot.exists) return null;
    const data = snapshot.data();
    try {
      return {
        profile: data.profile ? JSON.parse(data.profile) : null,
        activities: data.activities ? JSON.parse(data.activities) : []
      };
    } catch (error) {
      console.error('Cloud progress is unreadable:', error);
      return null;
    }
  }

  function toPayload(state) {
    return {
      profile: JSON.stringify(state.profile),
      activities: JSON.stringify(state.activities || []),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
  }

  function init(user) {
    currentUid = user.uid;
    docRef = firebase.firestore().collection('users').doc(user.uid);
  }

  // Merges cloud progress into this browser. Resolves true if local data changed.
  async function pull() {
    if (!docRef) return false;

    const storedUid = localStorage.getItem(UID_KEY);
    if (storedUid && storedUid !== currentUid) {
      // Local data belongs to another account on this browser.
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(ACTIVITIES_KEY);
    }
    localStorage.setItem(UID_KEY, currentUid);

    const before = JSON.stringify(readLocal());
    const remote = parseRemote(await docRef.get());
    const local = readLocal();

    if (!remote || !remote.profile) {
      if (local.profile) await docRef.set(toPayload(local));
      return false;
    }

    const merged = {
      profile: mergeProfiles(remote.profile, local.profile),
      activities: mergeActivities(remote.activities, local.activities)
    };
    writeLocal(merged);

    if (JSON.stringify(merged) !== JSON.stringify(remote)) {
      await docRef.set(toPayload(merged));
    }
    return JSON.stringify(readLocal()) !== before;
  }

  function pullWithTimeout() {
    return Promise.race([
      pull(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Sync timed out')), PULL_TIMEOUT_MS))
    ]);
  }

  async function push(overwrite) {
    const local = readLocal();
    if (!local.profile) {
      if (overwrite) await docRef.delete();
      return;
    }

    if (overwrite) {
      await docRef.set(toPayload(local));
      return;
    }

    // Merge with the cloud copy so a stale device cannot erase progress from another device.
    await firebase.firestore().runTransaction(async transaction => {
      const remote = parseRemote(await transaction.get(docRef));
      const merged = remote && remote.profile
        ? {
            profile: mergeProfiles(local.profile, remote.profile),
            activities: mergeActivities(local.activities, remote.activities)
          }
        : local;
      transaction.set(docRef, toPayload(merged));
      writeLocal(merged);
    });
  }

  function flush() {
    if (!docRef) return Promise.resolve();
    clearTimeout(pushTimer);
    pushTimer = null;
    const overwrite = overwriteNext;
    overwriteNext = false;
    pushQueue = pushQueue
      .then(() => push(overwrite))
      .catch(error => console.error('Could not sync progress to the cloud:', error));
    return pushQueue;
  }

  // Called by Storage after any local change. `replace` pushes exactly what is stored locally
  // (used for reset, import and clearing history, where merging would bring data back).
  function schedulePush(replace) {
    if (!docRef) return;
    if (replace) overwriteNext = true;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(flush, PUSH_DELAY_MS);
  }

  window.addEventListener('pagehide', () => {
    if (pushTimer) flush();
  });

  return { init, pull: pullWithTimeout, schedulePush, flush };
})();
