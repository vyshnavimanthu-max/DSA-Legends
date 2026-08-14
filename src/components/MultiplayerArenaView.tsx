import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, Trophy, Swords, Sparkles, RefreshCw, Activity, 
  Send, Plus, Heart, Target, Flame, Database, Info, Play, CheckCircle2, XCircle, Zap, X
} from 'lucide-react';
import { ProfileState } from '../types';
import LeaderboardView from './LeaderboardView';

interface MultiplayerArenaViewProps {
  profile: ProfileState;
  sfxVolume: number;
  onClose?: () => void;
}

type TabType = 'pvp' | 'raids' | 'leaderboard' | 'guilds' | 'friends';

interface Friend {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE';
  activeChallenge: string;
  avatar: string;
}

interface Guild {
  name: string;
  tag: string;
  level: number;
  xp: number;
  maxXp: number;
  membersCount: number;
  description: string;
  globalRank: number;
}

export default function MultiplayerArenaView({ profile, sfxVolume, onClose }: MultiplayerArenaViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pvp');
  const [cloudSynced, setCloudSynced] = useState(true);
  const [syncLog, setSyncLog] = useState<string[]>(['> Cloud Database secure. Listening to real-time firestore sockets.']);
  
  // PVP States
  const [pvpStatus, setPvpStatus] = useState<'IDLE' | 'MATCHMAKING' | 'CONNECTED' | 'IN_BATTLE' | 'FINISHED'>('IDLE');
  const [opponent, setOpponent] = useState<{ name: string; avatar: string; rating: number; progress: number } | null>(null);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [matchmakingTimer, setMatchmakingTimer] = useState(0);
  const [battleTimer, setBattleTimer] = useState(45);
  const [battleResult, setBattleResult] = useState<'VICTORY' | 'DEFEAT' | null>(null);
  const [submittingCode, setSubmittingCode] = useState(false);

  // Raids States
  const [bossHp, setBossHp] = useState(72000);
  const maxBossHp = 100000;
  const [raidLogs, setRaidLogs] = useState<string[]>([
    '> Raid initialized against "The O(N^3) Garbage Collector".',
    '> Player team linked up. Defensive algorithms optimized.'
  ]);
  const [playersShield, setPlayersShield] = useState(100);
  const [raidFinished, setRaidFinished] = useState(false);

  // Guild States
  const [activeGuild, setActiveGuild] = useState<Guild | null>({
    name: 'The Dynamic Programmers',
    tag: 'TDP',
    level: 14,
    xp: 8200,
    maxXp: 12000,
    membersCount: 28,
    description: 'Securing global arrays one index at a time with optimal subproblems.',
    globalRank: 4
  });
  const [guildChat, setGuildChat] = useState<{ sender: string; msg: string; time: string }[]>([
    { sender: 'PointerPirate', msg: 'Need some shield buffs for the O(N^3) boss raid tonight!', time: '12:04' },
    { sender: 'RootOverflow', msg: 'Just solved the Tree inversion in 24ms. Feels DP.', time: '12:10' },
    { sender: 'TrieScribe', msg: 'Welcome back you guys!', time: '12:14' }
  ]);
  const [newGuildMsg, setNewGuildMsg] = useState('');

  // Friends States
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'RootOverflow', status: 'ONLINE', activeChallenge: 'Inverting Binary Tree', avatar: 'R' },
    { id: '2', name: 'PointerPirate', status: 'ONLINE', activeChallenge: 'Swarming Memory Stack', avatar: 'P' },
    { id: '3', name: 'DijkstraDrifter', status: 'IDLE', activeChallenge: 'Calculating Dijkstra lanes', avatar: 'D' },
    { id: '4', name: 'StackSurfer', status: 'ONLINE', activeChallenge: 'Evaluating AST parsing', avatar: 'S' },
    { id: '5', name: 'CompilerCzar', status: 'OFFLINE', activeChallenge: 'Swapping registers', avatar: 'C' }
  ]);

  // Audio Tactile Playbacks
  const playSfx = (type: 'hover' | 'click' | 'countdown' | 'match' | 'attack' | 'victory' | 'defeat' | 'sync') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;

      if (type === 'hover') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.04);
        gain.gain.setValueAtTime(0.01 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.08);
        gain.gain.setValueAtTime(0.03 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'countdown') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.02 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'match') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(600, now + 0.2);
        osc.frequency.linearRampToValueAtTime(900, now + 0.4);
        gain.gain.setValueAtTime(0.05 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'attack') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
        gain.gain.setValueAtTime(0.06 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'victory') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now); // C5
        osc.frequency.setValueAtTime(659, now + 0.15); // E5
        osc.frequency.setValueAtTime(783, now + 0.3); // G5
        osc.frequency.setValueAtTime(1046, now + 0.45); // C6
        gain.gain.setValueAtTime(0.04 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'defeat') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.4);
        gain.gain.setValueAtTime(0.04 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'sync') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.02 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {}
  };

  // Matchmaking Simulation Ticks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pvpStatus === 'MATCHMAKING') {
      interval = setInterval(() => {
        setMatchmakingTimer(prev => {
          playSfx('countdown');
          if (prev >= 4) {
            clearInterval(interval);
            // Found matched opponent!
            const opponents = [
              { name: 'BinaryNinja', avatar: 'N', rating: 1450, progress: 0 },
              { name: 'BigO_Boss', avatar: 'O', rating: 1320, progress: 0 },
              { name: 'O(1)_Overlord', avatar: '1', rating: 1510, progress: 0 },
              { name: 'HashSlayer', avatar: 'H', rating: 1280, progress: 0 }
            ];
            const chosen = opponents[Math.floor(Math.random() * opponents.length)];
            setOpponent(chosen);
            setPvpStatus('CONNECTED');
            playSfx('match');
            setSyncLog(log => [`> PvP Socket link established with contestant ${chosen.name}.`, ...log]);

            // Transition to actual battle after 2 seconds
            setTimeout(() => {
              setPvpStatus('IN_BATTLE');
              setBattleTimer(30);
              setPlayerProgress(0);
            }, 2000);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pvpStatus]);

  // PvP Battle Progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pvpStatus === 'IN_BATTLE') {
      interval = setInterval(() => {
        setBattleTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Time out defeat
            resolveBattle(false);
            return 0;
          }

          // Opponent progress ticks up randomly
          setOpponent(opp => {
            if (!opp) return opp;
            const extra = Math.floor(Math.random() * 8) + 2;
            const nextProgress = Math.min(100, opp.progress + extra);
            if (nextProgress >= 100) {
              clearInterval(interval);
              resolveBattle(false);
            }
            return { ...opp, progress: nextProgress };
          });

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pvpStatus]);

  const startMatchmaking = () => {
    playSfx('click');
    setPvpStatus('MATCHMAKING');
    setMatchmakingTimer(0);
  };

  const cancelMatchmaking = () => {
    playSfx('click');
    setPvpStatus('IDLE');
  };

  const handlePvPCodeSubmission = () => {
    if (submittingCode || pvpStatus !== 'IN_BATTLE') return;
    setSubmittingCode(true);
    playSfx('click');
    setSyncLog(log => ['> Submitting solution. Running compiler unit tests...', ...log]);

    setTimeout(() => {
      setSubmittingCode(false);
      setPlayerProgress(100);
      resolveBattle(true);
    }, 1800);
  };

  const resolveBattle = (playerWon: boolean) => {
    setPvpStatus('FINISHED');
    if (playerWon) {
      setBattleResult('VICTORY');
      playSfx('victory');
      setSyncLog(log => [
        `> COMPILER STAGE CLEAR. Captured +25 Ranked Rating points!`,
        ...log
      ]);
    } else {
      setBattleResult('DEFEAT');
      playSfx('defeat');
      setSyncLog(log => [
        `> COMPILER STAGE FAILED. Competitor completed test suite before you. (-10 rating)`,
        ...log
      ]);
    }
  };

  // Co-op Boss Raid Action handler
  const handleRaidAction = (action: 'code' | 'shield' | 'boost') => {
    if (raidFinished) return;
    playSfx('attack');

    const teammateLogs = [
      'RootOverflow injected DFS recursive traversal (-1450hp)',
      'PointerPirate secured cache block register (+20% shield)',
      'TrieScribe applied prefix tree compaction (-980hp)'
    ];

    if (action === 'code') {
      const dmg = Math.floor(Math.random() * 8000) + 4000;
      setBossHp(hp => {
        const next = Math.max(0, hp - dmg);
        if (next <= 0) {
          setRaidFinished(true);
          playSfx('victory');
          setRaidLogs(prev => ['🏆 CRITICAL HIT DETECTED. "O(N^3) Behemoth" DEFEATED! Epic core loot granted.', ...prev]);
        }
        return next;
      });
      setRaidLogs(prev => [
        `> YOU applied optimal constant-time indexing for -${dmg}hp!`,
        `> Teammate: ${teammateLogs[Math.floor(Math.random() * teammateLogs.length)]}`,
        ...prev.slice(0, 4)
      ]);
    } else if (action === 'shield') {
      setPlayersShield(sh => Math.min(100, sh + 25));
      setRaidLogs(prev => [
        `> YOU generated optimal space complexity buffer block. Shield is UP!`,
        ...prev.slice(0, 4)
      ]);
    } else if (action === 'boost') {
      const buffDmg = Math.floor(Math.random() * 12000) + 8000;
      setBossHp(hp => {
        const next = Math.max(0, hp - buffDmg);
        if (next <= 0) {
          setRaidFinished(true);
          playSfx('victory');
        }
        return next;
      });
      setPlayersShield(sh => Math.max(0, sh - 15));
      setRaidLogs(prev => [
        `> YOU activated "Oris Boost Overdrive" for -${buffDmg}hp (Sacrificed 15% shield)`,
        ...prev.slice(0, 4)
      ]);
    }

    // Boss counters occasionally
    if (Math.random() > 0.4 && !raidFinished) {
      setTimeout(() => {
        const bossDmg = Math.floor(Math.random() * 15) + 10;
        setPlayersShield(sh => {
          const next = Math.max(0, sh - bossDmg);
          if (next <= 0) {
            setRaidFinished(true);
            playSfx('defeat');
            setRaidLogs(prev => ['☠️ SHIELD EXPLODED. Raid party wiped by garbage collector sweep.', ...prev]);
          }
          return next;
        });
        setRaidLogs(prev => [
          `⚠️ Boss unleashed "Garbage Collector Mark-and-Sweep"! Team shield reduced by ${bossDmg}%.`,
          ...prev.slice(0, 4)
        ]);
      }, 600);
    }
  };

  const resetRaid = () => {
    playSfx('click');
    setBossHp(72000);
    setPlayersShield(100);
    setRaidFinished(false);
    setRaidLogs([
      '> Raid reset. Fighting a fresh instance of "The O(N^3) Garbage Collector".',
      '> Ready all registers.'
    ]);
  };

  // Guild Chat Submission
  const handleSendGuildChat = () => {
    if (!newGuildMsg.trim()) return;
    playSfx('click');
    setGuildChat(prev => [
      ...prev,
      { sender: profile.username || 'You (Guardian)', msg: newGuildMsg, time: '12:20' }
    ]);
    setNewGuildMsg('');
  };

  // Cloud Database Handshake Synchronizer
  const forceCloudSync = () => {
    if (!cloudSynced) return;
    setCloudSynced(false);
    playSfx('sync');
    setSyncLog(log => ['> Initiating cloud sync with cloud database cluster...', ...log]);

    setTimeout(() => {
      setCloudSynced(true);
      setSyncLog(log => [
        `> Cloud synchronized securely. Auto-saved ${profile.points} XP, active guardian: ${profile.selectedGuardianId}.`,
        ...log
      ]);
    }, 1500);
  };

  return (
    <div className="relative lg:absolute inset-0 bg-slate-900/95 border border-purple-500/30 rounded-2xl p-3 sm:p-5 backdrop-blur-xl animate-fade-in flex flex-col justify-between overflow-y-auto custom-scrollbar min-h-[320px] h-full w-full">
      
      {/* 1. ARENA TOP HEADER & SYNC BUTTON */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-purple-400 shrink-0" />
          <div>
            <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider block">
              DSA Cyber Arena Hub
            </span>
            <span className="text-[9px] font-mono text-purple-400/80 uppercase">
              Ranked PvP Matchmaking • Cooperative Bug Raids • Guilds
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={forceCloudSync}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-purple-900/50 hover:border-purple-500 rounded-lg text-[9px] font-mono text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
          >
            <Database className={`w-3 h-3 ${!cloudSynced ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{!cloudSynced ? 'SYNCING...' : 'FORCE SAVE'}</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. TABS RAIL */}
      <div className="flex gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-lg my-2.5 shrink-0 overflow-x-auto custom-scrollbar">
        {[
          { id: 'pvp', label: 'Ranked PvP', icon: Swords },
          { id: 'raids', label: 'Co-op Bug Raids', icon: Shield },
          { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
          { id: 'guilds', label: 'Clan Deck', icon: Users },
          { id: 'friends', label: 'Friends', icon: Heart }
        ].map(tab => {
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { playSfx('click'); setActiveTab(tab.id as TabType); }}
              className={`px-3 py-1.5 rounded-md font-mono text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SCROLLABLE TAB CHASSIS */}
      <div className="flex-1 overflow-hidden my-1">
        
        {/* --- TAB A: RANKED PVP BATTLES --- */}
        {activeTab === 'pvp' && (
          <div className="h-full flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait">
              {/* IDLE STATE */}
              {pvpStatus === 'IDLE' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-3"
                >
                  <Swords className="w-8 h-8 text-purple-500 animate-pulse mb-2" />
                  <h4 className="text-xs font-mono font-bold text-slate-200">READY TO MATCHMAKE?</h4>
                  <p className="text-[9px] font-mono text-slate-500 mt-1 max-w-[280px]">
                    Enter the ranked queue to race 1v1 against global compiler agents. Solve optimized DSA stages before your opponent!
                  </p>
                  <button
                    onClick={startMatchmaking}
                    className="mt-3 px-4 py-2 bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-slate-100 text-[10px] font-mono font-bold border border-purple-500 rounded-lg cursor-pointer shadow-[0_3px_10px_rgba(168,85,247,0.3)] transition-all"
                  >
                    FIND COMPETITIVE BATTLE
                  </button>
                </motion.div>
              )}

              {/* MATCHMAKING STATE */}
              {pvpStatus === 'MATCHMAKING' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-3"
                >
                  <div className="w-10 h-10 border border-dashed border-purple-400 rounded-full animate-spin flex items-center justify-center mb-3">
                    <Swords className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-xs font-mono font-bold text-purple-400 animate-pulse uppercase">Searching matchmaking grids...</h4>
                  <p className="text-[10px] font-mono text-slate-500 mt-1">
                    Queue Timer: <span className="text-purple-300 font-extrabold">{matchmakingTimer}s</span>
                  </p>
                  <button
                    onClick={cancelMatchmaking}
                    className="mt-4 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-red-500/40 text-[9px] font-mono text-red-400 rounded-md cursor-pointer transition-all"
                  >
                    CANCEL SEARCH
                  </button>
                </motion.div>
              )}

              {/* CONNECTED STATE */}
              {pvpStatus === 'CONNECTED' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-3"
                >
                  <div className="flex items-center gap-6 mb-3">
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/40 border border-purple-500/50 flex items-center justify-center font-mono text-xs font-bold text-purple-300">
                        {profile.username?.substring(0, 2).toUpperCase() || 'GU'}
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 block mt-1">YOU</span>
                    </div>
                    <span className="text-xs font-mono font-extrabold text-purple-500 animate-pulse">VS</span>
                    <div className="text-center">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/40 border border-indigo-500/50 flex items-center justify-center font-mono text-xs font-bold text-indigo-300">
                        {opponent?.avatar}
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 block mt-1">{opponent?.name}</span>
                    </div>
                  </div>
                  <h4 className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest animate-pulse">CONNECTION DETECTED • INJECTING CODE Arena</h4>
                </motion.div>
              )}

              {/* IN BATTLE STATE */}
              {pvpStatus === 'IN_BATTLE' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col justify-between overflow-hidden"
                >
                  {/* Current stage challenge info */}
                  <div className="bg-slate-950 border border-slate-900 rounded-lg p-2 flex items-start gap-2 text-left">
                    <Info className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-purple-400 block font-bold leading-tight">ACTIVE PVP PROBLEM</span>
                      <span className="text-[10px] font-mono text-slate-200 font-extrabold">Validate Bracket Sequences [Medium]</span>
                      <p className="text-[8px] font-mono text-slate-500 mt-0.5 leading-normal">
                        Using a stack data structure, return true if the brackets evaluate correctly in constant O(N) constraints.
                      </p>
                    </div>
                  </div>

                  {/* Race progress bars */}
                  <div className="space-y-2.5 my-3">
                    {/* Player progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-purple-300 font-bold">YOUR COMPILER TESTS</span>
                        <span className="text-purple-400 font-extrabold">{playerProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 border border-slate-850 h-3 rounded-lg overflow-hidden p-0.5">
                        <div className="h-full bg-purple-500 rounded-md transition-all duration-300" style={{ width: `${playerProgress}%` }} />
                      </div>
                    </div>

                    {/* Opponent progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono">
                        <span className="text-slate-400 font-bold">{opponent?.name} (OPPONENT)</span>
                        <span className="text-slate-400 font-extrabold">{opponent?.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-950 border border-slate-850 h-3 rounded-lg overflow-hidden p-0.5">
                        <div className="h-full bg-indigo-500 rounded-md transition-all duration-300" style={{ width: `${opponent?.progress}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Battle Footer */}
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2 shrink-0">
                    <span className="text-[10px] font-mono text-amber-400">
                      ⏱️ Battle ends in: <strong className="font-extrabold text-amber-300">{battleTimer}s</strong>
                    </span>

                    <button
                      onClick={handlePvPCodeSubmission}
                      disabled={submittingCode}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-800 to-teal-800 hover:from-emerald-700 hover:to-teal-700 text-slate-100 text-[10px] font-mono font-bold border border-emerald-500 rounded-md cursor-pointer transition-all uppercase flex items-center gap-1"
                    >
                      {submittingCode ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>COMPILING...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3 h-3 fill-slate-100" />
                          <span>SUBMIT SOLUTION</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* FINISHED STATE */}
              {pvpStatus === 'FINISHED' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center p-3"
                >
                  {battleResult === 'VICTORY' ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce mb-1.5" />
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">VICTORY OVERRIDE UNLOCKED</h4>
                      <p className="text-[9px] font-mono text-slate-400 mt-1">
                        Contestant rating adjusted: <span className="text-emerald-400 font-bold">+25 rating</span> (New XP milestones synchronised)
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-10 h-10 text-red-500 mb-1.5" />
                      <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">TEST SUITE DEADLOCK</h4>
                      <p className="text-[9px] font-mono text-slate-400 mt-1">
                        Opponent compiler successfully completed tests. Rating adjusted: <span className="text-red-400 font-bold">-10 rating</span>.
                      </p>
                    </>
                  )}
                  <button
                    onClick={() => setPvpStatus('IDLE')}
                    className="mt-3 px-3.5 py-1.5 bg-slate-950 border border-slate-800 hover:border-purple-500 text-[9px] font-mono text-slate-300 rounded-md cursor-pointer transition-all"
                  >
                    RETURN TO OUTPOST
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* --- TAB B: CO-OP BOSS RAIDS --- */}
        {activeTab === 'raids' && (
          <div className="h-full flex flex-col justify-between overflow-hidden">
            {/* Boss Info Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 shrink-0">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-300 uppercase block">
                  BOSS RAID ACTIVE
                </span>
                <span className="text-[9px] font-mono text-red-400/80 font-bold">
                  THE O(N^3) GARBAGE COLLECTOR
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Lobby Size: <strong className="text-purple-400 font-extrabold">3 / 4</strong>
              </span>
            </div>

            {/* HP Status bars */}
            <div className="space-y-2.5 my-2 flex-1 overflow-y-auto custom-scrollbar">
              {/* Boss HP */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-red-400 font-bold">⚠️ BOSS COMPLEXITY: {bossHp} / {maxBossHp}</span>
                  <span className="text-red-400 font-bold">{Math.round((bossHp / maxBossHp) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-lg overflow-hidden border border-slate-850 p-0.5">
                  <div className="h-full bg-red-500 rounded-md transition-all duration-300" style={{ width: `${(bossHp / maxBossHp) * 100}%` }} />
                </div>
              </div>

              {/* Team Shields */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-cyan-400 font-bold">🛡️ TEAM SHIELD BUFFER: {playersShield}%</span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-lg overflow-hidden border border-slate-850 p-0.5">
                  <div className="h-full bg-cyan-500 rounded-md transition-all duration-300" style={{ width: `${playersShield}%` }} />
                </div>
              </div>

              {/* Raid Activity Logs */}
              <div className="bg-slate-950 border border-slate-900 rounded-lg p-2.5 font-mono text-[8px] text-slate-500 space-y-0.5">
                {raidLogs.map((rl, idx) => (
                  <div key={idx} className={rl.includes('YOU') ? 'text-cyan-400' : rl.includes('CRITICAL') ? 'text-emerald-400 font-bold' : ''}>
                    {rl}
                  </div>
                ))}
              </div>
            </div>

            {/* Raid Action Buttons */}
            <div className="flex gap-2 shrink-0 border-t border-slate-900 pt-2.5">
              {raidFinished ? (
                <button
                  onClick={resetRaid}
                  className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-purple-500 text-[10px] text-purple-300 font-mono font-bold rounded-lg cursor-pointer transition-all uppercase"
                >
                  LAUNCH FRESH RAID INSTANCE
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleRaidAction('code')}
                    className="flex-1 py-2 bg-purple-950/60 hover:bg-purple-900 border border-purple-800/40 text-[9px] font-mono font-extrabold text-purple-300 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    🚀 SOLVE SUBPROBLEMS
                  </button>
                  <button
                    onClick={() => handleRaidAction('shield')}
                    className="flex-1 py-2 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800/40 text-[9px] font-mono font-extrabold text-cyan-300 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    🛡️ GENERATE SHIELD
                  </button>
                  <button
                    onClick={() => handleRaidAction('boost')}
                    className="flex-1 py-2 bg-amber-950/60 hover:bg-amber-900 border border-amber-800/40 text-[9px] font-mono font-extrabold text-amber-300 rounded-lg cursor-pointer transition-all uppercase"
                  >
                    ⚡ OVERDRIVE BOOST
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* --- TAB C: LEADERBOARD --- */}
        {activeTab === 'leaderboard' && (
          <div className="h-full relative overflow-hidden">
            <LeaderboardView profile={profile} sfxVolume={sfxVolume} />
          </div>
        )}

        {/* --- TAB D: GUILDS (CLAN HALL) --- */}
        {activeTab === 'guilds' && (
          <div className="h-full flex flex-col justify-between overflow-hidden">
            {activeGuild ? (
              <div className="h-full flex flex-col justify-between overflow-hidden">
                {/* Clan Stats Header */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono bg-purple-950 border border-purple-800 text-purple-300 px-1.5 py-0.2 rounded font-extrabold">
                      [{activeGuild.tag}]
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-100 uppercase">
                      {activeGuild.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500">
                    Lvl {activeGuild.level} • Global Rank #{activeGuild.globalRank}
                  </span>
                </div>

                <div className="flex-1 grid grid-cols-12 gap-3 my-2 overflow-hidden">
                  {/* Clan Info (Left) */}
                  <div className="col-span-4 bg-slate-950/40 border border-slate-900 rounded-lg p-2 flex flex-col justify-between font-mono">
                    <div>
                      <span className="text-[8px] text-slate-600 block">DESCRIPTION</span>
                      <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">
                        {activeGuild.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-900">
                      <div className="flex justify-between text-[8px] text-slate-500 mb-0.5">
                        <span>XP progress</span>
                        <span>{activeGuild.xp}/{activeGuild.maxXp}</span>
                      </div>
                      <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(activeGuild.xp / activeGuild.maxXp) * 100}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Clan Hall Chat (Right) */}
                  <div className="col-span-8 bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden">
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1.5">
                      {guildChat.map((chat, idx) => (
                        <div key={idx} className="text-[9px] font-mono leading-normal">
                          <span className="text-purple-400 font-bold mr-1.5">[{chat.sender}]:</span>
                          <span className="text-slate-300">{chat.msg}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-1.5 pt-1.5 border-t border-slate-900 shrink-0">
                      <input
                        type="text"
                        placeholder="Transmit message to clan hall..."
                        value={newGuildMsg}
                        onChange={(e) => setNewGuildMsg(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendGuildChat()}
                        className="flex-1 bg-slate-950 border border-slate-850 rounded px-2 py-1 text-[9px] text-slate-200 outline-none font-mono"
                      />
                      <button
                        onClick={handleSendGuildChat}
                        className="px-2 bg-purple-950 hover:bg-purple-900 text-purple-400 border border-purple-800/60 rounded text-[9px] font-mono font-bold cursor-pointer transition-all"
                      >
                        SEND
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Users className="w-8 h-8 text-slate-600 mb-1.5" />
                <h4 className="text-xs font-mono text-slate-400 uppercase">Not associated with a Compiler Clan</h4>
                <button
                  onClick={() => playSfx('click')}
                  className="mt-2.5 px-3 py-1.5 bg-purple-950 border border-purple-800 text-[9px] font-mono text-purple-300 rounded cursor-pointer hover:bg-purple-900"
                >
                  BROWSE GUILDS
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- TAB E: FRIENDS DECK --- */}
        {activeTab === 'friends' && (
          <div className="h-full flex flex-col justify-between overflow-hidden font-mono">
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
              {friends.map(friend => (
                <div
                  key={friend.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-900 hover:border-slate-850 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
                      {friend.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-200">{friend.name}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          friend.status === 'ONLINE' ? 'bg-emerald-400' : friend.status === 'IDLE' ? 'bg-amber-400' : 'bg-slate-600'
                        }`} />
                      </div>
                      <span className="text-[8px] text-slate-500 block leading-tight">
                        {friend.activeChallenge}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {friend.status !== 'OFFLINE' && (
                      <button
                        onClick={() => {
                          playSfx('click');
                          setSyncLog(log => [`> PvP Invite transmitted to friend ${friend.name}.`, ...log]);
                        }}
                        className="px-2 py-1 bg-purple-950/40 border border-purple-900/60 text-[8px] text-purple-300 hover:bg-purple-900 rounded cursor-pointer transition-all font-bold"
                      >
                        PVP CHALLENGE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 4. REAL-TIME EVENT STREAM TICKER */}
      <div className="mt-2.5 bg-slate-950 border border-slate-900 rounded-xl p-2.5 font-mono text-[9px] shrink-0 text-slate-400 leading-relaxed">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1 border-b border-slate-900 pb-1">
          <Activity className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
          <span>CYBERNETIC CO-OP BROADCAST CONSOLE</span>
        </div>
        <div className="space-y-0.5">
          {syncLog.map((logLine, idx) => (
            <div key={idx} className={idx === 0 ? 'text-purple-300 font-medium' : 'text-slate-500'}>
              {logLine}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
