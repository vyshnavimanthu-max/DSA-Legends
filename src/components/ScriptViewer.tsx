import React, { useState } from 'react';
import { Copy, Check, FileCode, Shield, RefreshCw, Cpu, Layers } from 'lucide-react';
import { UnityFile } from '../types';

interface ScriptViewerProps {
  file: UnityFile | null;
}

export default function ScriptViewer({ file }: ScriptViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-slate-950 border border-slate-800/80 rounded-xl">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
          <FileCode className="w-16 h-16 text-cyan-400 relative z-10" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">Select a C# SOLID Script</h3>
        <p className="text-slate-400 max-w-sm text-sm">
          Browse the Unity Project Tree and click on any C# file to inspect its architectural design and source code.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = file.content.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* File Tab / Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/50 border border-purple-800/40 rounded-lg text-purple-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono tracking-wide">{file.name}</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{file.path}</p>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-purple-900/40 border border-slate-700/60 hover:border-purple-500/50 text-slate-300 hover:text-purple-200 text-xs font-semibold rounded-lg transition-all duration-200 active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy C# Script</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Architecture & SOLID Principles Metadata */}
        <div className="p-5 border-b border-slate-900 bg-slate-950/60 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-0.5 rounded-md font-semibold">
              Class Description & Architecture
            </span>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">
              {file.explanation}
            </p>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-purple-400 bg-purple-950/40 border border-purple-800/30 px-2 py-0.5 rounded-md font-semibold">
              SOLID Principles Applied
            </span>
            <div className="flex flex-wrap gap-2 mt-2.5">
              {file.solidPrinciples.map((principle, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono"
                >
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>{principle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Content Container */}
        <div className="relative font-mono text-xs flex bg-[#030712] p-4 select-text">
          {/* Line Numbers */}
          <div className="text-slate-600 text-right pr-4 border-r border-slate-800/50 select-none mr-4 shrink-0 text-[11px] leading-relaxed">
            {Array.from({ length: lineCount }).map((_, i) => (
              <div key={i} className="h-5">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Actual Code View with custom visual highlights */}
          <div className="flex-1 overflow-x-auto custom-scrollbar text-[11px] leading-relaxed text-slate-300 whitespace-pre">
            {file.content.split('\n').map((line, i) => {
              // Extremely simple regex highlighting for nicer visual presentation
              let lineHtml = line;
              const keywords = [
                'using', 'namespace', 'public', 'private', 'protected', 'class', 'static', 'void', 'async', 'await', 'Task',
                'string', 'bool', 'int', 'float', 'interface', 'override', 'virtual', 'abstract', 'this', 'return',
                'new', 'null', 'typeof', 'foreach', 'if', 'else', 'try', 'catch', 'throw', 'get', 'set', 'readonly'
              ];
              const unityTypes = [
                'MonoBehaviour', 'GameObject', 'AudioSource', 'AudioClip', 'CanvasGroup', 'Button', 'Slider', 'Toggle',
                'TMP_Text', 'TMP_InputField', 'SceneManager', 'PlayerPrefs', 'Debug', 'Application', 'UserProfileData'
              ];

              // Check if line is a comment
              if (line.trim().startsWith('//') || line.trim().startsWith('///') || line.trim().startsWith('*')) {
                return (
                  <div key={i} className="h-5 text-emerald-500/80 italic font-mono">
                    {line}
                  </div>
                );
              }

              // Apply coloring for simple keywords & Unity types
              let coloredLine = line
                .replace(/([A-Z][a-zA-Z0-9_]*)(?=\s+\w+\s*=\s*|(?:\s*,\s*[A-Z][a-zA-Z0-9_]*)*\s*;)/g, '<span class="text-indigo-300">$1</span>') // type declaration
                .replace(/\[SerializeField\]|\[Header\]|\[RequireComponent\]/g, '<span class="text-yellow-500/80">$&</span>') // attribute
                .replace(/"[^"]*"/g, '<span class="text-amber-400">$&</span>'); // strings

              // Highlight keywords
              keywords.forEach(kw => {
                const regex = new RegExp(`\\b${kw}\\b`, 'g');
                coloredLine = coloredLine.replace(regex, `<span class="text-purple-400 font-semibold">${kw}</span>`);
              });

              // Highlight Unity Built-ins
              unityTypes.forEach(ut => {
                const regex = new RegExp(`\\b${ut}\\b`, 'g');
                coloredLine = coloredLine.replace(regex, `<span class="text-cyan-300">${ut}</span>`);
              });

              return (
                <div
                  key={i}
                  className="h-5 hover:bg-slate-900/40 px-1 rounded transition-colors"
                  dangerouslySetInnerHTML={{ __html: coloredLine || '&nbsp;' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer explanation note */}
      <div className="px-5 py-3.5 bg-slate-900/60 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-purple-500" />
          <span>Namespace: DSALegends</span>
        </div>
        <span>Target Framework: .NET Standard 2.1</span>
      </div>
    </div>
  );
}
