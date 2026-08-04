import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-3 px-6 text-xs text-slate-500 mt-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-800">CIH'26 Hackathon Project</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-slate-600">Version 1.0</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">AI-Driven Adaptive Network Optimizer</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="text-slate-400">Built using:</span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">React</span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">TypeScript</span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">TailwindCSS</span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">Recharts</span>
          <span className="bg-slate-100 border border-slate-200 text-slate-700 font-mono px-1.5 py-0.5 rounded">Lucide Icons</span>
          <span className="bg-blue-50 border border-blue-200 text-blue-800 font-mono px-1.5 py-0.5 rounded font-semibold">Random Forest (Scikit-Learn)</span>
        </div>
      </div>
    </footer>
  );
};
