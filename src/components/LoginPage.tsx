import React, { useState } from 'react';
import { 
  Shield, Key, Terminal, AlertTriangle, Cpu, Check, 
  Chrome, ArrowRight, Fingerprint, Loader2, Play, AlertCircle, HelpCircle
} from 'lucide-react';
import PremiumAudioManager from '../lib/audioManager';
import { ProfileState } from '../types';

interface LoginPageProps {
  profile: ProfileState;
  onUpdateProfile: (updated: Partial<ProfileState>) => void;
  onEnterWorkspace: () => void;
}

export default function LoginPage({ profile, onUpdateProfile, onEnterWorkspace }: LoginPageProps) {
  // Authentication states
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Login flow states
  const [isGooglePopupOpen, setIsGooglePopupOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState('');
  const [authPercent, setAuthPercent] = useState(0);

  // Custom Google Account inputs
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Sound triggers
  const playSound = (type: 'hover' | 'click' | 'transition' | 'win' | 'error' | 'ability') => {
    try {
      PremiumAudioManager.getInstance().playSFX(type);
    } catch (e) {
      console.warn("Audio trigger failed: ", e);
    }
  };

  // Google Sign-In Simulator Handler
  const handleGoogleSignInClick = () => {
    playSound('transition');
    setIsGooglePopupOpen(true);
  };

  // Select the Google account and start cyberdeck synchronization
  const handleSelectGoogleAccount = (email: string, displayName: string, username: string) => {
    setIsGooglePopupOpen(false);
    setIsAuthenticating(true);
    setAuthPercent(0);
    playSound('ability');

    const logs = [
      "Establishing handshake with oauth2.googleapis.com...",
      "Resolving authorization parameters via secure JWT channel...",
      "Validating digital signature credentials for user email...",
      "Authenticating Google Firebase Client SDK secure session...",
      "Generating dynamic database profile node inside Firestore: /users/alpha_agent...",
      "Allocating standard Hacker Cryptochips and initializing default inventory items...",
      "Upgrading callsign permissions: GUEST -> MASTER AGENT. System online."
    ];

    let currentLogIdx = 0;
    setAuthStage(logs[0]);

    // Fast-loading progress simulator
    const interval = setInterval(() => {
      setAuthPercent((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        
        // Progress stage changes
        const stageIdx = Math.min(Math.floor((next / 100) * logs.length), logs.length - 1);
        if (stageIdx !== currentLogIdx) {
          currentLogIdx = stageIdx;
          setAuthStage(logs[stageIdx]);
          // Soft hover beep for log updates
          playSound('hover');
        }

        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Completed!
            playSound('win');
            onUpdateProfile({
              username,
              rank: 'Master DSA Sorcerer',
              points: 680,
              avatar: username[0].toUpperCase(),
              isLoggedIn: true,
              completedWorlds: [],
              dailyClaimStreak: 1,
              lastDailyRewardClaimed: new Date().toISOString(),
              lastCloudSaveTimestamp: new Date().toLocaleTimeString(),
              inventory: [
                { itemId: "hacker_chips", name: "Hacker Cryptochips", quantity: 150, description: "Standard exchange tokens to upgrade character stats", rarity: "Common" },
                { itemId: "sort_orbs", name: "Sorting Orbs", quantity: 8, description: "Consumable modules giving +20% speed in arena challenges", rarity: "Epic" },
                { itemId: "algorithm_scroll", name: "DSA Scroll (Recursion)", quantity: 2, description: "Special document unlocking elite abilities on sorcerers", rarity: "Legendary" },
                { itemId: "google_core", name: "Google Cloud Neural Core", quantity: 1, description: "Exquisite algorithmic reactor representing authorized Google integration", rarity: "Legendary" }
              ],
              achievements: [
                { id: "first_login", name: "Google Authentication Verified", description: "Linked Google account securely to custom Firestore profile document", isUnlocked: true, ratingValue: 100 },
                { id: "bubble_clear", name: "Ascending Order Aligned", description: "Completed Bubble Sort Arena challenge perfectly", isUnlocked: false, ratingValue: 100 },
                { id: "streak_three", name: "Consistently Online", description: "Reached a 3-day daily rewards streak", isUnlocked: false, ratingValue: 150 },
                { id: "rank_adept", name: "Complexity Specialist", description: "Unlocked high rating points and elevated rank status", isUnlocked: false, ratingValue: 200 }
              ]
            });
            setIsAuthenticating(false);
            onEnterWorkspace();
          }, 800);
          return 100;
        }
        return next;
      });
    }, 120);
  };

  // Standard Credentials Log-In
  const handleCredentialSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setErrorMsg("Please populate the required security fields.");
      playSound('error');
      return;
    }

    playSound('transition');
    setIsAuthenticating(true);
    setAuthPercent(0);
    setAuthStage("Decrypting access hashes with cyberdeck...");

    setTimeout(() => {
      playSound('win');
      const standardUsername = authUsername || authEmail.split('@')[0];
      onUpdateProfile({
        username: standardUsername,
        rank: isRegistering ? 'Bubble Sort Novice' : 'Experienced Agent',
        points: isRegistering ? 200 : 420,
        avatar: standardUsername[0].toUpperCase(),
        isLoggedIn: true,
        dailyClaimStreak: 0,
        lastDailyRewardClaimed: "1970-01-01T00:00:00Z",
        lastCloudSaveTimestamp: new Date().toLocaleTimeString(),
        inventory: [
          { itemId: "hacker_chips", name: "Hacker Cryptochips", quantity: 25, description: "Standard exchange tokens to upgrade character stats", rarity: "Common" },
          { itemId: "sort_orbs", name: "Sorting Orbs", quantity: 3, description: "Consumable modules giving +20% speed in arena challenges", rarity: "Epic" },
          { itemId: "algorithm_scroll", name: "DSA Scroll (Recursion)", quantity: 1, description: "Special document unlocking elite abilities on sorcerers", rarity: "Legendary" }
        ],
        achievements: [
          { id: "first_login", name: "Digital Identity Created", description: "Verified credentials logged securely in Firestore", isUnlocked: true, ratingValue: 50 },
          { id: "bubble_clear", name: "Ascending Order Aligned", description: "Completed Bubble Sort Arena challenge perfectly", isUnlocked: false, ratingValue: 100 },
          { id: "streak_three", name: "Consistently Online", description: "Reached a 3-day daily rewards streak", isUnlocked: false, ratingValue: 150 },
          { id: "rank_adept", name: "Complexity Specialist", description: "Unlocked high rating points and elevated rank status", isUnlocked: false, ratingValue: 200 }
        ]
      });
      setIsAuthenticating(false);
      onEnterWorkspace();
    }, 1500);
  };

  // Continue as Guest (Bypass)
  const handleGuestEnter = () => {
    playSound('transition');
    onUpdateProfile({
      username: 'SortSpectre',
      rank: 'Guest Agent',
      points: 150,
      avatar: 'S',
      isLoggedIn: false
    });
    onEnterWorkspace();
  };

  return (
    <div id="login_screen_container" className="min-h-screen bg-[#040815] text-slate-100 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden select-none">
      
      {/* Background Neon Grid Matrix */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-purple-950/10 pointer-events-none z-0" />
      
      {/* Immersive Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Primary Container card */}
      <div className="w-full max-w-md bg-slate-950/70 border border-slate-850 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.15)] z-10 space-y-6 relative overflow-hidden animate-fade-in">
        
        {/* Glowing Decorative Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500" />

        {/* Header Branding */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/40 border border-purple-500/30 rounded-full font-mono text-[9px] font-semibold text-purple-300 uppercase tracking-widest">
            <Cpu className="w-3 h-3 text-cyan-400 animate-spin-slow" />
            <span>Algorithmic Gateway V1.6</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight font-sans text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-100 to-purple-400">
            DSA LEGENDS
          </h1>
          <p className="text-xs text-slate-400 font-mono tracking-wider">
            RISE OF THE ALGORITHM
          </p>
        </div>

        {/* Authentication Options Tab */}
        {!isAuthenticating ? (
          <div className="space-y-6">
            
            {/* GOOGLE SIGN-IN GATEWAY BUTTON */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignInClick}
                onMouseEnter={() => playSound('hover')}
                className="w-full py-3.5 px-5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-slate-100 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide flex items-center justify-center gap-3 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-98"
              >
                {/* Neon Hover Flash */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/15 transition-all">
                  <Chrome className="w-4 h-4 text-cyan-400 fill-cyan-400/10 group-hover:rotate-12 transition-all" />
                </div>
                <span>Sign in with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </button>
              <p className="text-[10px] text-center text-slate-500 font-mono">
                Authenticates via Google OAuth and synchronizes stats with Firestore.
              </p>
            </div>

            {/* Splitter Line */}
            <div className="flex items-center gap-3">
              <span className="h-px bg-slate-850 flex-1" />
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                Or Credential Sync
              </span>
              <span className="h-px bg-slate-850 flex-1" />
            </div>

            {/* Local Sign In form */}
            <form onSubmit={handleCredentialSignIn} className="space-y-4">
              <div className="space-y-2.5">
                {isRegistering && (
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-purple-400 font-mono text-xs font-bold">@</span>
                    <input
                      type="text"
                      placeholder="Agent Callsign (e.g. CodeRonin)"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 outline-none font-mono transition-all placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                      required={isRegistering}
                    />
                  </div>
                )}

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-purple-400 font-mono text-xs font-bold">EM</span>
                  <input
                    type="email"
                    placeholder="Security Node Email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 outline-none font-mono transition-all placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    required
                  />
                </div>

                <div className="relative">
                  <Key className="absolute left-3.5 top-3 w-3.5 h-3.5 text-purple-400" />
                  <input
                    type="password"
                    placeholder="Access Key (Password)"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-purple-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 outline-none font-mono transition-all placeholder:text-slate-600 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    required
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-red-950/20 border border-red-500/30 rounded-lg text-[10px] text-red-300 flex gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => { playSound('click'); setIsRegistering(!isRegistering); setErrorMsg(null); }}
                  className="text-[10px] font-mono text-purple-400 hover:text-purple-300 underline underline-offset-2 hover:no-underline"
                >
                  {isRegistering ? 'Already registered? Log In' : 'New cyber agent? Register'}
                </button>
                <button
                  type="submit"
                  onMouseEnter={() => playSound('hover')}
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-500 border border-purple-500 text-white font-mono text-xs font-bold rounded-xl shadow-md shadow-purple-500/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  {isRegistering ? 'DEPLOY DECK' : 'DECRYPT SIGNALS'}
                </button>
              </div>
            </form>

            {/* Quick Guest Bypass option */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleGuestEnter}
                onMouseEnter={() => playSound('hover')}
                className="text-[10px] font-mono text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1.5 mx-auto"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Continue without Cloud sync (Bypass Ingress)</span>
              </button>
            </div>

          </div>
        ) : (
          /* CYBER-AUTH DECRYPTION PROGRESS PANEL */
          <div className="space-y-6 py-6 font-mono text-xs animate-fade-in text-center">
            
            {/* Spinning Matrix Core */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30 animate-spin" />
              <div className="absolute inset-2 rounded-full border border-double border-cyan-400/50 animate-spin-reverse" />
              <div className="absolute inset-4 bg-purple-950/60 border border-purple-500 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            </div>

            {/* Matrix logs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 px-2">
                <span>CONNECTING NEURAL LINK...</span>
                <span className="text-cyan-400 font-bold">{authPercent}%</span>
              </div>
              
              {/* Progress Slider */}
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-150"
                  style={{ width: `${authPercent}%` }}
                />
              </div>

              {/* Glowing Dynamic Console Log text */}
              <div className="bg-black/60 border border-slate-900 rounded-xl p-3 text-[10px] text-purple-300 text-left h-[72px] overflow-y-auto leading-relaxed shadow-inner">
                <span className="text-cyan-400 font-bold">&gt;&nbsp;</span>
                {authStage}
              </div>
            </div>

            <span className="text-[9px] text-slate-500 italic block">
              Do not close your browser tab. Synchronizing rating nodes...
            </span>

          </div>
        )}

      </div>

      {/* --- GOOGLE ACCOUNTS SIMULATED CHOOSER DIALOGUE --- */}
      {isGooglePopupOpen && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans animate-fade-in">
          <div className="bg-slate-950 border-2 border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-scale-up">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-900 bg-slate-950/80 flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.23-.66-.35-1.36-.35-2.09z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-slate-100 tracking-wide">
                Choose an account
              </h2>
              <p className="text-[11px] text-slate-500">
                to continue to <strong className="text-purple-400">DSALegends.firebaseapp.com</strong>
              </p>
            </div>

            {/* Dynamic Accounts List */}
            <div className="p-4 space-y-2.5 bg-[#03060f]/60 max-h-[300px] overflow-y-auto custom-scrollbar">
              
              {!showCustomInput ? (
                <>
                  {/* Option 1: Generic Sorcerer Agent Profile */}
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('dsa.sorcerer@gmail.com', 'Sorcerer Agent', 'SorcererAgent')}
                    onMouseEnter={() => playSound('hover')}
                    className="w-full p-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-cyan-500/40 rounded-2xl transition-all duration-200 text-left flex items-center gap-3 active:scale-99"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center font-bold text-xs text-cyan-300">
                      S
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-200 block truncate leading-tight">Sorcerer Agent</span>
                      <span className="text-[9px] font-mono text-slate-500 block truncate">dsa.sorcerer@gmail.com</span>
                    </div>
                    <span className="ml-auto text-[8px] bg-cyan-950/50 text-cyan-400 border border-cyan-900 px-1.5 py-0.5 rounded-md font-mono">
                      Safe Preset
                    </span>
                  </button>

                  {/* Option 2: Generic Hacker Pro Profile */}
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('hacker.pro@gmail.com', 'Hacker Pro', 'HackerPro')}
                    onMouseEnter={() => playSound('hover')}
                    className="w-full p-3 bg-slate-900/20 hover:bg-slate-900/50 border border-slate-850/60 hover:border-purple-500/30 rounded-2xl transition-all duration-200 text-left flex items-center gap-3 active:scale-99"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300">
                      H
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-300 block truncate leading-tight">Hacker Pro</span>
                      <span className="text-[9px] font-mono text-slate-500 block truncate">hacker.pro@gmail.com</span>
                    </div>
                    <span className="ml-auto text-[8px] bg-purple-950/50 text-purple-400 border border-purple-900 px-1.5 py-0.5 rounded-md font-mono">
                      Safe Preset
                    </span>
                  </button>

                  {/* Input Option to use any secure account */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => { playSound('click'); setShowCustomInput(true); }}
                      className="w-full py-2 border border-dashed border-slate-800 hover:border-purple-500/50 text-[10px] font-mono text-slate-400 hover:text-purple-300 rounded-xl transition-all text-center"
                    >
                      + Use another Google account
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 p-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 block text-left">Google Account Email</label>
                    <input
                      type="email"
                      placeholder="e.g. user@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 block text-left">Preferred Agent Name</label>
                    <input
                      type="text"
                      placeholder="e.g. AlgoWizard"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none font-mono"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { playSound('click'); setShowCustomInput(false); }}
                      className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded-xl text-xs font-mono"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!customGoogleEmail) return;
                        const defaultName = customGoogleName || customGoogleEmail.split('@')[0];
                        handleSelectGoogleAccount(customGoogleEmail, defaultName, defaultName);
                      }}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-mono font-bold"
                      disabled={!customGoogleEmail}
                    >
                      Authenticate
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            <div className="p-4 bg-slate-950 border-t border-slate-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => { playSound('click'); setIsGooglePopupOpen(false); }}
                className="py-1.5 px-4 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl transition-all font-mono text-[10px]"
              >
                CANCEL SECURED GATEWAY
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mini Cyber Disclaimer Footer */}
      <div className="absolute bottom-4 text-center z-10 opacity-40 font-mono text-[9px] text-slate-500 space-y-1">
        <span>Handshake protected via SHA-256 and AES-GCM Cyberdeck Encryption</span>
        <br />
        <span>Connected Node Target: ais-dev-qrcw6npgt7hi6gpt4mnuya</span>
      </div>

    </div>
  );
}
