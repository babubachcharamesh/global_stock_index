import React from 'react';
import { MarketSentiment } from '../types';
import { motion } from 'motion/react';
import { Brain, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../lib/utils';

interface SentimentPanelProps {
  sentiment: MarketSentiment;
  isLoading?: boolean;
}

export const SentimentPanel: React.FC<SentimentPanelProps> = ({ sentiment, isLoading }) => {
  const getSentimentIcon = () => {
    switch (sentiment.overall) {
      case 'Bullish': return <TrendingUp className="text-neon-green" />;
      case 'Bearish': return <TrendingDown className="text-neon-red" />;
      default: return <Minus className="text-zinc-500" />;
    }
  };

  const getRiskColor = () => {
    switch (sentiment.riskLevel) {
      case 'Low': return 'text-neon-green';
      case 'Moderate': return 'text-yellow-500';
      case 'High': return 'text-neon-red';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="p-6 bg-zinc-950 border border-zinc-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <Brain size={80} />
      </div>

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-zinc-900 border border-zinc-800">
          <Brain size={20} className="text-neon-green" />
        </div>
        <h2 className="text-xl font-bold tracking-tighter uppercase">AI Market Sentiment</h2>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-zinc-900 rounded w-3/4" />
          <div className="h-4 bg-zinc-900 rounded w-1/2" />
          <div className="h-20 bg-zinc-900 rounded w-full" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800">
            <div className="flex items-center space-x-3">
              {getSentimentIcon()}
              <span className="font-bold uppercase tracking-widest">{sentiment.overall}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle size={14} className={getRiskColor()} />
              <span className={cn("text-xs font-bold uppercase tracking-widest", getRiskColor())}>
                Risk: {sentiment.riskLevel}
              </span>
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium italic">
            "{sentiment.summary}"
          </p>

          <div>
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">Top Performers</h4>
            <div className="flex flex-wrap gap-2">
              {sentiment.topPerformers.map((performer, i) => (
                <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-neon-green">
                  {performer}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
