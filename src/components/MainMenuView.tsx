import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Play, Settings, User, LogOut, RefreshCw, X, Sliders, Monitor, Terminal, Eye, Trophy, Bot, Swords } from 'lucide-react';
import { SettingsState, ProfileState } from '../types';
import LeaderboardView from './LeaderboardView';
import AIMentorView from './AIMentorView';
import MultiplayerArenaView from './MultiplayerArenaView';

interface MainMenuViewProps {
  settings: SettingsState;
  onUpdateSettings: (settings: Partial<SettingsState>) => void;
  profile: ProfileState;
  onUpdateProfile: (profile: Partial<ProfileState>) => void;
  onLaunchGame: () => void;
}

export default function MainMenuView({
  settings,
  onUpdateSettings,
  profile,
  onUpdateProfile,
  onLaunchGame,
}: MainMenuViewProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hudAlert, setHudAlert] = useState<{ title: string; message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [shutdownScreen, setShutdownScreen] = useState(false);

  // Profile Panel Simulator State
  const [profileSubTab, setProfileSubTab] = useState<'stats' | 'rewards' | 'inventory'>('stats');
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [cloudLogs, setCloudLogs] = useState<string[]>(['> Cyberdeck Link Standby. Ready for cloud handshake.']);

  // Initialize Web Audio API safely
  const initAudio = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  };

  // Cyber Sound Synth Generator
  const playSynthSound = (type: 'hover' | 'click' | 'powerdown' | 'transition') => {
    if (isMuted) return;
    try {
      const ctx = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContext) setAudioContext(ctx);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'hover') {
        // High-tech quick electronic sweep
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
        gain.gain.setValueAtTime(0.02 * (settings.sfxVolume), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'click') {
        // Futuristic laser snap
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.08 * (settings.sfxVolume), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'transition') {
        // Ambient glass opening sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.35);
        gain.gain.setValueAtTime(0.06 * (settings.sfxVolume), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'powerdown') {
        // Classic descending electronic buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.8);
        gain.gain.setValueAtTime(0.12 * (settings.sfxVolume), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      console.warn("Web Audio API blocked or failed to initialize: ", e);
    }
  };

  const handleHover = () => {
    initAudio();
    playSynthSound('hover');
  };

  const handleClick = (panel: string) => {
    initAudio();
    playSynthSound('click');
    setActivePanel(panel === activePanel ? null : panel);
  };

  const handleExitApp = () => {
    initAudio();
    playSynthSound('powerdown');
    setShutdownScreen(true);
  };

  const handlePlayGame = () => {
    initAudio();
    playSynthSound('click');
    onLaunchGame();
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    
    playSynthSound('transition');
    onUpdateProfile({
      username: authEmail.split('@')[0],
      rank: 'O(N^2) Initiate',
      points: 420,
      isLoggedIn: true,
      dailyClaimStreak: 0,
      lastDailyRewardClaimed: "1970-01-01T00:00:00Z",
      lastCloudSaveTimestamp: "Never",
      inventory: [
        { itemId: "hacker_chips", name: "Hacker Cryptochips", quantity: 25, description: "Standard exchange tokens to upgrade character stats", rarity: "Common" },
        { itemId: "sort_orbs", name: "Sorting Orbs", quantity: 3, description: "Consumable modules giving +20% speed in arena challenges", rarity: "Epic" },
        { itemId: "algorithm_scroll", name: "DSA Scroll (Recursion)", quantity: 1, description: "Special document unlocking elite abilities on sorcerers", rarity: "Legendary" }
      ],
      achievements: [
        { id: "first_login", name: "Digital Identity Created", description: "Verified account logs securely in Firestore", isUnlocked: true, ratingValue: 50 },
        { id: "bubble_clear", name: "Ascending Order Aligned", description: "Completed Bubble Sort Arena challenge perfectly", isUnlocked: false, ratingValue: 100 },
        { id: "streak_three", name: "Consistently Online", description: "Reached a 3-day daily rewards streak", isUnlocked: false, ratingValue: 150 },
        { id: "rank_adept", name: "Complexity Specialist", description: "Unlocked high rating points and elevated rank status", isUnlocked: false, ratingValue: 200 }
      ]
    });
    setAuthEmail('');
    setAuthPassword('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword || !authUsername) return;

    playSynthSound('transition');
    onUpdateProfile({
      username: authUsername,
      rank: 'Bubble Sort Novice',
      points: 200,
      isLoggedIn: true,
      dailyClaimStreak: 0,
      lastDailyRewardClaimed: "1970-01-01T00:00:00Z",
      lastCloudSaveTimestamp: "Never",
      inventory: [
        { itemId: "hacker_chips", name: "Hacker Cryptochips", quantity: 10, description: "Standard exchange tokens to upgrade character stats", rarity: "Common" },
        { itemId: "sort_orbs", name: "Sorting Orbs", quantity: 1, description: "Consumable modules giving +20% speed in arena challenges", rarity: "Epic" },
        { itemId: "algorithm_scroll", name: "DSA Scroll (Recursion)", quantity: 0, description: "Special document unlocking elite abilities on sorcerers", rarity: "Legendary" }
      ],
      achievements: [
        { id: "first_login", name: "Digital Identity Created", description: "Verified account logs securely in Firestore", isUnlocked: true, ratingValue: 50 },
        { id: "bubble_clear", name: "Ascending Order Aligned", description: "Completed Bubble Sort Arena challenge perfectly", isUnlocked: false, ratingValue: 100 },
        { id: "streak_three", name: "Consistently Online", description: "Reached a 3-day daily rewards streak", isUnlocked: false, ratingValue: 150 },
        { id: "rank_adept", name: "Complexity Specialist", description: "Unlocked high rating points and elevated rank status", isUnlocked: false, ratingValue: 200 }
      ]
    });
    setAuthEmail('');
    setAuthPassword('');
    setAuthUsername('');
    setIsRegistering(false);
  };

  const handleSignOut = () => {
    playSynthSound('click');
    onUpdateProfile({
      username: 'SortSpectre',
      rank: 'Guest Agent',
      points: 420,
      isLoggedIn: false,
      dailyClaimStreak: 0,
      lastDailyRewardClaimed: "1970-01-01T00:00:00Z",
      lastCloudSaveTimestamp: "Never",
    });
  };

  // Run cloud save simulation
  const triggerCloudBackup = () => {
    if (isSavingCloud) return;
    setIsSavingCloud(true);
    playSynthSound('transition');
    setCloudLogs(['> [0.0s] Compressing local binary indices...', '> [0.4s] Checking security token handshakes with Firebase Authentication...']);
    
    setTimeout(() => {
      setCloudLogs(prev => [
        ...prev, 
        '> [0.8s] Synchronizing rating points (' + profile.points + ') and achievements with Firestore...',
        '> [1.2s] Storing settings profile binaries to gs://dsa-legends.appspot.com/backups/' + profile.username + '_settings.bin'
      ]);
    }, 500);

    setTimeout(() => {
      setIsSavingCloud(false);
      onUpdateProfile({
        lastCloudSaveTimestamp: new Date().toLocaleTimeString()
      });
      setCloudLogs(prev => [
        ...prev,
        '> [1.5s] Cloud backup complete. Firestore status: VERIFIED & SECURE.'
      ]);
    }, 1500);
  };

  // Claim Daily Rewards
  const triggerDailyClaim = () => {
    playSynthSound('click');
    const isAlreadyClaimed = profile.lastDailyRewardClaimed && 
      new Date(profile.lastDailyRewardClaimed).toDateString() === new Date().toDateString();

    if (isAlreadyClaimed) {
      setHudAlert({
        title: "LINK CONFLICT",
        message: "Daily Reward has already been synchronized for today. Re-initiating in 24 hours.",
        type: 'error'
      });
      return;
    }

    const currentStreak = (profile.dailyClaimStreak || 0) + 1;
    const bonusRating = 50 + (currentStreak * 10);
    const claimedItem = currentStreak % 3 === 0 ? "Legendary Algorithm Core" : "Hacker Cryptochips (+15)";

    // Update inventory item quantity
    const updatedInventory = [...(profile.inventory || [])];
    if (currentStreak % 3 === 0) {
      updatedInventory.push({
        itemId: "legendary_core",
        name: "Legendary Algorithm Core",
        quantity: 1,
        description: "Special core unlocking expert abilities",
        rarity: "Legendary"
      });
    } else {
      const chipItem = updatedInventory.find(i => i.itemId === 'hacker_chips');
      if (chipItem) {
        chipItem.quantity += 15;
      }
    }

    // Mark Consistently Online achievement as unlocked if streak >= 3
    const updatedAchievements = (profile.achievements || []).map(ach => {
      if (ach.id === 'streak_three' && currentStreak >= 3) {
        return { ...ach, isUnlocked: true };
      }
      return ach;
    });

    onUpdateProfile({
      points: profile.points + bonusRating,
      dailyClaimStreak: currentStreak,
      lastDailyRewardClaimed: new Date().toISOString(),
      inventory: updatedInventory,
      achievements: updatedAchievements
    });

    setHudAlert({
      title: "DAILY DECRYPTION SUCCESS",
      message: `Successfully Decrypted Daily Reward!\n• Streak: Day ${currentStreak}\n• Rating points: +${bonusRating} pts\n• Claimed item: ${claimedItem}\n\nHandshake completed and stored in Google Cloud Firestore.`,
      type: 'success'
    });
  };

  return (
    <div className="relative w-full lg:aspect-video min-h-full sm:min-h-[500px] bg-slate-950 border border-slate-800 rounded-2xl overflow-y-auto custom-scrollbar shadow-2xl flex flex-col justify-between p-3 sm:p-6 lg:p-8 select-none">
      {/* 1. Cyberpunk Scanlines & Grid Backdrop */}
      {settings.gridOverlay && (
        <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none z-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-purple-950/20 pointer-events-none z-0" />

      {/* Cyber ambient animated gradient orb */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Shutdown Screen Overlay */}
      {shutdownScreen && (
        <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 animate-fade-in text-center font-mono">
          <Terminal className="w-12 h-12 text-purple-500 mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-slate-100 tracking-wider">SYSTEM SHUTTING DOWN</h2>
          <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
            Cyberdeck link disconnected from local neural network. Saving algorithms back to Firestore Document `/users/current`...
          </p>
          <button
            onClick={() => {
              setShutdownScreen(false);
              playSynthSound('transition');
            }}
            className="mt-6 flex items-center gap-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800 border border-purple-500/50 hover:border-purple-400 text-purple-200 text-xs font-bold rounded-lg transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reboot Deck</span>
          </button>
        </div>
      )}

      {/* --- MENU HEADER --- */}
      <div className="flex justify-between items-start z-10">
        <div>
          <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest font-semibold text-purple-400">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
            <span>UNITY 6 LTS ENGINE ACTIVE</span>
          </div>
          {/* Main Title with futuristic Cyberpunk Styling */}
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 relative text-slate-100 font-sans">
            DSA LEGENDS
            <span className="text-cyan-400 font-light block text-sm tracking-widest mt-0.5 font-mono">
              RISE OF THE ALGORITHM
            </span>
          </h1>
        </div>

        {/* Mute/Sound controls */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          onMouseEnter={handleHover}
          className="p-2 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 rounded-xl transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* --- CENTRAL MAIN CONTROLS --- */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6 items-start z-10 py-2 sm:py-4">
        {/* Main Menu Buttons */}
        <div className="col-span-12 lg:col-span-5 space-y-2 sm:space-y-2.5">
          {/* STAGE SELECT & PLAY BUTTON */}
          <button
            onClick={handlePlayGame}
            onMouseEnter={handleHover}
            className="w-full text-left py-3 sm:py-3.5 px-4 sm:px-5 bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-cyan-950/70 hover:from-purple-900 hover:to-cyan-900 border-2 border-purple-500/60 hover:border-cyan-400 text-purple-100 rounded-xl transition-all font-mono font-bold text-xs sm:text-sm tracking-wider flex items-center justify-between shadow-[0_4px_25px_rgba(168,85,247,0.3)] group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 fill-cyan-400/20 group-hover:scale-110 transition-transform shrink-0" />
              <div>
                <span className="block font-extrabold text-xs sm:text-sm text-slate-100 tracking-wide">SELECT LEVEL / STAGES</span>
                <span className="block text-[9px] sm:text-[10px] text-cyan-300 font-normal">10 Stages (Array, Stack, Queue, Tree, Graph)</span>
              </div>
            </div>
            <span className="text-[9px] sm:text-[10px] bg-purple-900/80 text-purple-200 border border-purple-500/50 px-2 sm:px-2.5 py-1 rounded-md font-bold shrink-0">10 WORLDS</span>
          </button>

          {/* AI MENTOR BUTTON */}
          <button
            onClick={() => handleClick('mentor')}
            onMouseEnter={handleHover}
            className={`w-full text-left py-2.5 sm:py-3 px-4 sm:px-5 border rounded-xl transition-all font-mono font-bold text-xs sm:text-sm tracking-wider flex items-center justify-between group ${
              activePanel === 'mentor'
                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_4px_15px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Bot className="w-4 h-4 text-cyan-400 group-hover:animate-bounce shrink-0" />
              <span>AI MENTOR</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-cyan-550 font-mono">ONLINE</span>
          </button>

          {/* MULTIPLAYER ARENA BUTTON */}
          <button
            onClick={() => handleClick('multiplayer')}
            onMouseEnter={handleHover}
            className={`w-full text-left py-2.5 sm:py-3 px-4 sm:px-5 border rounded-xl transition-all font-mono font-bold text-xs sm:text-sm tracking-wider flex items-center justify-between group ${
              activePanel === 'multiplayer'
                ? 'bg-purple-950/40 border-purple-500/80 text-purple-200 shadow-[0_4px_15px_rgba(168,85,247,0.25)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-purple-300'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Swords className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform shrink-0" />
              <span>MULTIPLAYER ARENA</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-purple-500 font-mono">ARENA</span>
          </button>

          {/* SETTINGS BUTTON */}
          <button
            onClick={() => handleClick('settings')}
            onMouseEnter={handleHover}
            className={`w-full text-left py-2.5 sm:py-3 px-4 sm:px-5 border rounded-xl transition-all font-mono font-bold text-xs sm:text-sm tracking-wider flex items-center justify-between group ${
              activePanel === 'settings'
                ? 'bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-[0_4px_15px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <Settings className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform shrink-0" />
              <span>SETTINGS</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500">SYSTEMS</span>
          </button>

          {/* PROFILE BUTTON */}
          <button
            onClick={() => handleClick('profile')}
            onMouseEnter={handleHover}
            className={`w-full text-left py-2.5 sm:py-3 px-4 sm:px-5 border rounded-xl transition-all font-mono font-bold text-xs sm:text-sm tracking-wider flex items-center justify-between group ${
              activePanel === 'profile'
                ? 'bg-purple-950/40 border-purple-400 text-purple-200 shadow-[0_4px_15px_rgba(168,85,247,0.2)]'
                : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-purple-300'
            }`}
          >
            <div className="flex items-center gap-2.5 sm:gap-3">
              <User className="w-4 h-4 text-purple-400 shrink-0" />
              <span>AGENT PROFILE</span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 font-semibold">
              {profile.isLoggedIn ? 'SYNCED' : 'OFFLINE'}
            </span>
          </button>

          {/* EXIT BUTTON */}
          <button
            onClick={handleExitApp}
            onMouseEnter={handleHover}
            className="w-full text-left py-2 sm:py-2.5 px-4 sm:px-5 bg-slate-900/20 hover:bg-red-950/20 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-400 rounded-xl transition-all font-mono font-bold text-xs tracking-wider"
          >
            DISCONNECT DECK
          </button>
        </div>

        {/* Glassmorphic Side Panels (Settings / Profile info overlays) */}
        <div className="col-span-12 lg:col-span-7 min-h-[260px] sm:min-h-[360px] lg:min-h-[420px] relative">
          {activePanel === 'mentor' && (
            <AIMentorView profile={profile} sfxVolume={settings.sfxVolume} onClose={() => setActivePanel(null)} />
          )}

          {activePanel === 'multiplayer' && (
            <MultiplayerArenaView profile={profile} sfxVolume={settings.sfxVolume} onClose={() => setActivePanel(null)} />
          )}

          {activePanel === 'leaderboard' && (
            <LeaderboardView profile={profile} sfxVolume={settings.sfxVolume} onClose={() => setActivePanel(null)} />
          )}

          {activePanel === 'settings' && (
            <div className="relative lg:absolute inset-0 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl animate-fade-in flex flex-col justify-between overflow-y-auto custom-scrollbar h-full w-full min-h-[320px]">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold text-cyan-200 uppercase tracking-wider">
                    Deck Configuration
                  </span>
                </div>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Volume / Video sliders */}
              <div className="space-y-3.5 py-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Music Synth Volume</span>
                    <span className="text-cyan-400">{Math.round(settings.musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.musicVolume}
                    onChange={(e) => onUpdateSettings({ musicVolume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Tactile SFX Volume</span>
                    <span className="text-cyan-400">{Math.round(settings.sfxVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.sfxVolume}
                    onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Display configs */}
                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Monitor className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Retro CRT Grid Screen Overlay</span>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ gridOverlay: !settings.gridOverlay })}
                    className={`w-9 h-5 rounded-full p-0.5 transition-all duration-200 ${
                      settings.gridOverlay ? 'bg-cyan-500' : 'bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-200 ${
                        settings.gridOverlay ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="text-[9px] font-mono text-slate-500 border-t border-slate-800/60 pt-2 flex justify-between">
                <span>Graphics Engine: UR Pipeline</span>
                <span>V-Sync Locked: 60FPS</span>
              </div>
            </div>
          )}

          {activePanel === 'profile' && (
            <div className="relative lg:absolute inset-0 bg-slate-900/95 border border-purple-500/30 rounded-2xl p-4 sm:p-5 backdrop-blur-xl animate-fade-in flex flex-col justify-between overflow-y-auto custom-scrollbar h-full w-full min-h-[360px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono font-bold text-purple-200 uppercase tracking-wider">
                    Cloud Cyberdeck Credentials
                  </span>
                </div>
                <button
                  onClick={() => setActivePanel(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {profile.isLoggedIn ? (
                /* Authenticated State */
                <div className="flex-1 flex flex-col justify-between mt-3 overflow-hidden">
                  
                  {/* Neon Glassmorphic Sub-Tabs Navigation */}
                  <div className="flex bg-slate-950/60 border border-slate-850 p-1 rounded-xl shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => { playSynthSound('click'); setProfileSubTab('stats'); }}
                      className={`flex-1 py-1 px-2 text-[10px] font-mono font-bold rounded-lg transition-all ${
                        profileSubTab === 'stats'
                          ? 'bg-purple-950/60 border border-purple-800/40 text-purple-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      ID & BACKUP
                    </button>
                    <button
                      type="button"
                      onClick={() => { playSynthSound('click'); setProfileSubTab('rewards'); }}
                      className={`flex-1 py-1 px-2 text-[10px] font-mono font-bold rounded-lg transition-all ${
                        profileSubTab === 'rewards'
                          ? 'bg-purple-950/60 border border-purple-800/40 text-purple-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      DAILY BONUS
                    </button>
                    <button
                      type="button"
                      onClick={() => { playSynthSound('click'); setProfileSubTab('inventory'); }}
                      className={`flex-1 py-1 px-2 text-[10px] font-mono font-bold rounded-lg transition-all ${
                        profileSubTab === 'inventory'
                          ? 'bg-purple-950/60 border border-purple-800/40 text-purple-300'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      DECK ASSETS
                    </button>
                  </div>

                  {/* Sub-Tab Contents */}
                  <div className="flex-1 overflow-y-auto py-2.5 custom-scrollbar text-xs">
                    {profileSubTab === 'stats' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center font-mono text-lg font-bold text-purple-300 uppercase shrink-0">
                            {profile.username ? profile.username[0] : 'S'}
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-200 font-mono truncate">{profile.username}</h4>
                            <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
                              {profile.rank}
                            </span>
                          </div>
                        </div>

                        {/* Rating block */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                            <span className="text-[8px] font-mono text-slate-500 block">DSA RATING</span>
                            <span className="text-xs font-mono font-bold text-cyan-400">{profile.points} pts</span>
                          </div>
                          <div className="p-2 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                            <span className="text-[8px] font-mono text-slate-500 block">LAST CLOUD SAVE</span>
                            <span className="text-[10px] font-mono font-bold text-purple-400 truncate block">
                              {profile.lastCloudSaveTimestamp || "Never"}
                            </span>
                          </div>
                        </div>

                        {/* Save Trigger Actions with terminal output */}
                        <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Durable Cloud Storage (Firestore)</span>
                            <button
                              type="button"
                              onClick={triggerCloudBackup}
                              disabled={isSavingCloud}
                              className="px-2 py-1 bg-purple-900/50 hover:bg-purple-800 border border-purple-500/50 hover:border-purple-400 text-purple-200 text-[9px] font-bold rounded-lg font-mono transition-all disabled:opacity-50"
                            >
                              {isSavingCloud ? 'SYNCING...' : 'BACKUP SNAPSHOT'}
                            </button>
                          </div>
                          
                          {/* Live save trace logs */}
                          <div className="bg-black/40 border border-slate-900 p-2 rounded-lg font-mono text-[9px] text-slate-400 space-y-0.5 select-text h-[70px] overflow-y-auto custom-scrollbar leading-relaxed">
                            {cloudLogs.map((logLine, idx) => (
                              <div key={idx} className={idx === cloudLogs.length - 1 ? 'text-purple-300 font-semibold' : 'text-slate-500'}>
                                {logLine}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {profileSubTab === 'rewards' && (
                      <div className="space-y-3">
                        <div className="bg-slate-950/40 border border-slate-800/60 p-3 rounded-xl flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono text-slate-500 uppercase block">Daily Claims Streak</span>
                            <div className="flex items-center gap-1.5">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <span className="text-sm font-mono font-extrabold text-slate-100">{profile.dailyClaimStreak || 0} Days</span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={triggerDailyClaim}
                            className="py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 border border-cyan-500 text-cyan-100 font-mono text-[10px] font-bold rounded-lg shadow-md transition-all active:scale-98"
                          >
                            CLAIM TODAY
                          </button>
                        </div>

                        <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl space-y-1.5">
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase block">Rewards Calendar & Scaling Factor</span>
                          <p className="text-[10px] font-mono text-slate-500 leading-relaxed">
                            Log in daily to scale your rewards multipliers. Standard claims grant <strong className="text-cyan-400">+50 rating</strong> points. Every 3-day consecutive claim grants a bonus <strong className="text-purple-400">Legendary Core</strong>.
                          </p>
                          <div className="flex gap-1 pt-1 justify-between">
                            {[1, 2, 3, 4, 5].map((day) => {
                              const isActive = (profile.dailyClaimStreak || 0) >= day;
                              return (
                                <div
                                  key={day}
                                  className={`flex-1 py-1 px-1 rounded-lg border text-center font-mono ${
                                    isActive
                                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-200'
                                      : 'bg-slate-950 border-slate-850 text-slate-600'
                                  }`}
                                >
                                  <div className="text-[7px]">DAY {day}</div>
                                  <div className="text-[9px] font-bold mt-0.5">{isActive ? '✓' : `+${50 + day * 10}`}</div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {profileSubTab === 'inventory' && (
                      <div className="grid grid-cols-2 gap-3 h-[180px] overflow-hidden">
                        
                        {/* Inv items Column */}
                        <div className="space-y-1.5 overflow-y-auto max-h-[175px] pr-0.5 custom-scrollbar">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block pb-0.5">Synced Inventory</span>
                          {(profile.inventory || []).map((item) => {
                            let rarityColor = 'text-slate-400';
                            if (item.rarity === 'Epic') rarityColor = 'text-cyan-400';
                            if (item.rarity === 'Legendary') rarityColor = 'text-amber-400 font-semibold';
                            
                            return (
                              <div key={item.itemId} className="p-1.5 bg-slate-950/60 border border-slate-900 rounded-lg flex justify-between items-center text-[10px] font-mono">
                                <div className="truncate pr-1">
                                  <span className="text-slate-300 font-bold block truncate">{item.name}</span>
                                  <span className={`text-[8px] block mt-0.5 ${rarityColor}`}>{item.rarity}</span>
                                </div>
                                <span className="bg-purple-950/60 border border-purple-800/40 text-purple-300 px-1.5 py-0.5 rounded-md font-bold shrink-0">
                                  x{item.quantity}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Achievements Column */}
                        <div className="space-y-1.5 overflow-y-auto max-h-[175px] pr-0.5 custom-scrollbar">
                          <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block pb-0.5">Achievements</span>
                          {(profile.achievements || []).map((ach) => (
                            <div key={ach.id} className="p-1.5 bg-slate-950/60 border border-slate-900 rounded-lg text-[10px] font-mono relative overflow-hidden">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold truncate ${ach.isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {ach.name}
                                </span>
                                <span className={`text-[8px] font-bold px-1 rounded shrink-0 ${ach.isUnlocked ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40' : 'bg-slate-900 text-slate-600'}`}>
                                  {ach.isUnlocked ? 'UNLOCKED' : `+${ach.ratingValue}XP`}
                                </span>
                              </div>
                              <span className="text-[8px] text-slate-500 block truncate leading-tight mt-0.5">{ach.description}</span>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-red-950/30 border border-slate-750 hover:border-red-500/40 text-slate-400 hover:text-red-300 text-[10px] font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect Identity</span>
                  </button>
                </div>
              ) : (
                /* Login / Signup Flow */
                <form
                  onSubmit={isRegistering ? handleRegister : handleSignIn}
                  className="flex-1 flex flex-col justify-between py-3"
                >
                  <div className="space-y-2.5">
                    {isRegistering && (
                      <input
                        type="text"
                        placeholder="Agent Callsign (Username)"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                        required
                      />
                    )}
                    <input
                      type="email"
                      placeholder="Security Node Email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Access Key (Password)"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                      required
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-[10px] font-mono text-purple-400 hover:text-purple-300"
                    >
                      {isRegistering ? 'Have a callsign? Log In' : 'New agent? Register'}
                    </button>
                    <button
                      type="submit"
                      className="ml-auto py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-purple-100 font-mono text-xs font-bold rounded-lg shadow-md shadow-purple-500/20 transition-all"
                    >
                      {isRegistering ? 'Register' : 'Decrypt Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Idle Terminal Display (Default when no panel is clicked) */}
          {!activePanel && (
            <div className="relative lg:absolute inset-0 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex flex-col justify-between font-mono min-h-[200px] w-full">
              <div className="flex items-center gap-2 text-cyan-400 text-xs">
                <Terminal className="w-4 h-4" />
                <span className="font-bold">CYBERDECK INTERLINK STATUS</span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400 leading-relaxed py-2">
                <div>&gt; Loading database configurations... <span className="text-emerald-400">READY</span></div>
                <div>&gt; Establishing link with Firebase server... <span className="text-emerald-400">ACTIVE</span></div>
                <div>&gt; Authenticating agent identity... <span className="text-purple-400">{profile.username}</span></div>
                <div>&gt; Selected DSA Rank: <span className="text-cyan-400 font-semibold">{profile.rank}</span></div>
              </div>

              <div className="text-[9px] text-slate-500 border-t border-slate-800/60 pt-2 flex justify-between">
                <span>Version: Unity 6 (6000.0.12f1 LTS)</span>
                <span>Active Target: WebGL GLSL_300</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MENU FOOTER --- */}
      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-3 z-10 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
          <span>DSA Legends Studio (2026)</span>
        </div>
        <span>PREVIEW MODE • DOUBLE-TAP ESC TO EXIT PANELS</span>
      </div>

      {/* Custom HUD Alert Overlay */}
      {hudAlert && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in font-mono">
          <div className="bg-slate-950 border-2 border-purple-500/50 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            <div className={`px-4 py-2 border-b border-purple-500/30 flex items-center gap-2 ${
              hudAlert.type === 'error' ? 'bg-red-950/40 text-red-400' : 'bg-purple-950/40 text-purple-300'
            }`}>
              <Shield className="w-4 h-4 shrink-0" />
              <span className="text-xs font-bold tracking-wider">{hudAlert.title}</span>
            </div>
            <div className="p-5 text-left space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">{hudAlert.message}</p>
              <button
                onClick={() => { playSynthSound('click'); setHudAlert(null); }}
                className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/40 text-purple-200 text-xs font-bold rounded-lg transition-all"
              >
                DISMISS CONNECTION SIGNALS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
