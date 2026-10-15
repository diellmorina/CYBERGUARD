// Link Analyzer Functionality
document.addEventListener('DOMContentLoaded', () => {
  initLinkAnalyzer();
});

function initLinkAnalyzer() {
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearBtn = document.getElementById('clear-btn');
  const urlInput = document.getElementById('url-input');
  const exampleButtons = document.querySelectorAll('.example-url-btn');

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', analyzeURL);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      urlInput.value = '';
      document.getElementById('results').classList.add('hidden');
      document.getElementById('empty-analyzer').classList.remove('hidden');
    });
  }

  if (urlInput) {
    urlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        analyzeURL();
      }
    });
  }

  exampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.dataset.url;
      urlInput.value = url;
      setTimeout(analyzeURL, 100);
    });
  });
}

function analyzeURL() {
  const urlInput = document.getElementById('url-input');
  const url = urlInput.value.trim();
  const resultsDiv = document.getElementById('results');
  const emptyState = document.getElementById('empty-analyzer');

  if (!url) {
    App.showToast('Please enter a URL', 'warning');
    return;
  }

  const results = App.analyzeURL(url);

  resultsDiv.classList.remove('hidden');
  emptyState.classList.add('hidden');

  // Build results HTML
  let html = '<h4 style="margin-top: 0; margin-bottom: 1.5rem;">Analysis Results:</h4>';

  if (results.lowRisk.length > 0) {
    html += `
      <div class="result-section low-risk">
        <div class="result-title">✓ Low Risk Indicators</div>
        <ul class="result-items">
          ${results.lowRisk.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (results.suspicious.length > 0) {
    html += `
      <div class="result-section suspicious">
        <div class="result-title">⚠️ Suspicious Indicators</div>
        <ul class="result-items">
          ${results.suspicious.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (results.highRisk.length > 0) {
    html += `
      <div class="result-section high-risk">
        <div class="result-title">🚨 High-Risk Indicators</div>
        <ul class="result-items">
          ${results.highRisk.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  html += `
    <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); border-left: 4px solid var(--accent-secondary);">
      <strong>Recommendation:</strong>
      ${results.highRisk.length > 0 
        ? "This URL shows high-risk indicators. Proceed with caution and don't enter sensitive information." 
        : results.suspicious.length > 0 
        ? "This URL shows some suspicious indicators. Be cautious before clicking or entering data." 
        : "This URL appears relatively safe based on visible characteristics, but always verify the domain before entering sensitive information."}
    </div>

    <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md);">
      <strong>URL Details:</strong><br>
      <small style="color: var(--text-secondary);">
        Protocol: ${new URL(url).protocol}<br>
        Hostname: ${new URL(url).hostname}<br>
        Secure: ${results.isHttps ? '✓ Yes (HTTPS)' : '✗ No (HTTP)'}
      </small>
    </div>
  `;

  resultsDiv.innerHTML = html;
}
