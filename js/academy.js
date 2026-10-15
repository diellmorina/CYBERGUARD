// Academy Functionality
let academyState = {
  profile: null,
  currentLesson: null
};

document.addEventListener('DOMContentLoaded', () => {
  initAcademy();
});

function initAcademy() {
  academyState.profile = Storage.getProfile();
  renderLessons();
  updateSidebar();
}

function renderLessons() {
  const grid = document.getElementById('lessons-grid');
  grid.innerHTML = LESSONS.map(lesson => {
    const isCompleted = academyState.profile.completedLessons.includes(lesson.id);
    return `
      <div class="lesson-card ${isCompleted ? 'completed' : ''}" onclick="openLesson('${lesson.id}')">
        <div class="lesson-card-header">
          <div class="lesson-icon">📖</div>
          <span class="lesson-status ${isCompleted ? 'completed' : 'locked'}">
            ${isCompleted ? '✓ Complete' : 'Available'}
          </span>
        </div>
        <h3 class="lesson-card-title">${lesson.title}</h3>
        <p class="lesson-card-desc">${lesson.description}</p>
        <div class="lesson-card-meta">
          <span class="lesson-duration">⏱️ ${lesson.duration}</span>
          <span class="lesson-difficulty">${lesson.difficulty}</span>
        </div>
      </div>
    `;
  }).join('');
}

function openLesson(lessonId) {
  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return;

  academyState.currentLesson = lesson;
  const isCompleted = Storage.isLessonCompleted(lesson.id);

  document.getElementById('lesson-modal-title').textContent = lesson.title;
  document.getElementById('lesson-content').innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">${lesson.description}</p>
      <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
        <span style="background: var(--bg-secondary); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.85rem;">
          ⏱️ ${lesson.duration}
        </span>
        <span style="background: var(--bg-secondary); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.85rem;">
          ${lesson.difficulty}
        </span>
        <span style="background: var(--accent-primary); color: var(--bg-primary); padding: 0.5rem 1rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600;">
          +20 XP
        </span>
      </div>
    </div>

    <h4 style="color: var(--accent-primary); margin-bottom: 1rem;">Learning Objectives:</h4>
    <ul style="margin-bottom: 1.5rem; margin-left: 1.5rem;">
      ${lesson.learningObjectives.map(obj => `<li>${obj}</li>`).join('')}
    </ul>

    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      ${lesson.content}
    </div>

    <h4 style="color: var(--accent-primary); margin-bottom: 1rem;">Important Tips:</h4>
    <ul style="margin-bottom: 1.5rem; margin-left: 1.5rem;">
      ${lesson.tips.map(tip => `<li>${tip}</li>`).join('')}
    </ul>

    <h4 style="color: var(--accent-primary); margin-bottom: 1rem;">Knowledge Check:</h4>
    <div style="background: var(--bg-secondary); padding: 1rem; border-radius: var(--radius-md);">
      <p style="margin-bottom: 1rem; font-weight: 500;">${lesson.knowledgeCheck.question}</p>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${lesson.knowledgeCheck.options.map((opt, idx) => `
          <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 0.75rem; background: var(--bg-card); border-radius: var(--radius-sm);">
            <input type="radio" name="knowledge-check" value="${idx}">
            <span>${opt.text}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `;

  const completeBtn = document.getElementById('complete-lesson-btn');
  if (isCompleted) {
    completeBtn.textContent = '✓ Completed';
    completeBtn.disabled = true;
    completeBtn.style.opacity = '0.6';
  } else {
    completeBtn.textContent = 'Mark as Complete';
    completeBtn.disabled = false;
    completeBtn.style.opacity = '1';
  }

  document.getElementById('lesson-modal').classList.add('show');
}

function completeLesson() {
  if (!academyState.currentLesson) return;

  if (Storage.saveLessonCompletion(academyState.currentLesson.id)) {
    Storage.addLessonToHistory(
      academyState.currentLesson.id,
      academyState.currentLesson.title
    );
    
    App.showToast('✓ Lesson completed! +20 XP earned', 'success');
    
    closeLessonModal();
    academyState.profile = Storage.getProfile();
    renderLessons();
    updateSidebar();
  } else {
    App.showToast('You\'ve already completed this lesson', 'info');
  }
}

function closeLessonModal() {
  document.getElementById('lesson-modal').classList.remove('show');
}

function updateSidebar() {
  const profile = academyState.profile;
  const avatars = ['👤', '🔐', '🛡️', '👨‍💻', '👩‍💻'];
  const avatarIndex = parseInt(profile.avatar.split('-')[1]) % avatars.length;

  document.getElementById('sidebar-avatar').textContent = avatars[avatarIndex] || '👤';
  document.getElementById('sidebar-username').textContent = profile.displayName;
  document.getElementById('sidebar-level').textContent = `Level ${profile.level}`;
  document.getElementById('sidebar-xp').textContent = `${profile.totalXP} XP`;
}
