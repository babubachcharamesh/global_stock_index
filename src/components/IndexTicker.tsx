import React from 'react';
import { MarketIndex } from '../types';
import { formatNumber, formatPercent, cn } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface IndexTickerProps {
  indices: MarketIndex[];
}

export const IndexTicker: React.FC<IndexTickerProps> = ({ indices }) => {
  // Duplicate indices for seamless marquee
  const displayIndices = [...indices, ...indices];

  return (
    <div className="w-full bg-ink border-b border-zinc-800 py-2 overflow-hidden">
      <div className="marquee">
        {displayIndices.map((index, i) => (
          <div key={`${index.symbol}-${i}`} className="flex items-center space-x-4 px-8 border-r border-zinc-800 last:border-r-0">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{index.symbol}</span>
            <span className="text-sm font-bold">{formatNumber(index.value)}</span>
            <span className={cn(
              "flex items-center text-xs font-bold",
              index.change >= 0 ? "text-neon-green" : "text-neon-red"
            )}>
              {index.change >= 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
              {formatPercent(index.changePercent)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
