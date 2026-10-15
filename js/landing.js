// Landing Page Functionality
document.addEventListener('DOMContentLoaded', () => {
  setupLandingPage();
});

function setupLandingPage() {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.querySelector('.navbar-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when link clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // FAQ accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
          }
        });
        item.classList.toggle('open');
      });
    }
  });

  // Theme toggle
  const themeToggle = document.getElementById('landing-theme-toggle');
  if (themeToggle) {
    // Update button text based on current theme
    updateThemeButtonText();
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      Storage.saveSetting('theme', newTheme);
      updateThemeButtonText();
    });
  }
}

function updateThemeButtonText() {
  const themeToggle = document.getElementById('landing-theme-toggle');
  if (themeToggle) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  }
}
