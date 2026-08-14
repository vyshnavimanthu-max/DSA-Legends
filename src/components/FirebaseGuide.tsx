import React, { useState } from 'react';
import { ShieldAlert, Terminal, Copy, Check, Download, ExternalLink, Flame, CheckCircle, Database, Lock } from 'lucide-react';

export default function FirebaseGuide() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const firestoreRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // DSA Legends User profiles rule
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`;

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl p-6 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-start gap-4 pb-5 border-b border-slate-800/60">
        <div className="p-3 bg-orange-950/40 border border-orange-500/30 text-orange-400 rounded-xl">
          <Flame className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 tracking-wide flex items-center gap-2">
            Unity 6 × Firebase Integration Guide
          </h2>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">
            Configure Google Firebase Authentication and Firestore in <b>Unity 6 LTS</b> for real-time leaderboards and cloud profiles.
          </p>
        </div>
      </div>

      {/* Steps Grid */}
      <div className="space-y-6">
        {/* Step 1: SDK Installation */}
        <div className="relative pl-8 border-l border-slate-800">
          <div className="absolute -left-[11px] top-0.5 bg-purple-950 border-2 border-purple-500 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold text-purple-300">
            1
          </div>
          <h3 className="text-sm font-bold text-slate-200">Download Firebase Unity SDKs</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Get the official **Firebase Unity SDK** (dotnet4 version, compatible with Unity 6). Add the following packages via the Unity Package Manager (UPM) or as manual `.unitypackage` files:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-lg">
              <span className="text-[11px] font-bold text-orange-400 font-mono block">FirebaseAuth.unitypackage</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Handles user signups, digital credentials, and cyberdeck logging.</span>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-lg">
              <span className="text-[11px] font-bold text-orange-400 font-mono block">FirebaseFirestore.unitypackage</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Saves algorithm levels, scores, ranks, and user metadata in Firestore documents.</span>
            </div>
          </div>
        </div>

        {/* Step 2: Configuration */}
        <div className="relative pl-8 border-l border-slate-800">
          <div className="absolute -left-[11px] top-0.5 bg-purple-950 border-2 border-purple-500 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold text-purple-300">
            2
          </div>
          <h3 className="text-sm font-bold text-slate-200">Inject Configuration Files</h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Create a Firebase project in the Console, register your Unity app, and place your config files inside the specified path:
          </p>
          <div className="mt-3 p-3 bg-slate-900/40 border border-slate-800/60 rounded-lg font-mono text-[11px] text-slate-300 space-y-1.5">
            <div>
              📁 <span className="text-cyan-400">Assets</span>
            </div>
            <div className="pl-4 border-l border-slate-800/60 ml-2">
              📁 <span className="text-cyan-400">Resources</span>
              <div className="pl-4 border-l border-slate-800/60 ml-2 text-orange-400/90 font-semibold">
                📄 google-services.json <span className="text-[9px] text-slate-500">(For Android targets)</span>
              </div>
              <div className="pl-4 border-l border-slate-800/60 ml-2 text-orange-400/90 font-semibold">
                📄 GoogleService-Info.plist <span className="text-[9px] text-slate-500">(For iOS targets)</span>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2.5 bg-orange-950/20 border border-orange-500/20 rounded-lg text-[11px] text-orange-300/90 flex gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <span>
              <b>Note:</b> Firebase automatically parses configuration files inside <code>Assets/Resources</code>. Never expose your keys in raw C# script files!
            </span>
          </div>
        </div>

        {/* Step 3: Security Rules */}
        <div className="relative pl-8 border-l border-slate-800">
          <div className="absolute -left-[11px] top-0.5 bg-purple-950 border-2 border-purple-500 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold text-purple-300">
            3
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              Secure Firestore Security Rules
            </h3>
            <button
              onClick={() => handleCopy('rules', firestoreRules)}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded text-[10px] font-mono transition-colors border border-slate-700"
            >
              {copiedSection === 'rules' ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Rules</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Deploy these Firestore rules to restrict profile document writes exclusively to the authenticated user. This blocks other players from modifying their DSA Rating:
          </p>
          <div className="mt-3 bg-[#030712] rounded-lg border border-slate-800 p-3.5 font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre">
            {firestoreRules}
          </div>
        </div>

        {/* Step 4: Verification */}
        <div className="relative pl-8">
          <div className="absolute -left-[11px] top-0.5 bg-purple-950 border-2 border-purple-500 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[10px] font-bold text-purple-300">
            4
          </div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Launch and Initialize
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            The <code>FirebaseManager.cs</code> C# file we generated handles full dependency resolution asynchronously on startup. It verifies client services are active before allowing logins:
          </p>
          <div className="mt-3 p-3 bg-slate-900 border border-slate-800/80 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-slate-300">Firestore Doc Schema: /users/&#123;userId&#125;</span>
            </div>
            <span className="text-[10px] font-mono text-purple-400">Strictly Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
}
