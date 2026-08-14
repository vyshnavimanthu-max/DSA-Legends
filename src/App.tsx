import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { 
  Download, Terminal, Layers, Flame, BookOpen, Sparkles, 
  Code, Cpu, ShieldCheck, FolderGit, Check, HelpCircle,
  Volume2, VolumeX, Music, HelpCircle as HelpIcon, Play, Pause, Package, GraduationCap, Gamepad2, Layout, MapPin
} from 'lucide-react';

import FolderTree from './components/FolderTree';
import ScriptViewer from './components/ScriptViewer';
import MainMenuView from './components/MainMenuView';
import SortingGameView from './components/SortingGameView';
import ThirdPersonRPGGameView from './components/ThirdPersonRPGGameView';
import FirebaseGuide from './components/FirebaseGuide';
import CharacterSelectionView from './components/CharacterSelectionView';
import WorldMapView from './components/WorldMapView';
import InteractiveCodingEngine from './components/InteractiveCodingEngine';
import TutorialAcademy from './components/TutorialAcademy';
import LoginPage from './components/LoginPage';

import AestheticCanvas from './components/AestheticCanvas';
import AddressablesInspector from './components/AddressablesInspector';
import PremiumAudioManager from './lib/audioManager';

import { UNITY_FILES, UNITY_FOLDERS, UNITY_PROJECT_NAME } from './unityProjectData';
import { UnityFile, SettingsState, ProfileState } from './types';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<UnityFile | null>(UNITY_FILES[0]);
  const [activeTab, setActiveTab] = useState<'simulator' | 'scripts' | 'firebase' | 'solid-guide' | 'coding-engine' | 'addressables' | 'academy'>('simulator');
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [selectedWorldId, setSelectedWorldId] = useState<string>('array_kingdom');

  // Music state trackers
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Global Simulator State
  const [settings, setSettings] = useState<SettingsState>({
    musicVolume: 0.9,
    sfxVolume: 0.8,
    graphicsQuality: 'high',
    gridOverlay: true,
    chromaticAberration: true,
  });

  const [profile, setProfile] = useState<ProfileState>(() => {
    const saved = localStorage.getItem('dsa_legends_profile_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...parsed,
            completedWorlds: parsed.completedWorlds || []
          };
        }
      } catch (e) {
        // Fallback
      }
    }
    return {
      username: 'SortSpectre',
      rank: 'Guest Agent',
      points: 100,
      avatar: 'S',
      isLoggedIn: false,
      completedWorlds: [],
      dailyClaimStreak: 0,
      lastDailyRewardClaimed: "1970-01-01T00:00:00Z",
      lastCloudSaveTimestamp: "Never",
      inventory: [
        { itemId: "hacker_chips", name: "Hacker Cryptochips", quantity: 25, description: "Standard exchange tokens to upgrade character stats", rarity: "Common" },
        { itemId: "sort_orbs", name: "Sorting Orbs", quantity: 3, description: "Consumable modules giving +20% speed in arena challenges", rarity: "Epic" },
        { itemId: "algorithm_scroll", name: "DSA Scroll (Recursion)", quantity: 1, description: "Special document unlocking elite abilities on sorcerers", rarity: "Legendary" }
      ],
      achievements: [
        { id: "first_login", name: "Digital Identity Created", description: "Verified account logs securely in Firestore", isUnlocked: false, ratingValue: 50 },
        { id: "bubble_clear", name: "Ascending Order Aligned", description: "Completed Bubble Sort Arena challenge perfectly", isUnlocked: false, ratingValue: 100 },
        { id: "streak_three", name: "Consistently Online", description: "Reached a 3-day daily rewards streak", isUnlocked: false, ratingValue: 150 },
        { id: "rank_adept", name: "Complexity Specialist", description: "Unlocked high rating points and elevated rank status", isUnlocked: false, ratingValue: 200 }
      ]
    };
  });

  const [hasEnteredWorkspace, setHasEnteredWorkspace] = useState(() => {
    const saved = localStorage.getItem('dsa_legends_profile_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return !!(parsed && parsed.isLoggedIn);
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  const handleUpdateProfile = (updated: Partial<ProfileState>) => {
    setProfile(prev => {
      const next = { ...prev, ...updated };
      // Check for logout (where username becomes SortSpectre and loggedIn becomes false)
      if (updated.isLoggedIn === false && updated.username === 'SortSpectre') {
        setHasEnteredWorkspace(false);
      }
      return next;
    });
  };

  React.useEffect(() => {
    localStorage.setItem('dsa_legends_profile_v2', JSON.stringify(profile));
  }, [profile]);

  // Synchronize system settings with synthesizer volume channels
  useEffect(() => {
    const audio = PremiumAudioManager.getInstance();
    audio.updateVolumes(settings.musicVolume, settings.sfxVolume);
  }, [settings.musicVolume, settings.sfxVolume]);

  const handleToggleMusic = () => {
    const audio = PremiumAudioManager.getInstance();
    if (isMusicPlaying) {
      audio.stopMusic();
      setIsMusicPlaying(false);
    } else {
      audio.startMusic();
      setIsMusicPlaying(true);
      audio.playSFX('click');
    }
  };

  const handleToggleMute = () => {
    const audio = PremiumAudioManager.getInstance();
    const muted = audio.toggleMute();
    setIsMuted(muted);
    audio.playSFX('click');
  };

  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [isSelectingCharacter, setIsSelectingCharacter] = useState(false);
  const [isViewingWorldMap, setIsViewingWorldMap] = useState(false);
  const [viewMode, setViewMode] = useState<'game' | 'workspace'>('game');

  // Helper to render current active game view
  const renderGameScreen = () => {
    if (isPlayingGame) {
      return (
        <ThirdPersonRPGGameView
          profile={profile}
          selectedWorldId={selectedWorldId}
          onUpdateProfile={handleUpdateProfile}
          onBackToMenu={() => {
            setIsPlayingGame(false);
            setIsViewingWorldMap(true);
          }}
        />
      );
    }
    if (isSelectingCharacter) {
      return (
        <CharacterSelectionView
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onSelectGuardian={(guardianId) => {
            setProfile((prev) => ({ ...prev, selectedGuardianId: guardianId }));
            setIsSelectingCharacter(false);
            setIsPlayingGame(true);
          }}
          onBackToMenu={() => {
            setIsSelectingCharacter(false);
            setIsViewingWorldMap(true);
          }}
        />
      );
    }
    if (isViewingWorldMap) {
      return (
        <WorldMapView
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onBackToMenu={() => setIsViewingWorldMap(false)}
          onLaunchLevel={(worldId) => {
            setSelectedWorldId(worldId);
            setIsViewingWorldMap(false);
            setIsSelectingCharacter(true);
          }}
        />
      );
    }
    return (
      <MainMenuView
        settings={settings}
        onUpdateSettings={(updated) => setSettings(prev => ({ ...prev, ...updated }))}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onLaunchGame={() => setIsViewingWorldMap(true)}
      />
    );
  };

  // JSZip Bundler: Generates a complete Unity 6 folder layout & scripts in browser
  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      
      // Create directories
      UNITY_FOLDERS.forEach((folder) => {
        zip.folder(folder);
      });

      // Write code files
      UNITY_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Include a README.md explaining SOLID architecture
      const readmeText = `# DSA Legends: Rise of the Algorithm
Unity 6 (LTS) Architecture Blueprint
Created using strictly C# SOLID principles.

## 📁 Scalable Directory Hierarchy
This project structure separates Core initialization logic, Audio rendering pipelines, UI canvas handlers, and Firebase Auth/Firestore databases.

## ⚡ SOLID implementation
- **Single Responsibility (SRP):** Classes like \`AudioManager\` and \`FirebaseManager\` execute distinct, decoupled operations.
- **Open/Closed (OCP):** The \`MainMenuController\` dynamically toggles panel views via generic panel interface lists rather than hardcoded subclasses.
- **Liskov Substitution (LSP):** Subclasses of \`UIPanel\` (\`SettingsPanel\`, \`ProfilePanel\`) can be substituted interchangeably inside controllers.
- **Interface Segregation (ISP):** Split auth methods (\`IFirebaseAuthService\`) from database operations (\`IFirebaseDatabaseService\`).
- **Dependency Inversion (DIP):** UI controllers link into abstract layers like \`IAudioService\` instead of binding to direct managers.
`;
      zip.file("Assets/README_ARCHITECTURE.md", readmeText);

      // Generate Blob and download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = "DSALegends_Unity6_Project.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to compile ZIP project: ", e);
    } finally {
      setDownloadingZip(false);
    }
  };

  // Helper to copy local shell bootstrap commands
  const handleCopyShellScript = () => {
    // Generate a beautiful shell script that makes the folder tree
    const scriptLines = [
      "#!/bin/bash",
      `echo "Creating Unity 6 project folder tree for: ${UNITY_PROJECT_NAME}"`,
      ...UNITY_FOLDERS.map(f => `mkdir -p "${f}"`),
      "echo 'Project tree generated successfully!'"
    ].join('\n');

    navigator.clipboard.writeText(scriptLines);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleSelectFileFromTree = (file: UnityFile) => {
    setSelectedFile(file);
    setActiveTab('scripts');
  };

  if (!hasEnteredWorkspace) {
    return (
      <LoginPage 
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onEnterWorkspace={() => setHasEnteredWorkspace(true)}
      />
    );
  }

  // CLEAN FULLSCREEN GAME MODE (DEFAULT - NO ASSETS SIDEBAR ON SCREEN)
  if (viewMode === 'game') {
    return (
      <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
        
        {/* High-Fidelity Physics and Climate Particle Canvas */}
        <div className="absolute inset-0 z-0">
          <AestheticCanvas quality={settings.graphicsQuality} />
        </div>

        {/* Minimal Floating Top Navbar for Game Mode */}
        <header className="px-2.5 sm:px-4 py-2 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between relative z-20 shrink-0 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <span className="p-1 sm:p-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-white font-black text-[10px] sm:text-xs font-mono shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              U6
            </span>
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold tracking-wide font-mono bg-gradient-to-r from-slate-100 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                DSA LEGENDS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap justify-end">
            {/* Stages Map Direct Navigation Button */}
            <button
              onClick={() => {
                setIsViewingWorldMap(true);
                setIsPlayingGame(false);
                setIsSelectingCharacter(false);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-purple-900/90 to-cyan-900/90 hover:from-purple-800 hover:to-cyan-800 border border-cyan-500/50 text-[11px] sm:text-xs font-bold text-cyan-200 rounded-xl transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              title="Open 10 Stages & Levels World Map"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 animate-pulse shrink-0" />
              <span className="hidden xs:inline sm:inline">Stages / Levels Map</span>
              <span className="xs:hidden sm:hidden">Stages</span>
            </button>

            {/* Generative Synth BGM Control Deck */}
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 bg-slate-900/90 border border-slate-800/80 rounded-xl font-mono text-[10px] sm:text-[11px]">
              <div className="flex items-center gap-1 text-purple-400 shrink-0">
                <Music className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
              </div>
              
              <button
                type="button"
                onClick={handleToggleMusic}
                className={`p-1 rounded-md transition-all ${
                  isMusicPlaying 
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/50' 
                    : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-900'
                }`}
                title={isMusicPlaying ? "Pause ambient soundscape" : "Play real-time ambient soundscape"}
              >
                {isMusicPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-cyan-400" />}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-1 rounded-md transition-all ${
                  isMuted 
                    ? 'bg-red-950 text-red-400 border border-red-900/60' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900'
                }`}
                title={isMuted ? "Unmute Master SFX" : "Mute Master SFX"}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
            </div>

            {/* Dev / Assets Workspace Inspector Toggle */}
            <button
              onClick={() => setViewMode('workspace')}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] sm:text-xs font-semibold text-purple-300 rounded-xl transition-all shadow-sm hover:border-purple-500/50"
              title="Open Unity Assets & Developer Code Workspace"
            >
              <Code className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-400 shrink-0" />
              <span className="hidden sm:inline">Developer Workspace</span>
              <span className="sm:hidden">Dev</span>
            </button>
          </div>
        </header>

        {/* Full-Width Game Canvas Container */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-1.5 sm:p-4 md:p-6 flex flex-col relative z-10">
          <div className="bg-slate-950 border sm:border-2 border-slate-850 rounded-xl sm:rounded-2xl md:rounded-3xl p-1 sm:p-3 shadow-2xl relative overflow-y-auto custom-scrollbar flex-1 min-h-[460px] sm:min-h-[560px] flex flex-col">
            {renderGameScreen()}
          </div>
        </main>
      </div>
    );
  }

  // DEVELOPER & ARCHITECT WORKSPACE MODE (INCLUDES ASSETS SECTION)
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* High-Fidelity Physics and Climate Particle Canvas */}
      <div className="absolute inset-0 z-0">
        <AestheticCanvas quality={settings.graphicsQuality} />
      </div>

      {/* --- DASHBOARD HEADER --- */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 py-4 relative z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Platform Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-white font-black text-xs font-mono shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                U6
              </span>
              <h1 className="text-lg font-black tracking-wide font-mono bg-gradient-to-r from-slate-100 via-slate-100 to-purple-400 bg-clip-text text-transparent">
                DSA LEGENDS: ARCHITECT WORKSPACE
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Unity 6 LTS (6000.0.12f1) • High-fidelity C# SOLID blueprint & Interactive UI Simulator
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Return to Game Button */}
            <button
              onClick={() => setViewMode('game')}
              className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>🎮 Play Fullscreen Game</span>
            </button>

            {/* Generative Synth BGM Control Deck */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 border border-slate-800/80 rounded-xl font-mono text-[11px] relative z-20">
              <div className="flex items-center gap-1 text-purple-400 shrink-0">
                <Music className={`w-3.5 h-3.5 ${isMusicPlaying ? 'animate-bounce' : ''}`} />
                <span className="text-[10px] font-bold text-slate-300 mr-1">SYNTH BGM:</span>
              </div>
              
              <button
                type="button"
                onClick={handleToggleMusic}
                className={`p-1 rounded-md transition-all ${
                  isMusicPlaying 
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/50' 
                    : 'bg-slate-950 text-slate-500 hover:text-slate-300 border border-slate-900'
                }`}
                title={isMusicPlaying ? "Pause ambient soundscape" : "Play real-time ambient soundscape"}
              >
                {isMusicPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-cyan-400" />}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                className={`p-1 rounded-md transition-all ${
                  isMuted 
                    ? 'bg-red-950 text-red-400 border border-red-900/60' 
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-900'
                }`}
                title={isMuted ? "Unmute Master SFX" : "Mute Master SFX"}
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>

              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[8px] text-slate-500">VOL:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.musicVolume}
                  onChange={(e) => setSettings(prev => ({ ...prev, musicVolume: parseFloat(e.target.value) }))}
                  className="w-12 h-1 accent-purple-500 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Bash Generator */}
            <button
              onClick={handleCopyShellScript}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              {copiedScript ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400 font-mono">Shell script copied!</span>
                </>
              ) : (
                <>
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Get Folder-Setup Script</span>
                </>
              )}
            </button>

            {/* ZIP Downloader */}
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(168,85,247,0.35)] disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingZip ? 'Compiling ZIP...' : 'Download Unity Project.zip'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* --- WORKSPACE LAYOUT --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-12 gap-6 relative z-10 overflow-hidden">
        
        {/* Left Column: Interactive Unity Folder Structure (Assets Section) */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col min-h-[400px] md:h-full">
          <FolderTree 
            onSelectFile={handleSelectFileFromTree} 
            selectedFile={selectedFile} 
          />
        </div>

        {/* Right Column: Multi-tab Panel (Simulator, Code, Firebase, Architecture Rules) */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 flex flex-col gap-5 h-full">
          
          {/* Tab Selection Headers */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-850 rounded-xl overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'simulator'
                  ? 'bg-purple-900/30 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>1. Main Menu Simulator</span>
            </button>

            <button
              onClick={() => { PremiumAudioManager.getInstance().playSFX('click'); setActiveTab('academy'); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'academy'
                  ? 'bg-purple-900/30 text-cyan-200 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
              <span>2. Unity Tutorial Academy</span>
            </button>

            <button
              onClick={() => setActiveTab('scripts')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'scripts'
                  ? 'bg-purple-900/30 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>3. C# SOLID Inspector</span>
            </button>

            <button
              onClick={() => setActiveTab('firebase')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'firebase'
                  ? 'bg-purple-900/30 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>4. Firebase Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('solid-guide')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'solid-guide'
                  ? 'bg-purple-900/30 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>5. SOLID Rules Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('coding-engine')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'coding-engine'
                  ? 'bg-purple-900/30 text-cyan-200 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>6. Cyber Sandbox Code Engine</span>
            </button>

            <button
              onClick={() => { PremiumAudioManager.getInstance().playSFX('click'); setActiveTab('addressables'); }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'addressables'
                  ? 'bg-purple-900/30 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-purple-400" />
              <span>7. Addressables Asset Hub</span>
            </button>
          </div>

          {/* Active Tab Contents */}
          <div className="flex-1 min-h-[450px]">
            {activeTab === 'simulator' && (
              <div className="space-y-6">
                
                {/* Visual Frame mimicking a 16:9 widescreen computer monitor */}
                <div className="bg-slate-950 border-4 border-slate-900 rounded-3xl p-3 shadow-2xl relative overflow-hidden">
                  
                  {/* Decorative monitor camera indicator */}
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1 items-center z-10">
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                  </div>

                  {/* Simulated Widescreen screen space */}
                  {renderGameScreen()}
                </div>

                {/* Instructions */}
                <div className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    Interactive Workspace Instructions:
                  </h4>
                  <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-1 font-mono leading-relaxed pl-1">
                    <li>Click <b>SETTINGS</b> or <b>AGENT PROFILE</b> inside the screen to view neon glassmorphic tabs.</li>
                    <li>Update your callsign username in the Profile tab to test simulated Firestore document saving.</li>
                    <li>Click <b>LAUNCH GAME</b> to play the Bubble Sort dungeon, solve the array, and earn real-time profile XP points!</li>
                    <li>Use <b>GET FOLDER-SETUP SCRIPT</b> to copy a shell script to rebuild these directories on your computer instantly.</li>
                  </ul>
                </div>

              </div>
            )}

            {activeTab === 'academy' && (
              <TutorialAcademy
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onBackToMenu={() => setActiveTab('simulator')}
              />
            )}

            {activeTab === 'scripts' && (
              <ScriptViewer file={selectedFile} />
            )}

            {activeTab === 'firebase' && (
              <FirebaseGuide />
            )}

            {activeTab === 'coding-engine' && (
              <InteractiveCodingEngine 
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onBackToMenu={() => setActiveTab('simulator')}
              />
            )}

            {activeTab === 'solid-guide' && (
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-6 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar">
                
                {/* Header */}
                <div className="flex items-start gap-4 pb-5 border-b border-slate-800/60">
                  <div className="p-3 bg-purple-950/40 border border-purple-500/30 text-purple-400 rounded-xl">
                    <Cpu className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-100 tracking-wide">
                      C# SOLID Principles Implementation
                    </h2>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                      How we structured <b>DSA Legends</b> architecture to remain scalable, decoupled, and highly testing-friendly.
                    </p>
                  </div>
                </div>

                {/* SOLID Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* S */}
                  <div className="p-4.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-sm">
                      <span className="px-2 py-0.5 bg-purple-950/50 border border-purple-800/50 rounded-md">S</span>
                      <span>Single Responsibility (SRP)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Each MonoBehaviour handles exactly one core concern. <code>AudioManager</code> is only concerned with AudioSources; <code>ProfilePanel</code> only formats layout fields. No script mixes database access, gameplay, and graphics together.
                    </p>
                  </div>

                  {/* O */}
                  <div className="p-4.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                      <span className="px-2 py-0.5 bg-cyan-950/50 border border-cyan-800/50 rounded-md">O</span>
                      <span>Open/Closed Principle (OCP)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Our systems are open for extension but closed for modification. <code>MainMenuController</code> coordinates generic <code>UIPanel</code> references via interfaces, allowing us to add dozens of new screens without changing the core controller.
                    </p>
                  </div>

                  {/* L */}
                  <div className="p-4.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-mono font-bold text-sm">
                      <span className="px-2 py-0.5 bg-purple-950/50 border border-purple-800/50 rounded-md">L</span>
                      <span>Liskov Substitution (LSP)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Derived sub-panels like <code>SettingsPanel</code> and <code>ProfilePanel</code> inherit from <code>UIPanel</code> and implement <code>IPanelController</code>. The controller can activate, transition, and disable any subpanel interchangeably.
                    </p>
                  </div>

                  {/* I */}
                  <div className="p-4.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm">
                      <span className="px-2 py-0.5 bg-cyan-950/50 border border-cyan-800/50 rounded-md">I</span>
                      <span>Interface Segregation (ISP)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Rather than exposing a fat database client class, we segregated interfaces into <code>IFirebaseAuthService</code> and <code>IFirebaseDatabaseService</code>. A login form only consumes the Auth methods, protecting data access scopes.
                    </p>
                  </div>

                  {/* D */}
                  <div className="col-span-1 md:col-span-2 p-4.5 bg-gradient-to-r from-purple-950/20 to-cyan-950/20 border border-purple-500/20 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-sm">
                      <span className="px-2 py-0.5 bg-indigo-950/50 border border-indigo-800/50 rounded-md">D</span>
                      <span>Dependency Inversion (DIP)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      High-level modules do not import or bind directly to low-level controllers. <code>MainMenuController</code> accesses sound triggers via <code>IAudioService</code> interfaces rather than requesting the concrete <code>AudioManager</code>. This lets us mock audio in offline testing or replace the audio engine entirely with zero impact on UI.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'addressables' && (
              <AddressablesInspector />
            )}
          </div>

        </div>

      </main>

      {/* --- DASHBOARD FOOTER --- */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-mono shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 DSA Legends: Rise of the Algorithm • Built for Unity 6 LTS</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><FolderGit className="w-3.5 h-3.5 text-cyan-400" /> 21 Folders</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> 9 C# SOLID Files</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
