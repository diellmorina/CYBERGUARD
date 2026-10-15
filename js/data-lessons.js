// Lessons Data
const LESSONS = [
  {
    id: 'lesson-1',
    title: 'Introduction to Cybersecurity',
    category: 'fundamentals',
    duration: '15 min',
    difficulty: 'beginner',
    description: 'Learn the basics of cybersecurity and why it matters.',
    learningObjectives: [
      'Understand what cybersecurity is',
      'Identify common cyber threats',
      'Learn the importance of digital protection'
    ],
    content: `
      <h3>What is Cybersecurity?</h3>
      <p>Cybersecurity is the practice of protecting computer systems and networks from unauthorized access, use, disclosure, disruption, or destruction. In today's digital world, cybersecurity is more important than ever.</p>
      
      <h3>Why Does It Matter?</h3>
      <p>Every day, millions of cyberattacks occur worldwide. From personal data theft to ransomware attacks on businesses, cyber threats are constantly evolving. Understanding cybersecurity helps you protect yourself, your family, and your organization.</p>
      
      <h3>Common Threats</h3>
      <ul>
        <li><strong>Malware:</strong> Malicious software designed to harm or exploit your device</li>
        <li><strong>Phishing:</strong> Fraudulent attempts to steal information through deception</li>
        <li><strong>Ransomware:</strong> Software that encrypts your files and demands payment</li>
        <li><strong>Social Engineering:</strong> Manipulation tactics to trick people into revealing secrets</li>
      </ul>
      
      <h3>Key Takeaway</h3>
      <p>Cybersecurity is a shared responsibility. By learning and implementing best practices, you become part of the solution in creating a safer digital world.</p>
    `,
    tips: ['Stay informed about the latest threats', 'Update your software regularly', 'Use strong, unique passwords'],
    knowledgeCheck: {
      question: 'Which of the following best describes cybersecurity?',
      options: [
        { text: 'Only for large companies', correct: false },
        { text: 'Protection of computer systems from unauthorized access', correct: true },
        { text: 'A one-time purchase', correct: false },
        { text: 'Only for IT professionals', correct: false }
      ]
    }
  },
  {
    id: 'lesson-2',
    title: 'Password Security',
    category: 'passwords',
    duration: '20 min',
    difficulty: 'beginner',
    description: 'Master the art of creating and managing strong passwords.',
    learningObjectives: [
      'Create strong passwords',
      'Understand password managers',
      'Learn secure password practices'
    ],
    content: `
      <h3>Why Strong Passwords Matter</h3>
      <p>Your password is the first line of defense against unauthorized access to your accounts. A weak password can be cracked in seconds, compromising your personal data and financial information.</p>
      
      <h3>Characteristics of a Strong Password</h3>
      <ul>
        <li><strong>Length:</strong> At least 12 characters (longer is better)</li>
        <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, and symbols</li>
        <li><strong>Uniqueness:</strong> Different password for each important account</li>
        <li><strong>Unpredictability:</strong> No personal information or dictionary words</li>
      </ul>
      
      <h3>Password Manager Benefits</h3>
      <p>Password managers securely store your passwords in an encrypted vault, allowing you to use unique, complex passwords for every account without having to remember them all.</p>
      
      <h3>Don't</h3>
      <ul>
        <li>Share your passwords with anyone</li>
        <li>Reuse passwords across accounts</li>
        <li>Use personal information in passwords</li>
        <li>Write passwords on sticky notes</li>
        <li>Click "Remember Password" on public devices</li>
      </ul>
    `,
    tips: ['Use a password manager like Bitwarden or 1Password', 'Create passphrases from random words', 'Enable two-factor authentication on important accounts'],
    knowledgeCheck: {
      question: 'Which password is considered strong?',
      options: [
        { text: 'password123', correct: false },
        { text: 'MyDog!2024@Secure', correct: true },
        { text: 'admin', correct: false },
        { text: '12345678', correct: false }
      ]
    }
  },
  {
    id: 'lesson-3',
    title: 'Multi-Factor Authentication',
    category: 'protection',
    duration: '15 min',
    difficulty: 'beginner',
    description: 'Add multiple layers of security to your accounts.',
    learningObjectives: [
      'Understand MFA concepts',
      'Know different MFA methods',
      'Learn when to enable MFA'
    ],
    content: `
      <h3>What is Multi-Factor Authentication?</h3>
      <p>Multi-Factor Authentication (MFA) requires two or more ways to verify your identity. Even if someone has your password, they can't access your account without the second factor.</p>
      
      <h3>Common MFA Methods</h3>
      <ul>
        <li><strong>SMS Codes:</strong> Text message with a time-limited code</li>
        <li><strong>Authenticator Apps:</strong> Apps like Google Authenticator that generate codes</li>
        <li><strong>Biometrics:</strong> Fingerprint, face recognition, or iris scanning</li>
        <li><strong>Email Verification:</strong> Confirmation link sent to your email</li>
        <li><strong>Security Keys:</strong> Physical devices like YubiKeys</li>
      </ul>
      
      <h3>Best MFA Practices</h3>
      <p>Authenticator apps are more secure than SMS, as SMS can be intercepted through SIM swapping. Security keys provide the highest level of protection.</p>
      
      <h3>Where to Enable MFA</h3>
      <p>Enable MFA on all important accounts: email, banking, social media, and work accounts. This significantly reduces the risk of account compromise.</p>
    `,
    tips: ['Use authenticator apps instead of SMS when possible', 'Save backup codes in a secure location', 'Enable MFA on your email account first'],
    knowledgeCheck: {
      question: 'Which MFA method is generally considered most secure?',
      options: [
        { text: 'SMS text messages', correct: false },
        { text: 'Authenticator apps', correct: false },
        { text: 'Security keys', correct: true },
        { text: 'Email verification', correct: false }
      ]
    }
  }
];

// More lessons will be added in continuation...
