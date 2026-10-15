// Storage Module - Handles all localStorage operations
const Storage = {
  // User Profile
  saveProfile(profile) {
    localStorage.setItem('cyberguard_profile', JSON.stringify(profile));
  },

  getProfile() {
    const data = localStorage.getItem('cyberguard_profile');
    return data ? JSON.parse(data) : this.getDefaultProfile();
  },

  getDefaultProfile() {
    return {
      displayName: 'Cyber Learner',
      avatar: 'avatar-1',
      level: 1,
      totalXP: 0,
      completedLessons: [],
      quizAttempts: [],
      achievements: [],
      createdAt: new Date().toISOString(),
      settings: {
        theme: 'dark',
        soundEnabled: true,
        reducedMotion: false
      }
    };
  },

  // Learning Progress
  saveLessonCompletion(lessonId) {
    const profile = this.getProfile();
    if (!profile.completedLessons.includes(lessonId)) {
      profile.completedLessons.push(lessonId);
      this.updateXP(profile, 20);
      this.checkAchievements(profile);
      this.saveProfile(profile);
      return true;
    }
    return false;
  },

  isLessonCompleted(lessonId) {
    return this.getProfile().completedLessons.includes(lessonId);
  },

  // Quiz Results
  saveQuizAttempt(quizData) {
    const profile = this.getProfile();
    const attempt = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: quizData.quizId,
      category: quizData.category,
      difficulty: quizData.difficulty,
      score: quizData.score,
      percentage: quizData.percentage,
      xpEarned: quizData.xpEarned,
      totalQuestions: quizData.totalQuestions,
      completedAt: new Date().toISOString(),
      answers: quizData.answers
    };

    profile.quizAttempts.push(attempt);
    this.updateXP(profile, quizData.xpEarned);
    this.checkAchievements(profile);
    this.saveProfile(profile);
    return attempt;
  },

  getQuizAttempts() {
    return this.getProfile().quizAttempts;
  },

  getQuizAttemptsByCategory(category) {
    return this.getQuizAttempts().filter(a => a.category === category);
  },

  // XP Management
  updateXP(profile, xpAmount) {
    profile.totalXP += xpAmount;
    const previousLevel = profile.level;
    profile.level = this.calculateLevel(profile.totalXP);
    if (profile.level > previousLevel) {
      this.addAchievement(profile, `level-${profile.level}`);
    }
  },

  calculateLevel(totalXP) {
    const thresholds = [0, 100, 250, 500, 1000, 2000];
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (totalXP >= thresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  },

  // Achievements
  addAchievement(profile, achievementId) {
    if (!profile.achievements.includes(achievementId)) {
      profile.achievements.push(achievementId);
      return true;
    }
    return false;
  },

  checkAchievements(profile) {
    if (profile.completedLessons.length === 1) {
      this.addAchievement(profile, 'first-steps');
    }
    if (profile.quizAttempts.length === 1) {
      this.addAchievement(profile, 'quiz-starter');
    }
    if (profile.quizAttempts.some(q => q.percentage === 100)) {
      this.addAchievement(profile, 'perfect-score');
    }
  },

  hasAchievement(achievementId) {
    return this.getProfile().achievements.includes(achievementId);
  },

  // Activity Tracking
  addActivity(activityType, details) {
    let activities = this.getActivities();
    activities.push({
      id: Math.random().toString(36).substr(2, 9),
      type: activityType,
      details: details,
      timestamp: new Date().toISOString()
    });
    activities = activities.slice(-100); // Keep last 100 activities
    localStorage.setItem('cyberguard_activities', JSON.stringify(activities));
  },

  getActivities() {
    const data = localStorage.getItem('cyberguard_activities');
    return data ? JSON.parse(data) : [];
  },

  clearActivities() {
    localStorage.removeItem('cyberguard_activities');
  },

  // Settings
  saveSetting(key, value) {
    const profile = this.getProfile();
    profile.settings[key] = value;
    this.saveProfile(profile);
  },

  getSetting(key) {
    return this.getProfile().settings[key];
  },

  // Import/Export
  exportProgress() {
    const profile = this.getProfile();
    const activities = this.getActivities();
    return {
      profile,
      activities,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
  },

  importProgress(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (!data.profile || !data.version) {
        throw new Error('Invalid export format');
      }

      localStorage.setItem('cyberguard_profile', JSON.stringify(data.profile));
      if (data.activities) {
        localStorage.setItem('cyberguard_activities', JSON.stringify(data.activities));
      }
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  },

  // Reset
  resetAll() {
    localStorage.removeItem('cyberguard_profile');
    localStorage.removeItem('cyberguard_activities');
  },

  // Learning History
  addLessonToHistory(lessonId, lessonTitle) {
    this.addActivity('lesson-completed', {
      lessonId,
      lessonTitle
    });
  },

  addQuizToHistory(quizId, category, score, percentage) {
    this.addActivity('quiz-completed', {
      quizId,
      category,
      score,
      percentage
    });
  }
};
