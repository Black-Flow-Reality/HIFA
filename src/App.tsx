import { useState, useEffect } from 'react';

export default function App() {
  const [isTrainingMode, setIsTrainingMode] = useState<boolean>(true);

  // 1. Paste your new state line right here:
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "[00:00:00] Initializing HIFA GUI...",
    "[INFO] Awaiting user training data input."
  ]);

  const [isInferenceRunning, setIsInferenceRunning] = useState(false);
  const [hasInferenceResult, setHasInferenceResult] = useState(false);

  const [testImage, setTestImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      if (testImage) {
        URL.revokeObjectURL(testImage);
      }
    };
  }, [testImage]);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setConsoleLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [ERROR] File is not a valid image: ${file.name}`
      ]);
      return;
    }

    if (testImage) {
      URL.revokeObjectURL(testImage);
    }

    const url = URL.createObjectURL(file);
    setTestImage(url);
    setHasInferenceResult(false);

    setConsoleLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] [INFO] Loaded test image: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    ]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // 2. Paste your click function right here:
  const handleStartTraining = () => {
    setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [INFO] Starting training pipeline...`]);

    setTimeout(() => {
      setConsoleLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [SUCCESS] Epoch 1/10 completed. Loss: 0.234`]);
    }, 1500);
  };

  const handleRunInference = () => {
    if (isInferenceRunning) return;

    setIsInferenceRunning(true);
    setHasInferenceResult(false);

    setTimeout(() => {
      setIsInferenceRunning(false);
      setHasInferenceResult(true);
    }, 2000);
  };



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
            <div className="w-full h-full grid grid-cols-2 gap-6">

              {/* Left Column: Input Panel */}
              <div className="border border-slate-800 rounded-xl bg-slate-900/20 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Test Input</h3>
                  <p className="text-xs text-slate-500 mb-4">Upload a single image to test model inference.</p>
                </div>

                {testImage ? (
                  <div className="flex-1 relative border border-slate-800 rounded-lg bg-slate-950/50 overflow-hidden group flex items-center justify-center min-h-[160px]">
                    <img
                      src={testImage}
                      alt="Test preview"
                      className="max-w-full max-h-48 object-contain rounded-md"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 px-4 rounded transition shadow-lg">
                        Replace Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (testImage) URL.revokeObjectURL(testImage);
                          setTestImage(null);
                          setHasInferenceResult(false);
                          setConsoleLogs(prev => [
                            ...prev,
                            `[${new Date().toLocaleTimeString()}] [INFO] Removed test image.`
                          ]);
                        }}
                        className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold py-2 px-4 rounded transition shadow-lg"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex-1 min-h-[160px] border-2 border-dashed rounded-lg bg-slate-950/50 flex flex-col items-center justify-center p-4 cursor-pointer transition group ${isDragging
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-800 hover:border-indigo-500/30'
                      }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <span className={`text-2xl mb-2 transition-transform ${isDragging ? 'scale-125 text-indigo-400' : 'opacity-60 group-hover:scale-110'}`}>
                      📸
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {isDragging ? 'Drop image here' : 'Click or drag image to select'}
                    </span>
                    <span className="text-[10px] text-slate-600 mt-0.5">JPG or PNG up to 5MB</span>
                  </label>
                )}
              </div>

              {/* Right Column: Output Panel */}
              <div className="border border-slate-800 rounded-xl bg-slate-900/20 p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Inference Output</h3>
                  <p className="text-xs text-slate-500">Real-time object detection bounding boxes.</p>
                </div>

                {/* Output Screen Viewport */}
                <div className="flex-1 min-h-[200px] border border-slate-800 bg-black/60 rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {testImage && (
                    <img
                      src={testImage}
                      alt="Output Preview"
                      className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${isInferenceRunning ? 'opacity-40' : hasInferenceResult ? 'opacity-80' : 'opacity-20'
                        }`}
                    />
                  )}

                  {/* Subtle technical scanner crosshair styling */}
                  <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-slate-800"></div>
                  <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-slate-800"></div>
                  <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-slate-800"></div>
                  <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-slate-800"></div>

                  {/* Scan line overlay */}
                  {isInferenceRunning && (
                    <div className="absolute left-0 right-0 h-1 bg-indigo-500/80 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-scan"></div>
                  )}

                  {isInferenceRunning && (
                    <div className="flex flex-col items-center gap-3 z-10 bg-slate-950/80 px-4 py-3 rounded-lg border border-slate-800">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-indigo-400 text-xs font-mono animate-pulse">Analyzing image layers...</span>
                    </div>
                  )}

                  {!isInferenceRunning && !hasInferenceResult && (
                    <span className="text-slate-600 text-xs font-mono select-none z-10 bg-slate-950/60 px-3 py-1.5 rounded border border-slate-800/40">
                      Awaiting inference run...
                    </span>
                  )}

                  {!isInferenceRunning && hasInferenceResult && (
                    <div className="flex flex-col items-center gap-2 text-emerald-400 z-10 bg-slate-950/85 p-4 rounded-lg border border-emerald-500/30 shadow-lg shadow-emerald-950/20">
                      <span className="text-2xl">🎯</span>
                      <span className="text-xs font-mono">Inference complete! 4 objects detected.</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      {/* 3. RIGHT PANEL: ML Action Buttons & Terminal Output */}
      <aside className="w-80 border-l border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Execution</h2>

          <button
            onClick={handleStartTraining}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2"
          >
            <span>▶</span> Fit / Train Model
          </button>

          <button
            onClick={handleRunInference}
            disabled={isTrainingMode || isInferenceRunning || !testImage}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            {!testImage && !isTrainingMode
              ? "Upload Image to Run"
              : isInferenceRunning
                ? "Running AI Model..."
                : "Run Prediction"
            }
          </button>
        </div>

        {/* Mock Terminal Log */}
        <div className="h-48 flex flex-col border border-slate-800 bg-slate-950 rounded-lg overflow-hidden font-mono text-xs">
          <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 text-slate-400 flex justify-between items-center">
            <span>Console Output</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <div className="p-3 flex-1 overflow-y-auto text-slate-400 space-y-1">
            <div className="p-3 flex-1 overflow-y-auto text-slate-400 space-y-1">
              {consoleLogs.map((log, index) => (
                <p
                  key={index}
                  className={log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-400'}
                >
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}