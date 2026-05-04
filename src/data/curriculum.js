// ============================================================
// STATIC CURRICULUM DATA
// Developer: Add your subjects, lessons, and materials here.
// ============================================================

export const CURRICULUM = {
  Junior: {
    color: '#00ff88',
    label: 'Junior Year',
    tagline: 'Building Foundations',
    subjects: [
      {
        id: 'jr-arabic',
        name: 'Arabic',
        icon: 'MdLanguage',
        color: '#00ccff',
        description: 'Arabic language, literature, and grammar.',
        lessons: [{ id: 'jr-ar-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Junior/Arabic and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'jr-english',
        name: 'English',
        icon: 'MdMenuBook',
        color: '#ffaa00',
        description: 'Grammar, literature, and writing skills.',
        lessons: [{ id: 'jr-en-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Junior/English and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'jr-math',
        name: 'Pure Math',
        icon: 'MdCalculate',
        color: '#00ff88',
        description: 'Algebra, geometry, and basic calculus concepts.',
        lessons: [{ id: 'jr-mt-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Junior/Pure Math and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'jr-physics',
        name: 'Physics',
        icon: 'BiLightningCharge',
        color: '#ff6600',
        description: 'Introduction to mechanics and energy.',
        lessons: [{ id: 'jr-ph-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Junior/Physics and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'jr-religion',
        name: 'Religion',
        icon: 'MdMosque',
        color: '#00ffaa',
        description: 'Religious studies and ethical principles.',
        lessons: [{ id: 'jr-re-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Junior/Religion and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'jr-ctz',
        name: 'CTZ',
        icon: 'MdPublic',
        color: '#aa00ff',
        description: 'Citizenship, community, and society.',
        lessons: [{ id: 'jr-ct-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Junior/CTZ and update this summary.', flashcards: [], quiz: [] }]
      }
    ]
  },

  Wheeler: {
    color: '#00aaff',
    label: 'Wheeler Year',
    tagline: 'Expanding Horizons',
    subjects: [
      {
        id: 'wh-arabic',
        name: 'Arabic',
        icon: 'MdLanguage',
        color: '#00ccff',
        description: 'Advanced language literature.',
        lessons: [{ id: 'wh-ar-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/Arabic and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'wh-english',
        name: 'English',
        icon: 'MdMenuBook',
        color: '#ffaa00',
        description: 'Advanced grammar and literature.',
        lessons: [{ id: 'wh-en-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/English and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'wh-math',
        name: 'Pure Math',
        icon: 'MdCalculate',
        color: '#00ff88',
        description: 'Trigonometry, functions, and pre-calculus.',
        lessons: [{ id: 'wh-mt-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/Pure Math and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'wh-physics',
        name: 'Physics',
        icon: 'BiLightningCharge',
        color: '#ff6600',
        description: 'Mechanics, energy, waves, and electricity.',
        lessons: [{ id: 'wh-ph-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/Physics and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'wh-religion',
        name: 'Religion',
        icon: 'MdMosque',
        color: '#00ffaa',
        description: 'Advanced religious studies.',
        lessons: [{ id: 'wh-re-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/Religion and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'wh-social',
        name: 'Social Studies',
        icon: 'MdPublic',
        color: '#aa00ff',
        description: 'Geography, history, and civics.',
        lessons: [{ id: 'wh-ss-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/Social Studies and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'wh-mechanics',
        name: 'Mechanics',
        icon: 'MdSettings',
        color: '#ff0055',
        description: 'Statics and dynamics principles.',
        lessons: [{ id: 'wh-me-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Wheeler/Mechanics and update this summary.', flashcards: [], quiz: [] }]
      }
    ]
  },

  Senior: {
    color: '#ff6600',
    label: 'Senior Year',
    tagline: 'Mastering Excellence',
    subjects: [
      {
        id: 'sr-arabic',
        name: 'Arabic',
        icon: 'MdLanguage',
        color: '#00ccff',
        description: 'Mastery of Arabic literature.',
        lessons: [{ id: 'sr-ar-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/Arabic and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'sr-english',
        name: 'English',
        icon: 'MdMenuBook',
        color: '#ffaa00',
        description: 'Mastery of English literature.',
        lessons: [{ id: 'sr-en-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/English and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'sr-math',
        name: 'Pure Math',
        icon: 'MdCalculate',
        color: '#00ff88',
        description: 'Limits, derivatives, integrals, and applications.',
        lessons: [{ id: 'sr-mt-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/Pure Math and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'sr-physics',
        name: 'Physics',
        icon: 'BiLightningCharge',
        color: '#ff6600',
        description: 'Advanced electricity, magnetism, and modern physics.',
        lessons: [{ id: 'sr-ph-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/Physics and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'sr-religion',
        name: 'Religion',
        icon: 'MdMosque',
        color: '#00ffaa',
        description: 'Comprehensive religious doctrines.',
        lessons: [{ id: 'sr-re-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/Religion and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'sr-social',
        name: 'Social Studies',
        icon: 'MdPublic',
        color: '#aa00ff',
        description: 'Advanced history and global geography.',
        lessons: [{ id: 'sr-ss-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/Social Studies and update this summary.', flashcards: [], quiz: [] }]
      },
      {
        id: 'sr-mechanics',
        name: 'Mechanics',
        icon: 'MdSettings',
        color: '#ff0055',
        description: 'Advanced statics, dynamics, and engineering physics.',
        lessons: [{ id: 'sr-me-1', title: 'Chapter 1', summary: 'Please place the PowerPoint in public/materials/Senior/Mechanics and update this summary.', flashcards: [], quiz: [] }]
      }
    ]
  }
};

// Global leaderboard seed data
export const LEADERBOARD_SEED = [
  { id: 's001', name: 'Karim Mostafa', year: 'Senior', avatar: 'KM', points: 1240, quizzesTaken: 18, streak: 12 },
  { id: 's002', name: 'Fatima Hassan', year: 'Senior', avatar: 'FH', points: 960, quizzesTaken: 14, streak: 7 },
  { id: 'w001', name: 'Mahmoud Nasr', year: 'Wheeler', avatar: 'MN', points: 780, quizzesTaken: 11, streak: 5 },
  { id: 'j002', name: 'Amira Khalil', year: 'Junior', avatar: 'AK', points: 520, quizzesTaken: 8, streak: 3 },
  { id: 'w002', name: 'Zain Elsayed', year: 'Wheeler', avatar: 'ZE', points: 430, quizzesTaken: 7, streak: 2 },
  { id: 'j001', name: 'Hassan Abdallah', year: 'Junior', avatar: 'HA', points: 340, quizzesTaken: 5, streak: 1 },
];
