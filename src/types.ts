export interface UnityFile {
  name: string;
  path: string;
  content: string;
  explanation: string;
  solidPrinciples: string[];
  language: 'csharp' | 'json' | 'yaml' | 'markdown';
}

export interface UnityFolder {
  name: string;
  path: string;
  children: (UnityFolder | UnityFile)[];
}

export interface SettingsState {
  musicVolume: number;
  sfxVolume: number;
  graphicsQuality: 'low' | 'medium' | 'high' | 'ultra';
  gridOverlay: boolean;
  chromaticAberration: boolean;
}

export interface ProfileState {
  username: string;
  rank: string;
  points: number;
  avatar: string;
  isLoggedIn: boolean;
  selectedGuardianId?: string;
  completedWorlds?: string[];
  guardianProgression?: Record<string, GuardianProgression>; // Persisted levels, XP, unlocked skins, and stats
  customThemeColor?: string; // Custom accent theme for AAA RPG dashboard
  customTitle?: string; // Custom player title
  
  // Cloud Handshake & Progression Extras
  dailyClaimStreak?: number;
  lastDailyRewardClaimed?: string;
  lastCloudSaveTimestamp?: string;
  inventory?: {
    itemId: string;
    name: string;
    quantity: number;
    description: string;
    rarity: string;
  }[];
  achievements?: {
    id: string;
    name: string;
    description: string;
    isUnlocked: boolean;
    ratingValue: number;
  }[];
}

export interface GuardianProgression {
  level: number;
  xp: number;
  unlocked: boolean;
  selectedSkinId: string;
  unlockedSkins: string[]; // list of skin ids
  speedBonus: number;
  memoryBonus: number;
  recursionBonus: number;
  stabilityBonus: number;
}

export interface GuardianSkin {
  id: string;
  name: string;
  tag: string;
  description: string;
  preview: string; // large aesthetic symbol or letter
  cost: number; // point cost
}

export interface GuardianAbility {
  name: string;
  description: string;
  cooldown: string;
  complexityCost: string;
}

export interface Guardian {
  id: string;
  name: string;
  title: string;
  classType: string;
  difficulty: 'Beginner' | 'Adept' | 'Expert' | 'Godlike';
  themeColor: 'cyan' | 'purple' | 'emerald' | 'amber';
  complexityFactor: string; // e.g., "O(log N)"
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockCost: number;
  stats: {
    speed: number; // 1-100
    memoryEfficiency: number; // 1-100
    recursionPower: number; // 1-100
    stability: number; // 1-100
  };
  abilities: GuardianAbility[];
  avatarUrl: string;
  description: string;
  skins: GuardianSkin[];
}

