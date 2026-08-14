import React, { useState } from 'react';
import { Folder, FolderOpen, FileCode, CheckSquare, Play, Shield, Music, Disc } from 'lucide-react';
import { UNITY_FOLDERS, UNITY_FILES } from '../unityProjectData';
import { UnityFile } from '../types';

interface FolderTreeProps {
  onSelectFile: (file: UnityFile) => void;
  selectedFile: UnityFile | null;
}

export default function FolderTree({ onSelectFile, selectedFile }: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    'Assets': true,
    'Assets/Scripts': true,
    'Assets/Scripts/Core': true,
    'Assets/Scripts/UI': true,
    'Assets/Scripts/Audio': true,
    'Assets/Scripts/Firebase': true,
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Helper to build recursive folder structures
  const buildTree = () => {
    const root: { name: string; path: string; folders: any[]; files: UnityFile[] } = {
      name: 'Assets',
      path: 'Assets',
      folders: [],
      files: [],
    };

    // Populate standard folders
    const allFolders = [...UNITY_FOLDERS].sort((a, b) => a.localeCompare(b));
    const foldersMap: Record<string, any> = { 'Assets': root };

    allFolders.forEach((folderPath) => {
      if (folderPath === 'Assets') return;
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');

      const folderObj = {
        name: folderName,
        path: folderPath,
        folders: [],
        files: [],
      };

      foldersMap[folderPath] = folderObj;

      if (foldersMap[parentPath]) {
        foldersMap[parentPath].folders.push(folderObj);
      }
    });

    // Populate files
    UNITY_FILES.forEach((file) => {
      const parts = file.path.split('/');
      const parentPath = parts.slice(0, -1).join('/');
      if (foldersMap[parentPath]) {
        foldersMap[parentPath].files.push(file);
      }
    });

    return root;
  };

  const treeData = buildTree();

  const getFolderIcon = (path: string) => {
    if (path.includes('Scenes')) return <Play className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />;
    if (path.includes('Firebase')) return <Shield className="w-4 h-4 text-orange-400 mr-1.5 shrink-0" />;
    if (path.includes('Audio')) return <Music className="w-4 h-4 text-indigo-400 mr-1.5 shrink-0" />;
    if (path.includes('Animations')) return <Disc className="w-4 h-4 text-pink-400 mr-1.5 shrink-0" />;
    
    return expandedFolders[path] ? (
      <FolderOpen className="w-4 h-4 text-cyan-400 mr-1.5 shrink-0" />
    ) : (
      <Folder className="w-4 h-4 text-cyan-500 mr-1.5 shrink-0" />
    );
  };

  const renderNode = (node: any, depth = 0) => {
    const hasContents = node.folders.length > 0 || node.files.length > 0;
    const isExpanded = expandedFolders[node.path];

    return (
      <div key={node.path} className="select-none">
        {/* Folder Header */}
        <div
          onClick={() => toggleFolder(node.path)}
          className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer hover:bg-slate-800 transition-colors text-sm font-medium ${
            depth === 0 ? 'text-slate-100 bg-slate-900/50' : 'text-slate-300'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {getFolderIcon(node.path)}
          <span className="truncate">{node.name}</span>
          {hasContents && (
            <span className="ml-auto text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded-full font-mono">
              {node.folders.length + node.files.length}
            </span>
          )}
        </div>

        {/* Folder Contents */}
        {isExpanded && (
          <div className="mt-0.5 border-l border-slate-800 ml-3.5 pl-1">
            {/* Child Folders */}
            {node.folders.map((childFolder: any) => renderNode(childFolder, depth + 1))}

            {/* Child Files */}
            {node.files.map((file: UnityFile) => {
              const isSelected = selectedFile?.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => onSelectFile(file)}
                  className={`flex items-center py-1.5 px-2 rounded-md cursor-pointer transition-all text-xs border ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/50 text-purple-200 font-semibold glow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
                >
                  <FileCode className={`w-3.5 h-3.5 mr-1.5 shrink-0 ${isSelected ? 'text-purple-400' : 'text-slate-500'}`} />
                  <span className="truncate">{file.name}</span>
                </div>
              );
            })}

            {/* Unity Scene Placeholder inside Assets/Scenes */}
            {node.name === 'Scenes' && (
              <div
                className="flex items-center py-1.5 px-2 rounded-md text-xs text-slate-500 italic"
                style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                <span>MainMenu.unity</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
      {/* Title Bar */}
      <div className="flex items-center px-4 py-3 bg-slate-900 border-b border-slate-800/60 justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 font-mono">Unity Project Explorer</span>
        </div>
        <div className="text-[10px] font-mono bg-purple-950/50 border border-purple-800/40 text-purple-300 px-2 py-0.5 rounded-md">
          Unity 6 LTS
        </div>
      </div>

      {/* Directory Browser */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {renderNode(treeData)}
      </div>
    </div>
  );
}
