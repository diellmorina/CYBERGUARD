// Dashboard Page Functionality
let dashboardState = {
  profile: null
};

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  dashboardState.profile = Storage.getProfile();
  
  // Update welcome message
  document.getElementById('welcome-name').textContent = dashboardState.profile.displayName;
  
  // Update sidebar
  updateSidebarUserInfo();
  
  // Update all stats
  updateDashboardStats();
  
  // Render activities
  renderActivities();
  
  // Render achievement badges
  renderAchievements();
  
  // Setup navigation highlighting
  highlightCurrentNav();
}

function updateSidebarUserInfo() {
  const profile = dashboardState.profile;
  const avatars = ['👤', '🔐', '🛡️', '👨‍💻', '👩‍💻'];
  const avatarIndex = parseInt(profile.avatar.split('-')[1]) % avatars.length;
  
  document.getElementById('sidebar-avatar').textContent = avatars[avatarIndex] || '👤';
  document.getElementById('sidebar-username').textContent = profile.displayName;
  document.getElementById('sidebar-level').textContent = `Level ${profile.level}`;
  document.getElementById('sidebar-xp').textContent = `${profile.totalXP} XP`;
}

function updateDashboardStats() {
  const profile = dashboardState.profile;
  
  // Level and XP
  document.getElementById('stat-level').textContent = profile.level;
  document.getElementById('stat-xp').textContent = profile.totalXP;
  
  // Lessons completed
  const lessonsCompleted = profile.completedLessons.length;
  document.getElementById('stat-lessons').textContent = lessonsCompleted;
  
  // Quizzes completed
  const quizzesCompleted = profile.quizAttempts.length;
  document.getElementById('stat-quizzes').textContent = quizzesCompleted;
  
  // Progress bars
  const lessonsPercent = (lessonsCompleted / 15) * 100;
  document.getElementById('progress-lessons').style.width = lessonsPercent + '%';
  document.getElementById('progress-percent').textContent = Math.round(lessonsPercent) + '%';
  
  // XP progress to next level
  const levelThresholds = [0, 100, 250, 500, 1000, 2000];
  const currentLevelThreshold = levelThresholds[profile.level - 1] || 0;
  const nextLevelThreshold = levelThresholds[profile.level] || 2000;
  const xpInCurrentLevel = profile.totalXP - currentLevelThreshold;
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const xpProgress = Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100);
  
  document.getElementById('progress-xp').style.width = xpProgress + '%';
  document.getElementById('xp-progress').textContent = 
    `${xpInCurrentLevel} / ${xpNeededForNextLevel} XP`;
}

function renderActivities() {
  const activities = Storage.getActivities();
  const container = document.getElementById('activities-list');
  
  if (activities.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📝</div>
        <div class="empty-title">No activities yet</div>
        <div class="empty-description">Start learning to see your activities here</div>
      </div>
    `;
    return;
  }
  
  const recentActivities = activities.slice(-5).reverse();
  container.innerHTML = recentActivities.map(activity => {
    const typeLabels = {
      'lesson-completed': '📚 Lesson Completed',
      'quiz-completed': '❓ Quiz Completed',
      'achievement-unlocked': '🏆 Achievement Unlocked',
      'level-up': '⬆️ Level Up!'
    };
    
    const label = typeLabels[activity.type] || activity.type;
    const time = new Date(activity.timestamp);
    const timeStr = formatActivityTime(time);
    
    return `
      <div class="activity-item">
        <div class="activity-info">
          <div class="activity-type">${label}</div>
          <div class="activity-detail">${activity.details.lessonTitle || activity.details.category || ''}</div>
          <div class="activity-time">${timeStr}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAchievements() {
  const profile = dashboardState.profile;
  const achievements = getAchievementDefinitions();
  const container = document.getElementById('achievements-grid');
  
  const unlocked = profile.achievements.slice(-4);
  
  if (unlocked.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 1.5rem;">
        <div class="empty-icon">🏆</div>
        <div class="empty-title">Unlock achievements</div>
        <div class="empty-description">Complete lessons and quizzes to earn badges</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = unlocked.map(achId => {
    const ach = achievements[achId];
    if (!ach) return '';
    
    return `
      <div class="achievement-badge">
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-title">${ach.name}</div>
      </div>
    `;
  }).join('');
}

function formatActivityTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

function getAchievementDefinitions() {
  return {
    'first-steps': {
      name: 'First Steps',
      icon: '👣',
      description: 'Complete your first lesson'
    },
    'quiz-starter': {
      name: 'Quiz Starter',
      icon: '❓',
      description: 'Complete your first quiz'
    },
    'perfect-score': {
      name: 'Perfect Score',
      icon: '🌟',
      description: 'Get 100% on a quiz'
    },
    'learning-streak': {
      name: 'Learning Streak',
      icon: '🔥',
      description: 'Learn on 3 consecutive days'
    },
    'password-pro': {
      name: 'Password Pro',
      icon: '🔐',
      description: 'Complete password security lesson'
    },
    'phishing-detective': {
      name: 'Phishing Detective',
      icon: '🎣',
      description: 'Complete all phishing scenarios'
    },
    'cyber-guardian': {
      name: 'Cyber Guardian',
      icon: '🛡️',
      description: 'Complete all core lessons'
    },
    'level-2': {
      name: 'Security Explorer',
      icon: '🔍',
      description: 'Reach level 2'
    },
    'level-3': {
      name: 'Cyber Learner',
      icon: '📚',
      description: 'Reach level 3'
    },
    'level-4': {
      name: 'Security Analyst',
      icon: '👨‍💻',
      description: 'Reach level 4'
    },
    'level-5': {
      name: 'Cyber Guardian',
      icon: '🛡️',
      description: 'Reach level 5'
    },
    'level-6': {
      name: 'Security Expert',
      icon: '👑',
      description: 'Reach level 6'
    }
  };
}

function highlightCurrentNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.classList.remove('active');
    const href = item.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    }
  });
}
