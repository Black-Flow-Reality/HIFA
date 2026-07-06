import React, { useState } from 'react';

export default function App() {
  const [isTrainingMode, setIsTrainingMode] = useState<boolean>(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* 1. LEFT SIDEBAR: Model & Dataset Management */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-indigo-400 mb-6">HIFA INTERFACE</h1>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold uppercase block mb-1">Active Model</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                <option>Computer Vision (Detection)</option>
              </select>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 rounded p-3">
              <span className="text-xs text-slate-400 block">Loaded Dataset</span>
              <span className="text-lg font-medium">0 Images</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 rounded text-sm font-medium transition">
            Load Model
          </button>
          <button className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 rounded text-sm font-medium transition">
            Save Model
          </button>
        </div>
      </aside>

      {/* 2. CENTER PANEL: Main Interactive Work Area */}
      <main className="flex-1 flex flex-col bg-slate-950">
        {/* Mode Toggler Header */}
        <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/40">
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsTrainingMode(true)}
              className={`px-4 py-1 rounded text-sm font-medium transition ${isTrainingMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              Training Mode
            </button>
            <button 
              onClick={() => setIsTrainingMode(false)}
              className={`px-4 py-1 rounded text-sm font-medium transition ${!isTrainingMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              Prediction Mode
            </button>
          </div>
          <span className="text-xs text-slate-500 font-mono">Status: Idle</span>
        </header>

        {/* Dynamic Workspace Container */}
        <div className="flex-1 p-6 flex items-center justify-center">
          {isTrainingMode ? (
            /* Training Mode Dropzone Skeleton */
            <div className="w-full h-full border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-900/20 transition group">
              <span className="text-indigo-400 text-4xl mb-2 group-hover:scale-110 transition-transform">📁</span>
              <p className="text-sm text-slate-300 font-medium">Drag & drop training images here</p>
              <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG formats</p>
            </div>
          ) : (
            /* Prediction Mode Split Screen Skeleton */
            <div className="w-full h-full grid grid-cols-2 gap-4">
              <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-4 flex items-center justify-center text-slate-500 text-sm">
                [ Input Test Image ]
              </div>
              <div className="border border-slate-800 rounded-xl bg-slate-900/40 p-4 flex items-center justify-center text-slate-500 text-sm">
                [ Model Prediction Output ]
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. RIGHT PANEL: ML Action Buttons & Terminal Output */}
      <aside className="w-80 border-l border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Execution</h2>
          
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2">
            <span>▶</span> Fit / Train Model
          </button>
          
          <button 
            disabled={isTrainingMode}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition">
            Run Prediction
          </button>
        </div>

        {/* Mock Terminal Log */}
        <div className="h-48 flex flex-col border border-slate-800 bg-slate-950 rounded-lg overflow-hidden font-mono text-xs">
          <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 text-slate-400 flex justify-between items-center">
            <span>Console Output</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto text-slate-400 space-y-1">
            <p className="text-slate-600">[00:00:00] Initializing HIFA GUI...</p>
            <p className="text-slate-500">[INFO] Awaiting user training data input.</p>
          </div>
        </div>
      </aside>

    </div>
  );
}