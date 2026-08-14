import React, { useState } from 'react';
import { Package, DownloadCloud, Trash2, Cpu, FileCode, CheckCircle, RefreshCw, BarChart, Info } from 'lucide-react';
import PremiumAudioManager from '../lib/audioManager';

interface AddressableAsset {
  key: string;
  name: string;
  type: 'Prefab' | 'AudioClip' | 'Texture2D' | 'Shader';
  group: 'Characters' | 'Audio' | 'VFX' | 'UI';
  sizeMb: number;
  status: 'Unloaded' | 'Loading' | 'Loaded';
  progress: number;
  memoryAddress: string;
}

export default function AddressablesInspector() {
  const [assets, setAssets] = useState<AddressableAsset[]>([
    { key: 'prefabs/sort_spectre', name: 'SortSpectre_Avatar_Model.prefab', type: 'Prefab', group: 'Characters', sizeMb: 24.8, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' },
    { key: 'prefabs/sort_sorcerer', name: 'SortSorcerer_Hero_Model.prefab', type: 'Prefab', group: 'Characters', sizeMb: 28.5, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' },
    { key: 'audio/synth_bgm_loop', name: 'Ambient_Space_Loop.wav', type: 'AudioClip', group: 'Audio', sizeMb: 14.2, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' },
    { key: 'audio/sfx_ability_plasma', name: 'SFX_Pulsar_Burst.wav', type: 'AudioClip', group: 'Audio', sizeMb: 2.1, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' },
    { key: 'vfx/matrix_rain_particles', name: 'VFX_CodeRain_Storm.prefab', type: 'Prefab', group: 'VFX', sizeMb: 8.4, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' },
    { key: 'vfx/bloom_glares', name: 'HDR_Bloom_Optics.shader', type: 'Shader', group: 'VFX', sizeMb: 0.6, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' },
    { key: 'ui/cyber_glass_skin', name: 'CyberGlass_Atlas_Map.png', type: 'Texture2D', group: 'UI', sizeMb: 12.0, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' }
  ]);

  const [compileLogs, setCompileLogs] = useState<string[]>([
    '> [Addressables Editor] Standby. Select bundle compression or load assets asynchonously.'
  ]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compressionMode, setCompressionMode] = useState<'LZ4' | 'LZMA' | 'Uncompressed'>('LZ4');

  // Load a single asset asynchronously mimicking Addressables.LoadAssetAsync<T>()
  const loadAssetAsync = (key: string) => {
    PremiumAudioManager.getInstance().playSFX('click');
    setAssets(prev => prev.map(a => {
      if (a.key === key && a.status === 'Unloaded') {
        // Trigger simulated loading progress interval
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setAssets(current => current.map(item => {
            if (item.key === key) {
              if (progress >= 100) {
                clearInterval(interval);
                // Assign a randomized memory pointer Address
                const randomAddress = '0x' + Math.floor(Math.random() * 4294967295).toString(16).toUpperCase();
                PremiumAudioManager.getInstance().playSFX('win');
                return { ...item, status: 'Loaded', progress: 100, memoryAddress: randomAddress };
              }
              return { ...item, status: 'Loading', progress };
            }
            return item;
          }));
        }, 120);

        return { ...a, status: 'Loading', progress: 0 };
      }
      return a;
    }));

    setCompileLogs(prev => [
      ...prev,
      `> [Async Loader] Addressables.LoadAssetAsync<${assets.find(a => a.key === key)?.type}>("${key}") initiated...`
    ]);
  };

  // Unload and release reference mimicking Addressables.Release()
  const releaseAsset = (key: string) => {
    PremiumAudioManager.getInstance().playSFX('powerdown');
    setAssets(prev => prev.map(a => {
      if (a.key === key) {
        return { ...a, status: 'Unloaded', progress: 0, memoryAddress: '0x00000000' };
      }
      return a;
    }));

    setCompileLogs(prev => [
      ...prev,
      `> [Async Loader] Addressables.Release() called. Cleaned instance memory for target: ${key}`
    ]);
  };

  // Compile full Addressable groups to CDN asset bundles
  const compileAddressables = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    PremiumAudioManager.getInstance().playSFX('transition');

    setCompileLogs([
      `> [Builder] Starting full Addressables build process with ${compressionMode} compression...`,
      `> [Builder] Grouping 4 distinct asset buckets: Characters, Audio, VFX, and UI...`
    ]);

    setTimeout(() => {
      setCompileLogs(prev => [
        ...prev,
        `> [Builder] Compressing texture atlases and binary shader kernels...`,
        `> [Builder] Hashing dynamic GUID links and mapping local Addressables Catalog JSON file...`
      ]);
    }, 600);

    setTimeout(() => {
      setIsCompiling(false);
      PremiumAudioManager.getInstance().playSFX('win');
      setCompileLogs(prev => [
        ...prev,
        `> [Builder] Catalogs mapped! Produced 4 local asset bundle chunks.`,
        `> [Builder] Build Success! Sizing optimized. Mode: ${compressionMode}. Ready for runtime CDN handshakes.`
      ]);
    }, 1400);
  };

  // Memory Metrics
  const activeLoadedAssets = assets.filter(a => a.status === 'Loaded');
  const totalMemoryAllocMb = activeLoadedAssets.reduce((acc, current) => acc + current.sizeMb, 0).toFixed(1);

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 md:p-6 space-y-6">
      
      {/* Title section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-950/40 border border-purple-500/30 text-purple-400 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 font-mono tracking-wide">
              UNITY ADDRESSABLES & ASSETS PIPELINE
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-mono">
              Simulate high-performance async loading, reference-counting, and catalog compilation.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <select 
            value={compressionMode}
            onChange={(e) => setCompressionMode(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-bold text-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="LZ4">LZ4 Chunked (Fast Loading)</option>
            <option value="LZMA">LZMA Compressed (Small Bundle Size)</option>
            <option value="Uncompressed">Uncompressed (Zero CPU Overhead)</option>
          </select>

          <button
            type="button"
            onClick={compileAddressables}
            disabled={isCompiling}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/40 text-purple-100 text-[10px] font-bold font-mono rounded-xl transition-all disabled:opacity-50 flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isCompiling ? 'animate-spin' : ''}`} />
            <span>{isCompiling ? 'BUILDING...' : 'COMPILE BUNDLES'}</span>
          </button>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Left pane: Asset catalogue list */}
        <div className="col-span-12 lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-slate-500 uppercase px-1">
            <span>Asset Catalog Key</span>
            <span>Unload / Load Async (Addressables Catalog)</span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1.5 custom-scrollbar">
            {assets.map((asset) => {
              const isUnloaded = asset.status === 'Unloaded';
              const isLoading = asset.status === 'Loading';
              const isLoaded = asset.status === 'Loaded';

              return (
                <div 
                  key={asset.key} 
                  className={`p-3 bg-slate-900/40 border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                    isLoaded 
                      ? 'border-purple-500/30 bg-purple-950/10' 
                      : 'border-slate-850'
                  }`}
                >
                  <div className="flex items-start gap-2.5 overflow-hidden">
                    <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isLoaded ? 'text-purple-400' : 'text-slate-500'}`} />
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold font-mono text-slate-200 truncate">{asset.name}</span>
                        <span className="text-[8px] px-1 bg-slate-950 text-slate-500 border border-slate-850 rounded">
                          {asset.group}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[9px] font-mono text-slate-500">
                        <span>Key: <strong className="text-slate-400">{asset.key}</strong></span>
                        <span>•</span>
                        <span>Size: <strong className="text-slate-400">{asset.sizeMb} MB</strong></span>
                        {isLoaded && (
                          <>
                            <span>•</span>
                            <span>Ptr: <strong className="text-cyan-400 font-bold">{asset.memoryAddress}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 md:self-center">
                    {/* Progress tracking line */}
                    {isLoading && (
                      <div className="w-[80px] bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                        <div 
                          className="bg-purple-500 h-full transition-all" 
                          style={{ width: `${asset.progress}%` }}
                        />
                      </div>
                    )}

                    {isUnloaded && (
                      <button
                        onClick={() => loadAssetAsync(asset.key)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-slate-100 text-[10px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 border border-slate-700/60"
                      >
                        <DownloadCloud className="w-3 h-3 text-cyan-400" />
                        <span>LOAD ASYNC</span>
                      </button>
                    )}

                    {isLoading && (
                      <span className="text-[9px] font-mono text-purple-400 font-bold animate-pulse">
                        LOADING {asset.progress}%
                      </span>
                    )}

                    {isLoaded && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 border border-emerald-900/60 px-1.5 py-0.5 rounded-md">
                          <CheckCircle className="w-2.5 h-2.5" />
                          <span>LOADED</span>
                        </span>
                        <button
                          onClick={() => releaseAsset(asset.key)}
                          title="Release resource references"
                          className="p-1 bg-slate-800 hover:bg-red-950/40 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-300 rounded-lg transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right pane: Memory usage and console logs */}
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-between gap-4">
          
          {/* Sizing/Memory HUD widget */}
          <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-2xl space-y-3 font-mono">
            <span className="text-[9px] text-slate-500 font-bold uppercase block">RAM Allocation Matrix</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-900">
                <span className="text-[8px] text-slate-500 block">RAM COMMITTED</span>
                <span className="text-sm font-extrabold text-cyan-400 mt-0.5 block">{totalMemoryAllocMb} MB</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-900">
                <span className="text-[8px] text-slate-500 block">HANDLES ACTIVE</span>
                <span className="text-sm font-extrabold text-purple-400 mt-0.5 block">{activeLoadedAssets.length} Refs</span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-2 rounded-xl text-[9px] text-slate-400 leading-relaxed space-y-1">
              <div className="flex items-center gap-1 text-slate-300">
                <Info className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="font-bold">Addressables Memory Audit:</span>
              </div>
              <p className="text-[8px]">
                Assets loaded through Addressables use reference counting. Once count drops to zero, the assets automatically flush from the VRAM, preventing memory leaks and game lagging.
              </p>
            </div>
          </div>

          {/* Compiler Terminal logs */}
          <div className="flex-1 bg-slate-950 border border-slate-900 p-3 rounded-2xl flex flex-col min-h-[140px] justify-between">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 shrink-0">
              <div className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-400" />
                <span className="text-[8px] font-bold text-slate-400 uppercase font-mono">LOG TRACE SHELL</span>
              </div>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            </div>

            <div className="flex-1 overflow-y-auto max-h-[130px] font-mono text-[8px] text-slate-500 py-2 space-y-1 custom-scrollbar leading-relaxed">
              {compileLogs.map((log, index) => (
                <div key={index} className={index === compileLogs.length - 1 ? 'text-purple-300' : ''}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
