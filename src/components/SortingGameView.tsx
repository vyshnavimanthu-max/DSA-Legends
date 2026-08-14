import React, { useState, useEffect } from 'react';
import { 
  Play, RotateCcw, Award, CheckCircle, Flame, ArrowRight, 
  Zap, Info, Shield, Cpu, Brain, Key, RefreshCw
} from 'lucide-react';
import { ProfileState, Guardian } from '../types';
import { GUARDIANS } from './CharacterSelectionView';
import PremiumAudioManager from '../lib/audioManager';

interface SortingGameViewProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onBackToMenu: () => void;
}

export default function SortingGameView({ profile, onUpdateProfile, onBackToMenu }: SortingGameViewProps) {
  const [array, setArray] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [isSorted, setIsSorted] = useState(false);
  const [isSortingAuto, setIsSortingAuto] = useState(false);
  const [message, setMessage] = useState('Dungeon initialized. Align elements to compile code.');
  const [abilityCooldown, setAbilityCooldown] = useState(false);
  const [suggestedSwap, setSuggestedSwap] = useState<[number, number] | null>(null);

  // Retrieve selected guardian (fallback to first guardian)
  const activeGuardian = GUARDIANS.find(g => g.id === profile.selectedGuardianId) || GUARDIANS[0];

  const initArray = () => {
    const newArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 80) + 20);
    setArray(newArray);
    setSelectedIdx(null);
    setComparisons(0);
    setSwaps(0);
    setIsSorted(false);
    setIsSortingAuto(false);
    setSuggestedSwap(null);
    setMessage(`Unsorted stack detected. Use ${activeGuardian.name}'s architecture to solve!`);
  };

  useEffect(() => {
    initArray();
  }, [profile.selectedGuardianId]);

  // Check if array is sorted
  const checkSorted = (arr: number[]) => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  };

  const handleBarClick = (idx: number) => {
    if (isSortingAuto || isSorted) return;

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      PremiumAudioManager.getInstance().playSFX('click');
      setMessage(`Locked element at index ${idx} (value: ${array[idx]}). Choose swap target.`);
    } else {
      // Swapping elements
      PremiumAudioManager.getInstance().playSFX('swap');
      const newArr = [...array];
      const temp = newArr[selectedIdx];
      newArr[selectedIdx] = newArr[idx];
      newArr[idx] = temp;

      setArray(newArr);
      setSwaps((prev) => prev + 1);
      setComparisons((prev) => prev + 1);
      setSelectedIdx(null);
      setSuggestedSwap(null);

      if (checkSorted(newArr)) {
        setIsSorted(true);
        PremiumAudioManager.getInstance().playSFX('win');
        setMessage('O(N) Optimal alignment completed! Arena cleared successfully.');
        onUpdateProfile({
          points: profile.points + 150,
          rank: getNextRank(profile.points + 150),
        });
      } else {
        setMessage(`Swapped elements at index ${selectedIdx} and ${idx}. Stack remains unsorted.`);
      }
    }
  };

  const getNextRank = (points: number) => {
    if (points >= 1500) return 'O(1) Master Wizard';
    if (points >= 1000) return 'O(log N) Binary Adept';
    if (points >= 600) return 'O(N) Linear Agent';
    return 'Bubble Sort Novice';
  };

  // Animated Auto bubble sort
  const runAutoSort = async () => {
    if (isSortingAuto || isSorted) return;
    setIsSortingAuto(true);
    setSuggestedSwap(null);
    let tempArray = [...array];
    let n = tempArray.length;
    let localSwaps = swaps;
    let localComparisons = comparisons;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setSelectedIdx(j);
        localComparisons++;
        setComparisons(localComparisons);
        setMessage(`Scanning index ${j} and ${j + 1}...`);
        PremiumAudioManager.getInstance().playSFX('hover');
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (tempArray[j] > tempArray[j + 1]) {
          let temp = tempArray[j];
          tempArray[j] = tempArray[j + 1];
          tempArray[j + 1] = temp;
          tempArray = [...tempArray];
          setArray(tempArray);
          localSwaps++;
          setSwaps(localSwaps);
          PremiumAudioManager.getInstance().playSFX('swap');
          setMessage(`Condition met! Swapping ${tempArray[j + 1]} & ${tempArray[j]}`);
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }

    setSelectedIdx(null);
    setIsSorted(true);
    setIsSortingAuto(false);
    PremiumAudioManager.getInstance().playSFX('win');
    setMessage('Auto Sorting process completed all compilation loops.');
    onUpdateProfile({
      points: profile.points + 80,
      rank: getNextRank(profile.points + 80),
    });
  };

  // Guardian Signature Skill Trigger
  const triggerGuardianAbility = () => {
    if (abilityCooldown || isSorted || isSortingAuto) return;

    setAbilityCooldown(true);
    PremiumAudioManager.getInstance().playSFX('ability');
    setTimeout(() => setAbilityCooldown(false), 8000); // 8 second CD

    const guardianId = activeGuardian.id;

    if (guardianId === 'sort_spectre') {
      // SortSpectre adjacent swap trigger
      let swapped = false;
      const newArr = [...array];
      for (let i = 0; i < newArr.length - 1; i++) {
        if (newArr[i] > newArr[i + 1]) {
          const temp = newArr[i];
          newArr[i] = newArr[i + 1];
          newArr[i + 1] = temp;
          setArray(newArr);
          setSwaps(prev => prev + 1);
          swapped = true;
          setMessage(`[SortSpectre Ability] Adjacent Swap Pulsar triggered! Swapped adjacent indices ${i} and ${i + 1}.`);
          break;
        }
      }
      if (!swapped) {
        setMessage('[SortSpectre Ability] Stack is already in sorted form!');
      } else if (checkSorted(newArr)) {
        setIsSorted(true);
        onUpdateProfile({
          points: profile.points + 150,
          rank: getNextRank(profile.points + 150),
        });
      }
    } 
    else if (guardianId === 'binary_blade') {
      // BinaryBlade "Pivot Slasher" splits and sorts half of the array
      const leftHalf = array.slice(0, 3).sort((a, b) => a - b);
      const rightHalf = array.slice(3);
      const newArr = [...leftHalf, ...rightHalf];
      setArray(newArr);
      setSwaps(prev => prev + 2);
      setMessage('[BinaryBlade Ability] Pivot Slasher! Instantly sorted the entire left-hand division of memory.');
      if (checkSorted(newArr)) {
        setIsSorted(true);
        onUpdateProfile({
          points: profile.points + 150,
          rank: getNextRank(profile.points + 150),
        });
      }
    } 
    else if (guardianId === 'graph_goliath') {
      // GraphGoliath Dijkstra guide highlight
      let found = false;
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
          setSuggestedSwap([i, i + 1]);
          setMessage('[GraphGoliath Ability] Relax Edge Wave! Dijkstra routing algorithm highlights the optimal short-path elements to swap next.');
          found = true;
          break;
        }
      }
      if (!found) {
        setMessage('[GraphGoliath Ability] Destination reached. Array already sorted!');
      }
    } 
    else if (guardianId === 'hashed_haze') {
      // HashedHaze constant-time rip
      const sorted = [...array].sort((a, b) => a - b);
      setArray(sorted);
      setSwaps(prev => prev + 1);
      setIsSorted(true);
      setMessage('[HashedHaze Ability] Constant-Time Rip! Quantum hashing instantly resolved all indexing locations in O(1) space.');
      onUpdateProfile({
        points: profile.points + 180,
        rank: getNextRank(profile.points + 180),
      });
    }
  };

  // Themes mapping helper
  const getThemeColors = (color: string) => {
    switch (color) {
      case 'purple':
        return {
          glow: 'border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
          text: 'text-purple-400',
          bg: 'bg-purple-950/20',
          btn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20 text-white'
        };
      case 'cyan':
        return {
          glow: 'border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
          text: 'text-cyan-400',
          bg: 'bg-cyan-950/20',
          btn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20 text-white'
        };
      case 'emerald':
        return {
          glow: 'border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
          text: 'text-emerald-400',
          bg: 'bg-emerald-950/20',
          btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 text-white'
        };
      case 'amber':
      default:
        return {
          glow: 'border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
          text: 'text-amber-400',
          bg: 'bg-amber-950/20',
          btn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20 text-white'
        };
    }
  };

  const theme = getThemeColors(activeGuardian.themeColor);

  return (
    <div className="relative w-full bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-5 md:p-6 backdrop-blur-xl flex flex-col md:flex-row gap-6">
      
      {/* Dynamic backdrop glows matching selected Guardian */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-slate-950 rounded-full blur-3xl pointer-events-none z-0" />

      {/* LEFT COLUMN: SELECTED GUARDIAN HUD */}
      <div className="w-full md:w-1/3 flex flex-col justify-between p-4 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-4 z-10">
        <div>
          <span className="text-[8px] font-mono tracking-widest text-slate-500 font-bold uppercase block">
            GUARDIAN MODULE
          </span>
          <div className="flex items-center gap-3 mt-1.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono border ${theme.glow} ${theme.bg} ${theme.text}`}>
              {activeGuardian.avatarUrl}
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-200 tracking-tight leading-none">{activeGuardian.name}</h4>
              <span className="text-[9px] font-mono text-slate-400 mt-1 block">{activeGuardian.complexityFactor} complexity</span>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed border-t border-slate-900 pt-2.5">
            {activeGuardian.description.substring(0, 110)}...
          </p>
        </div>

        {/* Dynamic Ability Button */}
        <div className="border-t border-slate-900 pt-3.5 space-y-2">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold uppercase block">
            SIGNATURE ABILITY:
          </span>
          <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
            <h5 className="text-[11px] font-bold text-slate-200 leading-none flex items-center gap-1.5">
              <Zap className={`w-3.5 h-3.5 ${theme.text}`} />
              {activeGuardian.abilities[0].name}
            </h5>
            <p className="text-[9px] text-slate-400 mt-1 leading-normal">
              {activeGuardian.abilities[0].description}
            </p>
          </div>

          <button
            onClick={triggerGuardianAbility}
            disabled={abilityCooldown || isSorted || isSortingAuto}
            className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              abilityCooldown 
                ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
                : isSorted || isSortingAuto
                ? 'bg-slate-900 border border-slate-850 text-slate-600 cursor-not-allowed'
                : `${theme.btn} border border-white/10 active:scale-95`
            }`}
          >
            {abilityCooldown ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>COOLDOWN PIPELINE</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>ACTIVATE POWER</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: ACTIVE SORTING GAME FIELD */}
      <div className="flex-1 flex flex-col justify-between space-y-4 z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-850 pb-2">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-purple-400 font-bold uppercase">
              ACTIVE DSA ARENA
            </span>
            <h3 className="text-base font-extrabold text-slate-100 tracking-wide font-sans">
              Sorting Battle Arena
            </h3>
          </div>
          <button
            onClick={onBackToMenu}
            className="text-[10px] font-mono text-slate-400 hover:text-cyan-400 transition-colors px-2.5 py-1.5 bg-slate-950 rounded-lg border border-slate-850 hover:border-slate-800"
          >
            &lt; Menu
          </button>
        </div>

        {/* Message System Bar */}
        <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl flex items-start gap-2 min-h-[50px]">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span className="text-[11px] font-mono text-slate-300 leading-normal">
            {message}
          </span>
        </div>

        {/* Visual Array Renderer */}
        <div className="flex justify-between items-end h-40 px-4 bg-slate-950/90 rounded-xl border border-slate-850 py-5">
          {array.map((val, idx) => {
            const isSelected = selectedIdx === idx;
            
            // Highlight bar if suggested by Dijkstra skill (GraphGoliath)
            const isSuggested = suggestedSwap && (suggestedSwap[0] === idx || suggestedSwap[1] === idx);

            return (
              <div
                key={idx}
                onClick={() => handleBarClick(idx)}
                className="flex flex-col items-center gap-1.5 group cursor-pointer w-10"
              >
                {/* Vertical Column */}
                <div
                  className={`w-8 rounded-t-md transition-all duration-300 relative ${
                    isSelected
                      ? 'bg-gradient-to-t from-cyan-600 via-cyan-400 to-white shadow-[0_0_20px_rgba(6,182,212,0.6)] border border-cyan-300 scale-105'
                      : isSuggested
                      ? 'bg-gradient-to-t from-emerald-600 via-emerald-400 to-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-emerald-300 scale-105 animate-pulse'
                      : 'bg-gradient-to-t from-purple-900 to-purple-500 group-hover:from-purple-800 group-hover:to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.15)]'
                  }`}
                  style={{ height: `${val * 1.1}px` }}
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-white/20 rounded-t-md" />
                </div>
                {/* Node label */}
                <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-400' : isSuggested ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {val}
                </span>
              </div>
            );
          })}
        </div>

        {/* Statistics info badges */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-xl text-center">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Completed Swaps</span>
            <span className="text-base font-mono font-bold text-cyan-400">{swaps}</span>
          </div>
          <div className="p-2.5 bg-slate-950/40 border border-slate-850 rounded-xl text-center">
            <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block">Time Complexity</span>
            <span className="text-base font-mono font-bold text-purple-400">{activeGuardian.complexityFactor}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={initArray}
            className="flex-1 py-2 px-3 bg-slate-950 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-850 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Stack</span>
          </button>

          <button
            disabled={isSortingAuto || isSorted}
            onClick={runAutoSort}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 border ${
              isSorted
                ? 'bg-slate-950 border-slate-900 text-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-purple-500 text-purple-100 shadow-[0_4px_15px_rgba(168,85,247,0.3)]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Auto-Sort Stack</span>
          </button>
        </div>

        {/* Completion Modal/Notice */}
        {isSorted && (
          <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center gap-3 animate-fade-in mt-1">
            <div className="p-1.5 bg-emerald-900/40 border border-emerald-500/30 rounded-lg text-emerald-300">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-[11px] font-bold text-emerald-200 leading-none">Arena Compiled successfully!</h4>
              <p className="text-[9px] text-emerald-400 mt-0.5">
                Rating synchronized. +150 reputation points.
              </p>
            </div>
            <button
              onClick={initArray}
              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white rounded-lg transition-colors shadow-lg"
            >
              Recycle Stack
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
