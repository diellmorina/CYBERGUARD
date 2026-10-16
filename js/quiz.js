// Quiz Functionality
let quizState = {
  currentQuiz: null,
  currentQuestion: 0,
  userAnswers: [],
  profile: null
};

document.addEventListener('DOMContentLoaded', () => {
  quizState.profile = Storage.getProfile();
  initQuizzes();
});

function initQuizzes() {
  renderQuizSelection();
  setupEventListeners();
}

function renderQuizSelection() {
  const grid = document.getElementById('quizzes-grid');
  grid.innerHTML = QUIZZES.map(quiz => `
    <div class="quiz-card" onclick="startQuiz('${quiz.id}')">
      <div class="quiz-card-icon icon-tile"><i class="fas fa-circle-question" aria-hidden="true"></i></div>
      <div class="quiz-card-title">${quiz.title}</div>
      <div class="quiz-card-desc">${quiz.description}</div>
      <div class="quiz-card-meta">
        <div class="quiz-meta-item">
          <i class="fas fa-list-check" aria-hidden="true"></i>
          <span>${quiz.questions.length} Questions</span>
        </div>
        <div class="quiz-meta-item">
          <i class="fas fa-star" aria-hidden="true"></i>
          <span>${quiz.difficulty}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function startQuiz(quizId) {
  const quiz = QUIZZES.find(q => q.id === quizId);
  if (!quiz) return;

  quizState.currentQuiz = JSON.parse(JSON.stringify(quiz));
  quizState.currentQuestion = 0;
  quizState.userAnswers = new Array(quiz.questions.length).fill(null);

  document.getElementById('quiz-selection').classList.add('hidden');
  document.getElementById('quiz-container').classList.remove('hidden');
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('review-container').classList.add('hidden');

  displayQuestion();
}

function displayQuestion() {
  const quiz = quizState.currentQuiz;
  const question = quiz.questions[quizState.currentQuestion];

  document.getElementById('quiz-title').textContent = quiz.title;
  document.getElementById('question-counter').textContent = 
    `${quizState.currentQuestion + 1} / ${quiz.questions.length}`;
  
  const progress = ((quizState.currentQuestion + 1) / quiz.questions.length) * 100;
  document.getElementById('quiz-progress-bar').style.width = progress + '%';

  document.getElementById('question-text').textContent = question.text;

  const optionsList = document.getElementById('options-list');
  optionsList.innerHTML = question.options.map((option, index) => `
    <label class="option">
      <input type="radio" name="answer" value="${index}" 
             ${quizState.userAnswers[quizState.currentQuestion] === index ? 'checked' : ''}
             onchange="selectAnswer(${index})">
      <div class="option-text">
        <div class="option-radio"></div>
        <span>${option.text}</span>
      </div>
    </label>
  `).join('');

  // Update button states
  document.getElementById('prev-btn').disabled = quizState.currentQuestion === 0;
  document.getElementById('next-btn').textContent = 
    quizState.currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next →';
}

function selectAnswer(optionIndex) {
  quizState.userAnswers[quizState.currentQuestion] = optionIndex;
}

function setupEventListeners() {
  document.getElementById('prev-btn').addEventListener('click', () => {
    if (quizState.currentQuestion > 0) {
      quizState.currentQuestion--;
      displayQuestion();
    }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    const quiz = quizState.currentQuiz;
    if (quizState.currentQuestion < quiz.questions.length - 1) {
      quizState.currentQuestion++;
      displayQuestion();
    } else {
      finishQuiz();
    }
  });

  document.getElementById('retake-btn').addEventListener('click', () => {
    startQuiz(quizState.currentQuiz.id);
  });

  document.getElementById('review-btn').addEventListener('click', showReview);
  document.getElementById('close-review').addEventListener('click', () => {
    document.getElementById('review-container').classList.add('hidden');
    document.getElementById('results-container').classList.remove('hidden');
  });
}

function finishQuiz() {
  const quiz = quizState.currentQuiz;
  let correctCount = 0;

  quiz.questions.forEach((question, index) => {
    if (quizState.userAnswers[index] !== null && 
        question.options[quizState.userAnswers[index]].correct) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / quiz.questions.length) * 100);
  let xpEarned = 30; // Base XP

  if (percentage >= 80) {
    xpEarned += 15; // Bonus XP
  }

  // Save quiz attempt
  const attempt = Storage.saveQuizAttempt({
    quizId: quiz.id,
    category: quiz.category,
    difficulty: quiz.difficulty,
    score: correctCount,
    percentage: percentage,
    totalQuestions: quiz.questions.length,
    xpEarned: xpEarned,
    answers: quizState.userAnswers.map((answerIndex, qIndex) => ({
      questionId: quiz.questions[qIndex].id,
      selectedIndex: answerIndex,
      correct: answerIndex !== null && quiz.questions[qIndex].options[answerIndex].correct
    }))
  });

  // Update UI
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('results-container').classList.remove('hidden');

  document.getElementById('final-score').textContent = percentage + '%';
  document.getElementById('result-questions').textContent = 
    `${correctCount} / ${quiz.questions.length}`;
  document.getElementById('result-correct').textContent = correctCount;
  document.getElementById('result-xp').textContent = `+${xpEarned} XP`;

  if (percentage >= 80) {
    document.getElementById('bonus-xp').classList.remove('hidden');
  }

  // Feedback
  let feedback = '';
  if (percentage === 100) {
    feedback = '🌟 Perfect score! You\'ve mastered this topic!';
  } else if (percentage >= 80) {
    feedback = '🎉 Excellent work! You really know your stuff.';
  } else if (percentage >= 60) {
    feedback = '👍 Good job! Review the questions you missed to improve.';
  } else if (percentage >= 40) {
    feedback = '📚 Keep studying! Check the explanations for concepts you need to review.';
  } else {
    feedback = '💪 Don\'t give up! Review the lesson material and try again.';
  }

  document.getElementById('results-feedback').textContent = feedback;

  // Update profile info
  quizState.profile = Storage.getProfile();
  updateSidebarInfo();

  App.showToast(`Quiz completed! +${xpEarned} XP earned!`, 'success');
}

function showReview() {
  document.getElementById('results-container').classList.add('hidden');
  document.getElementById('review-container').classList.remove('hidden');

  const quiz = quizState.currentQuiz;
  const reviewList = document.getElementById('review-list');

  reviewList.innerHTML = quiz.questions.map((question, index) => {
    const userAnswerIndex = quizState.userAnswers[index];
    const userAnswer = userAnswerIndex !== null ? question.options[userAnswerIndex] : null;
    const correctAnswer = question.options.find(opt => opt.correct);
    const isCorrect = userAnswer && userAnswer.correct;

    return `
      <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="review-question">${index + 1}. ${question.text}</div>
        ${userAnswer ? `
          <div class="review-answer user-answer">
            <i class="review-icon fas ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}" aria-hidden="true"></i>
            <span>Your answer: ${userAnswer.text}</span>
          </div>
        ` : `
          <div class="review-answer user-answer">
            <i class="review-icon fas fa-circle-minus" aria-hidden="true"></i>
            <span>Not answered</span>
          </div>
        `}
        ${!isCorrect ? `
          <div class="review-answer correct-answer">
            <i class="review-icon fas fa-circle-check" aria-hidden="true"></i>
            <span>Correct answer: ${correctAnswer.text}</span>
          </div>
        ` : ''}
        <div class="review-explanation">
          <strong>Explanation:</strong> ${question.explanation}
        </div>
      </div>
    `;
  }).join('');
}

function updateSidebarInfo() {
  const profile = quizState.profile;
  const avatars = ['fa-user', 'fa-lock', 'fa-shield-halved', 'fa-user-tie', 'fa-user-ninja'];
  const avatarIndex = parseInt(profile.avatar.split('-')[1]) % avatars.length;

  document.getElementById('sidebar-avatar').innerHTML = `<i class="fas ${avatars[avatarIndex] || 'fa-user'}" aria-hidden="true"></i>`;
  document.getElementById('sidebar-username').textContent = profile.displayName;
  document.getElementById('sidebar-level').textContent = `Level ${profile.level}`;
  document.getElementById('sidebar-xp').textContent = `${profile.totalXP} XP`;
}
