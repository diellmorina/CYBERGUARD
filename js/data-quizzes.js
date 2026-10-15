// Quiz Data
const QUIZZES = [
  {
    id: 'quiz-intro',
    title: 'Cybersecurity Basics Quiz',
    category: 'fundamentals',
    difficulty: 'beginner',
    description: 'Test your knowledge of cybersecurity fundamentals',
    questions: [
      {
        id: 'q1',
        text: 'What does the acronym CIA stand for in cybersecurity?',
        options: [
          { text: 'Central Intelligence Agency', correct: false },
          { text: 'Confidentiality, Integrity, Availability', correct: true },
          { text: 'Cybersecurity Information Authority', correct: false },
          { text: 'Critical Infrastructure Alert', correct: false }
        ],
        explanation: 'The CIA triad (Confidentiality, Integrity, Availability) is a fundamental concept in cybersecurity that guides information security policies and practices.'
      },
      {
        id: 'q2',
        text: 'Which of the following is NOT a common type of cyberattack?',
        options: [
          { text: 'Phishing', correct: false },
          { text: 'DDoS attacks', correct: false },
          { text: 'Malware', correct: false },
          { text: 'Photosynthesis', correct: true }
        ],
        explanation: 'Photosynthesis is a biological process, not a cyberattack. Common cyberattacks include phishing, DDoS, and malware.'
      },
      {
        id: 'q3',
        text: 'What is ransomware?',
        options: [
          { text: 'A type of anti-virus software', correct: false },
          { text: 'Malicious software that encrypts your files and demands payment', correct: true },
          { text: 'A web browser extension', correct: false },
          { text: 'A network security protocol', correct: false }
        ],
        explanation: 'Ransomware is malicious software that encrypts valuable files and demands a ransom payment for their release.'
      },
      {
        id: 'q4',
        text: 'What percentage of data breaches involve human error?',
        options: [
          { text: 'About 10%', correct: false },
          { text: 'About 30%', correct: false },
          { text: 'About 50%', correct: false },
          { text: 'About 88%', correct: true }
        ],
        explanation: 'According to security reports, human error is involved in approximately 88% of data breaches, making user education critical.'
      },
      {
        id: 'q5',
        text: 'Which is the best defense against phishing attacks?',
        options: [
          { text: 'Only using Internet Explorer', correct: false },
          { text: 'Education and verification of sender identity', correct: true },
          { text: 'Never opening emails', correct: false },
          { text: 'Disabling JavaScript completely', correct: false }
        ],
        explanation: 'The best defense is user awareness and education, combined with verification of sender identity before clicking links or downloading attachments.'
      }
    ]
  },
  {
    id: 'quiz-passwords',
    title: 'Password Security Quiz',
    category: 'passwords',
    difficulty: 'beginner',
    description: 'Test your knowledge about strong passwords and security',
    questions: [
      {
        id: 'q1',
        text: 'What is the minimum recommended length for a strong password?',
        options: [
          { text: '4 characters', correct: false },
          { text: '8 characters', correct: false },
          { text: '12 characters or more', correct: true },
          { text: '20 characters minimum', correct: false }
        ],
        explanation: 'Security experts recommend passwords be at least 12 characters long. Longer passwords are significantly harder to crack.'
      },
      {
        id: 'q2',
        text: 'Which password is the strongest?',
        options: [
          { text: 'Password1', correct: false },
          { text: 'BlueMoon#42@Castle!Nine', correct: true },
          { text: 'Password123456', correct: false },
          { text: 'Admin1234', correct: false }
        ],
        explanation: 'The strongest password uses a mix of uppercase, lowercase, numbers, and special characters in a unique, unpredictable combination.'
      },
      {
        id: 'q3',
        text: 'Why should you NOT reuse passwords?',
        options: [
          { text: 'It wastes storage space', correct: false },
          { text: 'If one account is compromised, all accounts are at risk', correct: true },
          { text: 'Passwords expire after reuse', correct: false },
          { text: 'It violates internet law', correct: false }
        ],
        explanation: 'Reusing passwords means if one account is breached, hackers can try that password on your other accounts.'
      },
      {
        id: 'q4',
        text: 'What is a password manager?',
        options: [
          { text: 'Software that helps crack passwords', correct: false },
          { text: 'A secure tool that stores and manages your passwords', correct: true },
          { text: 'A browser that only works with passwords', correct: false },
          { text: 'A method to recover forgotten passwords instantly', correct: false }
        ],
        explanation: 'A password manager securely stores your passwords in an encrypted vault, allowing you to use unique passwords for every account.'
      },
      {
        id: 'q5',
        text: 'What should you do if you suspect your password has been compromised?',
        options: [
          { text: 'Wait a few weeks to change it', correct: false },
          { text: 'Change it immediately and enable two-factor authentication', correct: true },
          { text: 'Create a similar password with one more number', correct: false },
          { text: 'Contact the government cybersecurity agency', correct: false }
        ],
        explanation: 'Change your password immediately and enable two-factor authentication to prevent unauthorized access to your account.'
      }
    ]
  },
  {
    id: 'quiz-phishing',
    title: 'Phishing Awareness Quiz',
    category: 'phishing',
    difficulty: 'beginner',
    description: 'Learn to identify phishing attacks and scams',
    questions: [
      {
        id: 'q1',
        text: 'What is the primary goal of a phishing attack?',
        options: [
          { text: 'To slow down your internet', correct: false },
          { text: 'To trick you into revealing personal information', correct: true },
          { text: 'To improve your browser security', correct: false },
          { text: 'To update your software automatically', correct: false }
        ],
        explanation: 'Phishing attacks attempt to deceive users into revealing sensitive information like passwords, credit card numbers, or personal data.'
      },
      {
        id: 'q2',
        text: 'Which is a red flag for a phishing email?',
        options: [
          { text: 'Requests personal information', correct: true },
          { text: 'Contains a logo', correct: false },
          { text: 'Uses professional language', correct: false },
          { text: 'Is from a known company', correct: false }
        ],
        explanation: 'Phishing emails often request personal information, create urgency, or contain suspicious links. Legitimate companies rarely ask for passwords via email.'
      },
      {
        id: 'q3',
        text: 'How can you verify if an email is really from your bank?',
        options: [
          { text: 'Check if it has a logo', correct: false },
          { text: 'Contact your bank directly using their official number or website', correct: true },
          { text: 'Look for good grammar', correct: false },
          { text: 'Reply to the email asking for verification', correct: false }
        ],
        explanation: 'Always contact organizations directly using official contact information to verify suspicious emails. Never reply to potentially phishing emails.'
      },
      {
        id: 'q4',
        text: 'What does a suspicious sender email address often look like?',
        options: [
          { text: 'Similar to the real company but with slight differences (e.g., g00gle.com)', correct: true },
          { text: 'Always from yahoo.com', correct: false },
          { text: 'Always in ALL CAPS', correct: false },
          { text: 'Always contains numbers', correct: false }
        ],
        explanation: 'Phishers often use lookalike domains that appear similar to legitimate companies at first glance (typosquatting).'
      },
      {
        id: 'q5',
        text: 'What should you do if you accidentally click a phishing link?',
        options: [
          { text: 'Close the tab immediately and change your passwords', correct: true },
          { text: 'Continue browsing normally', correct: false },
          { text: 'Visit the website to verify it\'s real', correct: false },
          { text: 'Share it with others to warn them', correct: false }
        ],
        explanation: 'Close the tab immediately. Change your passwords if you entered any credentials. Monitor your accounts for suspicious activity.'
      }
    ]
  }
];
