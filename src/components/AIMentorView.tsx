import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Send, Sparkles, BookOpen, Award, Flame, Zap, CheckCircle2, 
  HelpCircle, RefreshCw, Star, Play, Terminal, ChevronRight, MessageSquare, Cpu, X
} from 'lucide-react';
import { ProfileState } from '../types';
import { GUARDIANS } from './CharacterSelectionView';

interface AIMentorViewProps {
  profile: ProfileState;
  sfxVolume: number;
  onClose?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface DSATopic {
  id: string;
  name: string;
  category: 'Basics' | 'Intermediate' | 'Advanced';
  mastery: number; // percentage
  status: 'LOCKED' | 'IN_PROGRESS' | 'MASTERED';
  keyConcepts: string[];
}

const INITIAL_TOPICS: DSATopic[] = [
  {
    id: 'arrays_strings',
    name: 'Arrays & Sliding Window',
    category: 'Basics',
    mastery: 75,
    status: 'IN_PROGRESS',
    keyConcepts: ['Two Pointers', 'Sliding Window', 'Prefix Sums']
  },
  {
    id: 'linked_lists_stacks',
    name: 'Linked Lists & Stack Ops',
    category: 'Basics',
    mastery: 40,
    status: 'IN_PROGRESS',
    keyConcepts: ['Floyd\'s Cycle Detection', 'Monotonic Stack', 'Reverse LL']
  },
  {
    id: 'recursion_trees',
    name: 'Recursion & Binary Trees',
    category: 'Intermediate',
    mastery: 20,
    status: 'IN_PROGRESS',
    keyConcepts: ['DFS/BFS Traversals', 'BST Validation', 'LCA Searches']
  },
  {
    id: 'sorting_binary_search',
    name: 'Divide & Conquer, Binary Search',
    category: 'Intermediate',
    mastery: 0,
    status: 'LOCKED',
    keyConcepts: ['Quicksort Partitioning', 'Sorted Matrix Search', 'Bisect Range']
  },
  {
    id: 'graphs_dijkstra',
    name: 'Graphs & Shortest Paths',
    category: 'Advanced',
    mastery: 0,
    status: 'LOCKED',
    keyConcepts: ['Dijkstra\'s Multi-warp', 'Kruskal\'s MST', 'Union-Find']
  },
  {
    id: 'dynamic_programming',
    name: 'Dynamic Programming',
    category: 'Advanced',
    mastery: 0,
    status: 'LOCKED',
    keyConcepts: ['Tabulation Grid', 'Memoization Trees', 'Knapsack Matrix']
  }
];

// Helper to format/parse basic markdown since we prefer a highly styled customized view
const renderMarkdownText = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-2 font-sans text-[11px] leading-relaxed text-slate-300">
      {lines.map((line, idx) => {
        // Headers
        if (line.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-xs font-bold text-cyan-400 mt-2 font-mono flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-cyan-500" />
              {line.replace('### ', '')}
            </h4>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-xs font-bold text-purple-400 mt-3 border-b border-purple-950 pb-1 font-mono uppercase tracking-wider">
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-sm font-extrabold text-white mt-4 border-b border-slate-800 pb-1 font-mono uppercase tracking-widest">
              {line.replace('# ', '')}
            </h2>
          );
        }

        // Code block starts/ends
        if (line.trim().startsWith('```')) {
          return null; // let's simplify or ignore the block line itself
        }

        // List items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2">
              <span className="text-cyan-500 font-bold mt-0.5">•</span>
              <span>{line.replace(/^[-*]\s+/, '')}</span>
            </div>
          );
        }

        // Numbered list items
        if (/^\d+\.\s/.test(line.trim())) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2">
              <span className="text-purple-400 font-mono font-bold">{match?.[1]}.</span>
              <span>{match?.[2]}</span>
            </div>
          );
        }

        // Handle inline bold/italic highlights
        const formattedLine = line.split('**').map((part, i) => {
          if (i % 2 === 1) {
            return <strong key={i} className="text-cyan-300 font-semibold">{part}</strong>;
          }
          return part;
        });

        return line.trim() ? <p key={idx}>{formattedLine}</p> : <div key={idx} className="h-1.5" />;
      })}
    </div>
  );
};

export default function AIMentorView({ profile, sfxVolume, onClose }: AIMentorViewProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '### Welcome, Initiate.\nI am **Cyber-Tutor Oris**, your direct neural link to Algorithmic Mastery.\n\nChoose an active focus topic from the **Neural Roadmaps** on the right, or transmit any query. Let\'s optimize your code execution bounds and compile you into a Legend!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [topics, setTopics] = useState<DSATopic[]>(INITIAL_TOPICS);
  const [activeTopic, setActiveTopic] = useState<DSATopic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [motivationalLine, setMotivationalLine] = useState('');
  const [motivationLoading, setMotivationLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Tactile Synthesizer Sound
  const playSfx = (type: 'hover' | 'click' | 'transmit' | 'success' | 'tune') => {
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
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
        gain.gain.setValueAtTime(0.01 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.03 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'transmit') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.06);
        gain.gain.setValueAtTime(0.04 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.03 * sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'tune') {
        // High-tech sweeping ambient chord
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.6);
        gain.gain.setValueAtTime(0.02 * sfxVolume, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {}
  };

  const getActiveGuardianName = () => {
    const g = GUARDIANS.find(guard => guard.id === profile.selectedGuardianId);
    return g ? g.name : 'BinaryBlade';
  };

  // Chat Submission
  const handleSendMessage = async (customMsg?: string) => {
    const textToSend = customMsg || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    playSfx('transmit');
    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customMsg) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6), // Send last 6 messages as context
          currentTopic: activeTopic ? activeTopic.name : 'Data Structures & Algorithms',
          guardianName: getActiveGuardianName(),
          userPoints: profile.points
        })
      });

      const data = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        playSfx('success');
      } else {
        throw new Error(data.error || 'Connection pipeline timed out');
      }
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `### Connection Terminated.\n> **Alert**: Neural gateway latency exceeded. Check your credentials in Settings.\n\n*Simulated Hint*: While configuring, remember that **${activeTopic?.name || 'algorithm analysis'}** relies heavily on keeping time complexity beneath boundaries. Try asking me something specific!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Focus on a topic
  const selectTopicFocus = (topic: DSATopic) => {
    if (topic.status === 'LOCKED') {
      playSfx('hover');
      // Alert/Log that this is locked
      return;
    }
    playSfx('click');
    setActiveTopic(topic);
    
    const triggerMessage = `Give me an overview of ${topic.name} and explain how to apply its key concepts like ${topic.keyConcepts.join(', ')} in a high-performance scenario.`;
    handleSendMessage(triggerMessage);
  };

  // Boost motivation
  const handleGetMotivation = async () => {
    if (motivationLoading) return;
    setMotivationLoading(true);
    playSfx('tune');

    try {
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Generate a short, intense 1-sentence cyberpunk motivational war-cry for an elite programmer solving complex algorithms under heavy resource constraints.',
          guardianName: getActiveGuardianName(),
          userPoints: profile.points
        })
      });
      const data = await response.json();
      if (data.response) {
        setMotivationalLine(data.response.replace(/["']/g, ''));
        playSfx('success');
      } else {
        setMotivationalLine('OPTIMIZE YOUR TIME COMPLEXITY. THE MATRIX BELONGS TO CONSTANT TIME!');
      }
    } catch (e) {
      const presets = [
        "COMPILER ONLINE. UNLEASH THE FORCE OF CONSTANT SPACE COMPLEXITY!",
        "YOUR BOUNDS ARE LIMITLESS. OVERRIDE THE STACK OVERFLOW AND DOMINATE THE MATRIX!",
        "THE O(N LOG N) CEILING IS MEANT TO BE SHATTERED. CODE WITH WARRIOR INTENT!",
        "COMPILING SUCCESS... ZERO DEADLOCKS DETECTED. YOU ARE THE ALGORITHM MASTER!"
      ];
      setMotivationalLine(presets[Math.floor(Math.random() * presets.length)]);
      playSfx('success');
    } finally {
      setMotivationLoading(false);
    }
  };

  // Toggle master status manually to show progress tracking
  const toggleMastery = (topicId: string) => {
    playSfx('click');
    setTopics(prev => prev.map(t => {
      if (t.id === topicId) {
        const nextStatus = t.status === 'MASTERED' ? 'IN_PROGRESS' : 'MASTERED';
        const nextMastery = nextStatus === 'MASTERED' ? 100 : 50;
        return { ...t, status: nextStatus, mastery: nextMastery };
      }
      return t;
    }));

    // Unlock subsequent topic
    const index = topics.findIndex(t => t.id === topicId);
    if (index !== -1 && index + 1 < topics.length) {
      setTopics(prev => prev.map((t, i) => {
        if (i === index + 1 && t.status === 'LOCKED') {
          return { ...t, status: 'IN_PROGRESS', mastery: 15 };
        }
        return t;
      }));
    }
  };

  return (
    <div className="relative lg:absolute inset-0 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-3 sm:p-5 backdrop-blur-xl animate-fade-in flex flex-col justify-between overflow-y-auto custom-scrollbar min-h-[320px] h-full w-full">
      
      {/* 1. COMPANION HEADER */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
          <div>
            <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider block">
              AI MENTOR ORIS v3.5
            </span>
            <span className="text-[9px] font-mono text-cyan-500/80 uppercase">
              Neural Companion Link • {activeTopic ? `Focus: ${activeTopic.name}` : 'Awaiting Linkup'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex text-[10px] font-mono text-slate-400 items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            <Cpu className="w-3 h-3 text-cyan-400 animate-spin" />
            <span>SYNC LEVEL: 98.4%</span>
          </span>
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

      {/* 2. DUAL INTERFACE PANELS */}
      <div className="grid grid-cols-12 gap-4 flex-1 my-3 overflow-hidden">
        
        {/* LEFT COLUMN: CHAT DECKS (7 Cols) */}
        <div className="col-span-7 flex flex-col justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 overflow-hidden">
          
          {/* Chat scrolling view */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3.5 pr-1.5 pb-2">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-mono text-slate-500">{msg.timestamp}</span>
                    <span className="text-[9px] font-mono text-cyan-500 font-bold uppercase">
                      {msg.role === 'user' ? 'Student Agent' : 'Oris Coach'}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl border max-w-[92%] ${
                    msg.role === 'user'
                      ? 'bg-purple-950/20 border-purple-900/60 text-purple-200'
                      : 'bg-slate-950 border-slate-850 text-slate-300'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="text-[11px] font-mono text-slate-200 leading-relaxed">{msg.content}</p>
                    ) : (
                      renderMarkdownText(msg.content)
                    )}
                  </div>
                </div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-dashed border-cyan-500/20 w-[180px]">
                <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                <span className="text-[10px] font-mono text-cyan-400 animate-pulse uppercase">Receiving Telemetry...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick presets row */}
          <div className="flex gap-1.5 py-2 shrink-0 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => { playSfx('click'); setInputMessage('Explain sliding window complexity analysis.'); }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-[9px] text-slate-400 hover:text-cyan-400 font-mono border border-slate-800 rounded transition-all shrink-0 cursor-pointer"
            >
              Sliding Window?
            </button>
            <button
              onClick={() => { playSfx('click'); setInputMessage('How do I validate a BST efficiently?'); }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-[9px] text-slate-400 hover:text-cyan-400 font-mono border border-slate-800 rounded transition-all shrink-0 cursor-pointer"
            >
              Validate BST?
            </button>
            <button
              onClick={() => { playSfx('click'); setInputMessage('Give me a high-level recursive call tree analogy.'); }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 text-[9px] text-slate-400 hover:text-cyan-400 font-mono border border-slate-800 rounded transition-all shrink-0 cursor-pointer"
            >
              Recursion Analogy
            </button>
          </div>

          {/* Chat Send Area */}
          <div className="flex gap-2 shrink-0 pt-1.5 border-t border-slate-900">
            <input
              type="text"
              placeholder="Query Oris regarding algorithms, code-optimizations, complexity limits..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono placeholder:text-slate-650"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading}
              className="px-3 bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/60 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ROADMAPS & MOTIVATION (5 Cols) */}
        <div className="col-span-5 flex flex-col justify-between overflow-hidden gap-3">
          
          {/* Neural Roadmaps Block */}
          <div className="flex-1 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1.5 mb-2 border-b border-slate-900 pb-1.5 shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono font-bold text-slate-200 uppercase tracking-wide">
                NEURAL LEARNING MATRIX
              </span>
            </div>

            {/* Scrollable list of topics */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {topics.map((topic) => {
                const isActive = activeTopic?.id === topic.id;
                const isLocked = topic.status === 'LOCKED';
                const isMastered = topic.status === 'MASTERED';

                return (
                  <div
                    key={topic.id}
                    className={`p-2 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-cyan-950/30 border-cyan-500/60'
                        : isLocked
                        ? 'bg-slate-900/10 border-slate-950 opacity-40'
                        : 'bg-slate-950 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => selectTopicFocus(topic)}
                        className={`text-[10px] font-mono font-bold text-left block flex-1 ${
                          isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:text-cyan-300'
                        }`}
                      >
                        {topic.name}
                      </button>

                      <button
                        onClick={() => !isLocked && toggleMastery(topic.id)}
                        disabled={isLocked}
                        className={`p-0.5 rounded text-[8px] font-mono border transition-all ${
                          isMastered 
                            ? 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' 
                            : isLocked 
                            ? 'bg-slate-950 text-slate-600 border-slate-900' 
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {isMastered ? 'MASTERED' : 'MARK DONE'}
                      </button>
                    </div>

                    {/* Key concepts small list */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {topic.keyConcepts.map((concept, i) => (
                        <span key={i} className="text-[8px] font-mono px-1 py-0.2 bg-slate-900 border border-slate-850 rounded text-slate-500">
                          {concept}
                        </span>
                      ))}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-900 h-1 rounded mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${isMastered ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motivation Generator Block */}
          <div className="bg-gradient-to-br from-cyan-950/20 to-slate-950 border border-cyan-800/30 rounded-xl p-3 shrink-0 relative overflow-hidden">
            <div className="flex items-center justify-between mb-1.5 border-b border-cyan-950 pb-1 shrink-0">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-amber-300 uppercase">
                  ORIS OVERRIDE CHAKRA
                </span>
              </div>
              <button
                onClick={handleGetMotivation}
                disabled={motivationLoading}
                className="px-2 py-0.5 bg-amber-500 text-slate-950 border border-amber-400 font-mono font-extrabold text-[8px] rounded uppercase hover:bg-amber-400 transition-all cursor-pointer flex items-center gap-1"
              >
                <Zap className="w-2.5 h-2.5 fill-slate-950" />
                <span>{motivationLoading ? 'IGNITING...' : 'IGNITE BOOST'}</span>
              </button>
            </div>

            <div className="min-h-[36px] flex items-center justify-center bg-slate-950/80 border border-slate-900 rounded p-2 text-center">
              {motivationLoading ? (
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
                  <span className="text-[8px] font-mono text-amber-500/80 uppercase">Synchronizing battle-cry vectors...</span>
                </div>
              ) : motivationalLine ? (
                <p className="text-[9px] font-mono font-semibold text-amber-300 leading-snug animate-pulse">
                  &gt; {motivationalLine}
                </p>
              ) : (
                <p className="text-[8px] font-mono text-slate-500">
                  Click 'IGNITE BOOST' to receive a battle-cry override from Coach Oris.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
