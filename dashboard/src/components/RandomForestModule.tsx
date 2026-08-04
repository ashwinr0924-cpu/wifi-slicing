import React, { useState } from 'react';
import { ModelMetrics } from '../types/network';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Layers, 
  BarChart, 
  Grid, 
  Zap, 
  Server, 
  HelpCircle,
  FileCode,
  Activity
} from 'lucide-react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface RFProps {
  metrics: ModelMetrics;
}

export const RandomForestModule: React.FC<RFProps> = ({ metrics }) => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  // Sample live flow prediction probabilities
  const samplePredictionProbs = [
    { class: 'Gaming', prob: 97.4, color: '#22C55E' },
    { class: 'VoIP', prob: 1.8, color: '#06B6D4' },
    { class: 'Web Browsing', prob: 0.5, color: '#F59E0B' },
    { class: 'Streaming', prob: 0.2, color: '#2563EB' },
    { class: 'Background', prob: 0.1, color: '#64748B' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner & Status Panel */}
      <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Random Forest Classifier Engine (Scikit-Learn)
                </h2>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded font-semibold">
                  STATUS: HEALTHY
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Real-time multi-class flow metadata vector prediction engine on edge router.
              </p>
            </div>
          </div>

          {/* Model Status Indicators */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-gray-200 px-2.5 py-1 rounded text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Training Dataset Loaded</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-gray-200 px-2.5 py-1 rounded text-slate-700 font-medium">
              <Activity className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Inference Running</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-gray-200 px-2.5 py-1 rounded text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>No Errors (0 Failures)</span>
            </div>
          </div>
        </div>

        {/* 4 Core ML Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          <div className="bg-slate-50 border border-gray-200 rounded p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Model Accuracy</span>
            <span className="text-2xl font-extrabold text-blue-600 font-mono tracking-tight">{metrics.accuracy}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">5-Fold Cross Validation</span>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Prediction Time</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono tracking-tight">{metrics.predictionTimeMs} ms</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Inference Overhead</span>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Number of Trees</span>
            <span className="text-2xl font-extrabold text-slate-800 font-mono tracking-tight">{metrics.treesCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">n_estimators=100</span>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Feature Dimensions</span>
            <span className="text-2xl font-extrabold text-indigo-600 font-mono tracking-tight">12 Features</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">2-Second Window Vector</span>
          </div>
        </div>
      </div>

      {/* Grid: Feature Importance & Live Prediction Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Feature Importance Bar Chart */}
        <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <BarChart className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Feature Importance Breakdown (%)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Gini Impurity Metric</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                layout="vertical"
                data={metrics.featureImportance}
                margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
              >
                <XAxis type="number" domain={[0, 30]} unit="%" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis 
                  type="category" 
                  dataKey="label" 
                  tick={{ fontSize: 11, fill: '#334155' }} 
                  width={130}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Importance']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', fontSize: '12px' }}
                />
                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                  {metrics.featureImportance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2563EB' : index === 1 ? '#3B82F6' : '#60A5FA'} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Top Feature: </span>
            <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">pkt_count</code> (24.5%) and <code className="text-blue-700 bg-blue-50 px-1 py-0.5 rounded font-mono">byte_count</code> (21.2%) drive 45.7% of multi-class classification.
          </div>
        </div>

        {/* Live Prediction Probability Breakdown */}
        <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Prediction Probability Distribution
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              Active Flow: 192.168.137.12 (Gaming)
            </span>
          </div>

          <div className="space-y-3 py-2">
            {samplePredictionProbs.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span>{item.class}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-900">{item.prob}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.prob}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 bg-slate-50 p-2.5 rounded border">
            <div className="flex items-start space-x-2 text-[11px] text-slate-600">
              <FileCode className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Scikit-Learn Python Pipeline:</span>
                <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                  model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Confusion Matrix Table */}
      <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <Grid className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Multiclass Confusion Matrix (Test Set Validation)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Horizontal: Predicted | Vertical: Actual Ground Truth
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600">
                <th className="px-3 py-2 text-left font-semibold border border-gray-200">Actual \ Predicted</th>
                <th className="px-3 py-2 font-semibold border border-gray-200 text-emerald-700">Gaming</th>
                <th className="px-3 py-2 font-semibold border border-gray-200 text-cyan-700">VoIP</th>
                <th className="px-3 py-2 font-semibold border border-gray-200 text-blue-700">Streaming</th>
                <th className="px-3 py-2 font-semibold border border-gray-200 text-slate-700">Background</th>
                <th className="px-3 py-2 font-semibold border border-gray-200 text-amber-700">Browsing</th>
              </tr>
            </thead>
            <tbody>
              {metrics.confusionMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-bold text-slate-800 text-left border border-gray-200 bg-slate-50">
                    {row.actual}
                  </td>
                  <td className={`px-3 py-2 border border-gray-200 font-mono ${row.actual === 'Gaming' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-slate-500'}`}>
                    {row.Gaming}
                  </td>
                  <td className={`px-3 py-2 border border-gray-200 font-mono ${row.actual === 'VoIP' ? 'bg-cyan-100 text-cyan-900 font-bold' : 'text-slate-500'}`}>
                    {row.VoIP}
                  </td>
                  <td className={`px-3 py-2 border border-gray-200 font-mono ${row.actual === 'Streaming' ? 'bg-blue-100 text-blue-900 font-bold' : 'text-slate-500'}`}>
                    {row.Streaming}
                  </td>
                  <td className={`px-3 py-2 border border-gray-200 font-mono ${row.actual === 'Background' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {row.Background}
                  </td>
                  <td className={`px-3 py-2 border border-gray-200 font-mono ${row.actual === 'Browsing' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-slate-500'}`}>
                    {row.Browsing}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
