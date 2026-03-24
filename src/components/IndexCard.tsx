import React from 'react';
import { MarketIndex } from '../types';
import { formatNumber, formatPercent, cn } from '../lib/utils';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Globe } from 'lucide-react';

interface IndexCardProps {
  index: MarketIndex;
  onClick?: () => void;
  isSelected?: boolean;
}

export const IndexCard: React.FC<IndexCardProps> = ({ index, onClick, isSelected }) => {
  const isPositive = index.change >= 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative p-6 bg-zinc-950 border border-zinc-800 cursor-pointer transition-all duration-300",
        isSelected ? "border-neon-green ring-1 ring-neon-green" : "hover:border-zinc-500"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Globe size={12} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{index.country}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tighter">{index.symbol}</h3>
          <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider truncate max-w-[150px]">{index.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tracking-tighter">{formatNumber(index.value)}</div>
          <div className={cn(
            "flex items-center justify-end text-xs font-bold",
            isPositive ? "text-neon-green" : "text-neon-red"
          )}>
            {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {formatPercent(index.changePercent)}
          </div>
        </div>
      </div>

      <div className="h-20 w-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={index.history}>
            <YAxis hide domain={['auto', 'auto']} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? "#00FF00" : "#FF0000"}
              strokeWidth={2}
              dot={false}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isSelected && (
        <motion.div
          layoutId="active-border"
          className="absolute inset-0 border-2 border-neon-green pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  );
};
