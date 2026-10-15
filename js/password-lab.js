// Password Lab Functionality
document.addEventListener('DOMContentLoaded', () => {
  initPasswordLab();
  setupTabNavigation();
});

function initPasswordLab() {
  const passwordInput = document.getElementById('password-input');
  const toggleBtn = document.getElementById('toggle-password');
  const generateBtn = document.getElementById('generate-btn');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const lengthSlider = document.getElementById('password-length');
  const copyBtn = document.getElementById('copy-password');

  // Password strength checker
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      checkPasswordStrength();
    });

    passwordInput.addEventListener('keyup', () => {
      checkPasswordStrength();
    });
  }

  // Toggle password visibility
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Password generator
  if (generateBtn) {
    generateBtn.addEventListener('click', generatePassword);
  }

  if (regenerateBtn) {
    regenerateBtn.addEventListener('click', generatePassword);
  }

  // Length slider
  if (lengthSlider) {
    lengthSlider.addEventListener('input', (e) => {
      document.getElementById('length-display').textContent = e.target.value;
    });
  }

  // Copy password
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const generatedPasswordField = document.getElementById('generated-password');
      if (generatedPasswordField.value) {
        navigator.clipboard.writeText(generatedPasswordField.value).then(() => {
          App.showToast('Password copied to clipboard!', 'success');
          copyBtn.textContent = '✓ Copied';
          setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
          }, 2000);
        });
      }
    });
  }
}

function checkPasswordStrength() {
  const input = document.getElementById('password-input');
  const password = input.value;
  const resultDiv = document.getElementById('strength-result');
  const emptyState = document.getElementById('empty-checker');

  if (!password) {
    resultDiv.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  resultDiv.classList.remove('hidden');
  emptyState.classList.add('hidden');

  const strength = App.calculatePasswordStrength(password);

  // Update meter
  const fill = document.getElementById('strength-meter-fill');
  fill.style.width = strength.score + '%';

  // Color the meter based on strength
  if (strength.score < 20) {
    fill.style.background = 'linear-gradient(90deg, #EF4444, #DC2626)';
  } else if (strength.score < 40) {
    fill.style.background = 'linear-gradient(90deg, #F59E0B, #D97706)';
  } else if (strength.score < 60) {
    fill.style.background = 'linear-gradient(90deg, #EAB308, #CA8A04)';
  } else if (strength.score < 80) {
    fill.style.background = 'linear-gradient(90deg, #84CC16, #65A30D)';
  } else {
    fill.style.background = 'linear-gradient(90deg, #22C55E, #16A34A)';
  }

  // Update strength level
  document.getElementById('strength-level').textContent = strength.level;
  document.getElementById('strength-score').textContent = strength.score;

  // Update feedback
  const feedbackList = document.getElementById('feedback-list');
  feedbackList.innerHTML = strength.feedback.length > 0
    ? strength.feedback.map(f => `<li>${f}</li>`).join('')
    : '<li style="color: var(--success-color);">✓ Excellent password!</li>';

  // Update checklist
  updateChecklist(password);
}

function updateChecklist(password) {
  const checks = {
    'check-length': password.length >= 12,
    'check-lowercase': /[a-z]/.test(password),
    'check-uppercase': /[A-Z]/.test(password),
    'check-numbers': /[0-9]/.test(password),
    'check-symbols': /[^a-zA-Z0-9]/.test(password)
  };

  for (const [id, passed] of Object.entries(checks)) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = passed ? '☑' : '☐';
      element.parentElement.classList.toggle('checked', passed);
    }
  }
}

function generatePassword() {
  const length = parseInt(document.getElementById('password-length').value) || 16;
  const useUppercase = document.getElementById('gen-uppercase').checked;
  const useLowercase = document.getElementById('gen-lowercase').checked;
  const useNumbers = document.getElementById('gen-numbers').checked;
  const useSymbols = document.getElementById('gen-symbols').checked;

  if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
    App.showToast('Select at least one character type!', 'warning');
    return;
  }

  const password = App.generatePassword({
    length,
    uppercase: useUppercase,
    lowercase: useLowercase,
    numbers: useNumbers,
    symbols: useSymbols
  });

  document.getElementById('generated-password').value = password;
  
  // Show strength
  const strength = App.calculatePasswordStrength(password);
  App.showToast(`Generated: ${strength.level} password (${strength.score}/100)`, 'success');
}

function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Remove active from all buttons and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked button and corresponding content
      button.classList.add('active');
      const activeContent = document.getElementById(tabName);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}
