import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Search, RefreshCw, Sparkles, TrendingUp, Cpu, Flame, 
  Shield, Database, Award, ArrowUp, ArrowDown, Activity, Zap, X
} from 'lucide-react';
import { ProfileState, Guardian } from '../types';
import { GUARDIANS } from './CharacterSelectionView';

interface LeaderboardViewProps {
  profile: ProfileState;
  sfxVolume: number;
  onClose?: () => void;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  xpRank: number;
  guardianId: string;
  guardianName: string;
  guardianAvatar: string;
  guardianColor: string;
  status: 'ONLINE' | 'OFFLINE' | 'IDLE';
  lastActivity: string;
}

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    username: 'RootOverflow',
    points: 1420,
    xpRank: 92,
    guardianId: 'hashed_haze',
    guardianName: 'HashedHaze',
    guardianAvatar: 'H',
    guardianColor: 'amber',
    status: 'ONLINE',
    lastActivity: 'DP Dimension Cleared'
  },
  {
    rank: 2,
    username: 'PointerPirate',
    points: 1250,
    xpRank: 85,
    guardianId: 'binary_blade',
    guardianName: 'BinaryBlade',
    guardianAvatar: 'B',
    guardianColor: 'cyan',
    status: 'ONLINE',
    lastActivity: 'Swarms Purged in Stack Mountain'
  },
  {
    rank: 3,
    username: 'DijkstraDrifter',
    points: 1180,
    xpRank: 79,
    guardianId: 'graph_goliath',
    guardianName: 'GraphGoliath',
    guardianAvatar: 'G',
    guardianColor: 'emerald',
    status: 'IDLE',
    lastActivity: 'Calibrating Dijkstra warp lanes'
  },
  {
    rank: 4,
    username: 'StackSurfer',
    points: 980,
    xpRank: 64,
    guardianId: 'stack_sentinel',
    guardianName: 'StackSentinel',
    guardianAvatar: 'P',
    guardianColor: 'purple',
    status: 'ONLINE',
    lastActivity: 'Evaluating expression trees'
  },
  {
    rank: 5,
    username: 'CompilerCzar',
    points: 850,
    xpRank: 58,
    guardianId: 'sort_spectre',
    guardianName: 'SortSpectre',
    guardianAvatar: 'S',
    guardianColor: 'purple',
    status: 'OFFLINE',
    lastActivity: 'Swapping adjacent registers'
  },
  {
    rank: 6,
    username: 'TrieScribe',
    points: 740,
    xpRank: 49,
    guardianId: 'hashed_haze',
    guardianName: 'HashedHaze',
    guardianAvatar: 'H',
    guardianColor: 'amber',
    status: 'ONLINE',
    lastActivity: 'Secured Trie library prefix paths'
  },
  {
    rank: 7,
    username: 'CycleBreaker',
    points: 620,
    xpRank: 42,
    guardianId: 'graph_goliath',
    guardianName: 'GraphGoliath',
    guardianAvatar: 'G',
    guardianColor: 'emerald',
    status: 'IDLE',
    lastActivity: 'Loop relaxation complete'
  },
  {
    rank: 8,
    username: 'HeapHustler',
    points: 540,
    xpRank: 35,
    guardianId: 'binary_blade',
    guardianName: 'BinaryBlade',
    guardianAvatar: 'B',
    guardianColor: 'cyan',
    status: 'ONLINE',
    lastActivity: 'Heapify algorithm run'
  }
];

export default function LeaderboardView({ profile, sfxVolume, onClose }: LeaderboardViewProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'xpRank'>('points');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Sync Status: OK');
  const [liveLog, setLiveLog] = useState<string[]>(['> Cyberdeck Leaderboard Interface Initialized.']);

  // Synthesizer Audio Generator
  const playSfx = (type: 'hover' | 'click' | 'sync' | 'alert') => {
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
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.exponentialRampToValueAtTime(1300, now + 0.05);
        gain.gain.setValueAtTime(0.01 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.05 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'sync') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(450, now + 0.1);
        osc.frequency.setValueAtTime(600, now + 0.2);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);
        gain.gain.setValueAtTime(0.04 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'alert') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.25);
        gain.gain.setValueAtTime(0.03 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio block safeties
    }
  };

  // Find player's active guardian details
  const playerGuardian = GUARDIANS.find(g => g.id === profile.selectedGuardianId) || GUARDIANS[0];

  // Dynamic incorporation of Player's Profile State into leaderboard list
  useEffect(() => {
    // Check if player is logged in or active as guest
    const playerEntry: LeaderboardEntry = {
      rank: 0, // calculated later
      username: profile.username || 'You (Guardian)',
      points: profile.points || 0,
      xpRank: Math.max(1, Math.floor((profile.points || 0) / 10) + 1), // derivative XP rank formula
      guardianId: playerGuardian.id,
      guardianName: playerGuardian.name,
      guardianAvatar: playerGuardian.avatarUrl,
      guardianColor: playerGuardian.themeColor,
      status: 'ONLINE',
      lastActivity: 'Calibrating local memory matrices'
    };

    // Merge player with existing list (avoiding duplicate usernames)
    const filteredBase = INITIAL_LEADERBOARD.filter(e => e.username !== playerEntry.username);
    const combined = [...filteredBase, playerEntry];

    // Sort by whichever criteria is active
    const sorted = combined.sort((a, b) => {
      if (sortBy === 'points') {
        return b.points - a.points;
      } else {
        return b.xpRank - a.xpRank;
      }
    });

    // Re-assign ranks
    const finalRanked = sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    setLeaderboard(finalRanked);
  }, [profile.username, profile.points, profile.selectedGuardianId, sortBy]);

  // Real-time leaderboard activity simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Pick a random other competitor to gain some points/XP
      setLeaderboard(prev => {
        const copy = [...prev];
        const randomIndex = Math.floor(Math.random() * copy.length);
        const competitor = copy[randomIndex];

        // Ensure we don't accidentally update the player's own profile state directly
        if (competitor && competitor.username !== (profile.username || 'You (Guardian)')) {
          const pointBump = Math.floor(Math.random() * 25) + 5;
          const xpBump = Math.floor(Math.random() * 3) + 1;
          const updatedCompetitor = {
            ...competitor,
            points: competitor.points + pointBump,
            xpRank: competitor.xpRank + xpBump
          };

          copy[randomIndex] = updatedCompetitor;

          // Push to live logs
          const activities = [
            `completed Array Kingdom challenge!`,
            `levelled up their ${competitor.guardianName} core!`,
            `defused a compiler deadlock error.`,
            `unlocked an Epic Guardian Skin.`,
            `optimized their constant-time database lookup.`
          ];
          const randomActivity = activities[Math.floor(Math.random() * activities.length)];
          setLiveLog(log => [
            `> ${competitor.username} ${randomActivity} (+${pointBump}pts)`,
            ...log.slice(0, 4)
          ]);

          playSfx('alert');
        }

        // Re-sort and re-rank
        return copy.sort((a, b) => {
          if (sortBy === 'points') {
            return b.points - a.points;
          } else {
            return b.xpRank - a.xpRank;
          }
        }).map((entry, index) => ({
          ...entry,
          rank: index + 1
        }));
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [profile.username, sortBy]);

  // Manual Firestore Trigger Sync Animation
  const handleSync = () => {
    if (isSyncing) return;
    setIsSyncing(true);
    playSfx('sync');
    setLiveLog(log => ['> Initiating cloud handshake with Firestore clusters...', ...log]);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('Sync Status: SECURE');
      setLiveLog(log => [
        `> Handshake successful. Fetched latest top player documents from collection "/users".`,
        ...log
      ]);

      // Slightly update random competitor scores to simulate fresh DB fetch
      setLeaderboard(prev => {
        return prev.map(item => {
          if (item.username !== (profile.username || 'You (Guardian)')) {
            const addedPoints = Math.floor(Math.random() * 15) + 10;
            return {
              ...item,
              points: item.points + addedPoints,
              xpRank: item.xpRank + Math.floor(addedPoints / 10)
            };
          }
          return item;
        }).sort((a, b) => {
          if (sortBy === 'points') return b.points - a.points;
          return b.xpRank - a.xpRank;
        }).map((item, idx) => ({ ...item, rank: idx + 1 }));
      });
    }, 1800);
  };

  // Filter based on search input
  const filteredLeaderboard = leaderboard.filter(entry => 
    entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.guardianName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative lg:absolute inset-0 bg-slate-900/95 border border-purple-500/30 rounded-2xl p-3 sm:p-5 backdrop-blur-xl animate-fade-in flex flex-col justify-between overflow-y-auto custom-scrollbar min-h-[320px] h-full w-full">
      
      {/* 1. Header with dynamic Sync Status */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Global Algorithm Leaderboard
          </span>
          <span className="hidden sm:flex text-[9px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/50 px-1.5 py-0.5 rounded-md items-center gap-1">
            <Activity className="w-2.5 h-2.5 animate-pulse text-purple-400" />
            <span>REAL-TIME</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            onMouseEnter={() => playSfx('hover')}
            className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-lg text-[10px] font-mono text-purple-400 hover:text-purple-300 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'FETCHING...' : 'SYNC CLOUD'}</span>
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

      {/* 2. Controls and Sorting options */}
      <div className="flex gap-3 my-2.5 shrink-0">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search username or guardian class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500/50 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 outline-none font-mono placeholder:text-slate-600"
          />
        </div>

        {/* Sort triggers */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={() => { playSfx('click'); setSortBy('points'); }}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all ${
              sortBy === 'points'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sort by Rating
          </button>
          <button
            onClick={() => { playSfx('click'); setSortBy('xpRank'); }}
            className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all ${
              sortBy === 'xpRank'
                ? 'bg-purple-950/60 text-purple-300 border border-purple-800/50'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Sort by Level
          </button>
        </div>
      </div>

      {/* 3. Main Scrollable List of Competitors */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-1.5 max-h-[160px]">
        {filteredLeaderboard.length > 0 ? (
          filteredLeaderboard.map((entry) => {
            const isSelf = entry.username === (profile.username || 'You (Guardian)');
            
            // Map string color to tailwind classes
            let badgeBg = 'bg-slate-950 text-slate-300 border-slate-800';
            if (entry.guardianColor === 'purple') badgeBg = 'bg-purple-950/40 text-purple-300 border-purple-800/30';
            if (entry.guardianColor === 'cyan') badgeBg = 'bg-cyan-950/40 text-cyan-300 border-cyan-800/30';
            if (entry.guardianColor === 'emerald') badgeBg = 'bg-emerald-950/40 text-emerald-300 border-emerald-800/30';
            if (entry.guardianColor === 'amber') badgeBg = 'bg-amber-950/40 text-amber-300 border-amber-800/30';

            return (
              <div
                key={entry.username}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  isSelf
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_2px_10px_rgba(168,85,247,0.1)]'
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-950/70 hover:border-slate-800'
                }`}
              >
                {/* Left Area: Rank & Username */}
                <div className="flex items-center gap-2.5">
                  <div className="w-5 text-center font-mono text-[11px] font-bold">
                    {entry.rank === 1 ? (
                      <span className="text-amber-400">🏆</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-300">🥈</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-600">🥉</span>
                    ) : (
                      <span className="text-slate-500">#{entry.rank}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-extrabold border ${badgeBg}`}>
                      {entry.guardianAvatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold font-mono ${isSelf ? 'text-purple-300' : 'text-slate-200'}`}>
                          {entry.username}
                        </span>
                        {isSelf && (
                          <span className="text-[7px] font-mono tracking-wider bg-purple-500 text-white font-bold px-1 py-0.2 rounded">
                            YOU
                          </span>
                        )}
                        <span className={`w-1 h-1 rounded-full ${
                          entry.status === 'ONLINE' ? 'bg-emerald-400' : entry.status === 'IDLE' ? 'bg-amber-400' : 'bg-slate-600'
                        }`} />
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 block leading-tight">
                        {entry.lastActivity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Guardian Class & XP Rank / Points */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-slate-500 block leading-tight">GUARDIAN</span>
                    <span className="text-[10px] font-mono font-semibold text-slate-300">
                      {entry.guardianName}
                    </span>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span className="text-[11px] font-mono font-bold text-cyan-400">
                        {entry.points} pts
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-slate-500 block leading-tight">
                      Lvl {entry.xpRank} Core
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 font-mono text-xs text-slate-600">
            &gt; No active compiler agents matching search terms.
          </div>
        )}
      </div>

      {/* 4. Live Broadcast Console Ticker */}
      <div className="mt-2.5 bg-slate-950 border border-slate-900 rounded-xl p-2.5 font-mono text-[9px] shrink-0 text-slate-400 leading-relaxed">
        <div className="flex items-center gap-1.5 text-purple-400 font-bold mb-1 border-b border-slate-900 pb-1">
          <Database className="w-3 h-3 text-purple-500" />
          <span>REAL-TIME FIREBASE EVENT STREAM</span>
        </div>
        <div className="space-y-0.5">
          {liveLog.map((logLine, idx) => (
            <div key={idx} className={idx === 0 ? 'text-purple-300 font-medium' : 'text-slate-500'}>
              {logLine}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
