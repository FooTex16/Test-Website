export type PhaseGrade = 'all' | 'a' | 'b' | 'c'; // Fase A: 1-2, Fase B: 3-4, Fase C: 5-6

export interface World {
  id: string;
  name: string;
  emoji: string;
  icon: string;
  theme: string;
  phase: string;
  phaseKey: 'a' | 'b' | 'c' | 'all';
  description: string;
  sparkReward: number;
  unlocked: boolean;
  totalMissions: number;
  imageUrl: string;
  accentColor: string;
  borderColor: string;
  buttonBg: string;
  buttonBorder: string;
  tags: string[];
  learningObjectives: string[];
  audioDescription: string;
}

export interface QuestOption {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Quest {
  id: string;
  worldId: string;
  questNumber: number;
  title: string;
  category: string;
  storyPrompt: string;
  characterEmoji: string;
  characterName: string;
  options: QuestOption[];
  hint: string;
  sparkReward: number;
  shardReward: number;
  medalReward?: string;
  completed?: boolean;
}

export interface CityBuilding {
  id: string;
  name: string;
  emoji: string;
  level: number;
  maxLevel: number;
  costShards: number;
  isUnlocked: boolean;
  description: string;
  bonusText: string;
  bgGradient: string;
  borderTheme: string;
}

export interface Medal {
  id: string;
  title: string;
  emoji: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  criteria: string;
  unlocked: boolean;
  dateUnlocked?: string;
  color: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  emojiScene: string;
  illustrationDesc: string;
}

export interface Story {
  id: string;
  title: string;
  emoji: string;
  origin: string;
  category: string;
  estimatedMinutes: number;
  summary: string;
  pages: StoryPage[];
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  sparkReward: number;
}

export interface DiscoveryFact {
  id: string;
  category: string;
  emoji: string;
  question: string;
  fact: string;
  deepExplanation: string;
  experimentHint: string;
  sparkReward: number;
}

export interface AuthUser {
  username: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
  loginTime?: number;
}

export interface StudentProfile {
  name: string;
  avatar: string;
  title: string;
  grade: string;
  sparks: number;
  starShards: number;
  streakDays: number;
  dailyExpedition: {
    questDone: boolean;
    storyDone: boolean;
    discoveryDone: boolean;
  };
  completedQuestIds: string[];
  unlockedBuildingIds: string[];
  unlockedMedalIds: string[];
  authUser?: AuthUser;
}

export interface TeacherAssignment {
  id: string;
  title: string;
  world: string;
  targetClass: string;
  dueDate: string;
  questionsCount: number;
  sparkReward: number;
  completionRate: number;
}

export interface RegisteredUser {
  id: string;
  username: string;
  registeredDate: string;
  totalSparks: number;
  totalShards: number;
  streakDays: number;
  status: 'active' | 'suspended';
  grade: string;
}


