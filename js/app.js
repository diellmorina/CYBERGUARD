// Core App Module
const App = {
  init() {
    this.applyTheme();
    this.setupNavigation();
    this.setupEventListeners();
    this.updateUserInfo();
  },

  applyTheme() {
    const theme = Storage.getSetting('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    Storage.saveSetting('theme', newTheme);
  },

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const href = item.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      });
    });
  },

  setupEventListeners() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (mobileMenuBtn && sidebar) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });
    }

    // Close sidebar when clicking on nav item (mobile)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 768) {
          sidebar.classList.remove('active');
        }
      });
    });
  },

  updateUserInfo() {
    const profile = Storage.getProfile();
    const userNameEl = document.getElementById('user-name');
    const userLevelEl = document.getElementById('user-level');
    const userXPEl = document.getElementById('user-xp');

    if (userNameEl) userNameEl.textContent = profile.displayName;
    if (userLevelEl) userLevelEl.textContent = `Level ${profile.level}`;
    if (userXPEl) userXPEl.textContent = `${profile.totalXP} XP`;
  },

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  },

  // Password strength checker
  calculatePasswordStrength(password) {
    let score = 0;
    const feedback = [];

    if (!password) return { score: 0, level: 'None', feedback };

    // Length scoring
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 10;

    // Character variety
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;

    // Common patterns
    if (/(.)\1{2,}/.test(password)) {
      score -= 20; // Repeated characters
      feedback.push('Avoid repeating characters');
    }

    if (/^[0-9]+$/.test(password)) {
      score -= 30;
      feedback.push('Avoid using only numbers');
    }

    if (/password|123456|qwerty/i.test(password)) {
      score -= 40;
      feedback.push('Avoid common passwords');
    }

    // Generate feedback
    if (password.length < 8) {
      feedback.push('Password too short (minimum 8 characters)');
    }
    if (!/[A-Z]/.test(password)) {
      feedback.push('Add uppercase letters');
    }
    if (!/[0-9]/.test(password)) {
      feedback.push('Add numbers');
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push('Add special characters');
    }

    score = Math.max(0, Math.min(100, score));

    let level = 'Very Weak';
    if (score >= 80) level = 'Very Strong';
    else if (score >= 60) level = 'Strong';
    else if (score >= 40) level = 'Fair';
    else if (score >= 20) level = 'Weak';

    return { score, level, feedback };
  },

  // Generate random password
  generatePassword(options = {}) {
    const {
      length = 16,
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true
    } = options;

    let chars = '';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const randomValues = new Uint32Array(length);
      crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        password += chars[randomValues[i] % chars.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        password += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return password;
  },

  // Analyze URL
  analyzeURL(urlString) {
    const results = {
      lowRisk: [],
      suspicious: [],
      highRisk: [],
      isHttps: false,
      isIP: false
    };

    try {
      const url = new URL(urlString);
      const domain = url.hostname;

      // HTTPS check
      results.isHttps = url.protocol === 'https:';
      if (!results.isHttps) {
        results.suspicious.push('Uses HTTP instead of HTTPS - not encrypted');
      }

      // IP Address detection
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(domain)) {
        results.isIP = true;
        results.highRisk.push('Uses IP address instead of domain name - unusual');
      }

      // Suspicious character detection
      if (/[^a-zA-Z0-9.-]/.test(domain)) {
        results.suspicious.push('Contains unusual characters in domain');
      }

      // Suspicious subdomains
      const subdomains = domain.split('.');
      if (subdomains.length > 3) {
        results.suspicious.push('Multiple subdomains detected - could be spoofed');
      }

      // Lookalike domains
      const commonDomains = ['google', 'amazon', 'apple', 'facebook', 'microsoft', 'paypal', 'bank'];
      for (let common of commonDomains) {
        if (domain.includes(common) && !domain.endsWith(common + '.com')) {
          results.suspicious.push(`Domain appears to mimic "${common}" - possible phishing`);
        }
      }

      // URL length
      if (urlString.length > 100) {
        results.suspicious.push('Very long URL - could hide suspicious content');
      }

      // Query parameters
      if (url.search.length > 50) {
        results.suspicious.push('Contains many query parameters - could track you');
      }

      results.lowRisk.push('URL structure appears valid');

      return results;
    } catch (error) {
      results.highRisk.push('Invalid URL format - cannot be analyzed safely');
      return results;
    }
  },

  sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
