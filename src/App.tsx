import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { MarketIndex, MarketSentiment } from './types';
import { INITIAL_INDICES } from './data/mockData';
import { analyzeMarketSentiment } from './services/geminiService';
import { IndexTicker } from './components/IndexTicker';
import { IndexCard } from './components/IndexCard';
import { MarketGlobe } from './components/MarketGlobe';
import { SentimentPanel } from './components/SentimentPanel';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, RefreshCw, Activity, Globe, LayoutGrid, List } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [sentiment, setSentiment] = useState<MarketSentiment | null>(null);
  const [isLoadingSentiment, setIsLoadingSentiment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    console.log("Dashboard mounted. Initial indices:", indices.length);
  }, []);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(idx => {
        const volatility = 0.002;
        const change = idx.value * (Math.random() * volatility * 2 - volatility);
        const newValue = idx.value + change;
        const newChange = newValue - (idx.history[idx.history.length - 2]?.value || idx.value);
        const newChangePercent = (newChange / idx.value) * 100;

        return {
          ...idx,
          value: newValue,
          change: newChange,
          changePercent: newChangePercent,
          lastUpdated: new Date().toISOString(),
          history: [...idx.history.slice(1), { date: new Date().toISOString(), value: newValue }]
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch sentiment on load
  useEffect(() => {
    const fetchSentiment = async () => {
      setIsLoadingSentiment(true);
      try {
        const result = await analyzeMarketSentiment(indices);
        setSentiment(result);
      } catch (err) {
        console.error("Failed to fetch sentiment:", err);
      } finally {
        setIsLoadingSentiment(false);
      }
    };

    fetchSentiment();
  }, []);

  const filteredIndices = useMemo(() => {
    return indices.filter(idx => {
      const matchesSearch = idx.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           idx.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = selectedRegion === 'All' || idx.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [indices, searchQuery, selectedRegion]);

  const regions = ['All', 'Americas', 'Europe', 'Asia-Pacific', 'Middle East/Africa'];

  return (
    <div className="min-h-screen flex flex-col bg-ink selection:bg-neon-green selection:text-ink text-paper">
      {/* Top Navigation / Ticker */}
      <IndexTicker indices={indices} />

      {/* Header */}
      <header className="px-6 py-8 border-b border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Activity size={16} className="text-neon-green" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Real-Time Global Market Intelligence</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">
            Index<span className="text-neon-green">Pulse</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-neon-green transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="SEARCH INDICES..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 px-10 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-neon-green transition-all w-64"
            />
          </div>
          
          <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-zinc-800 text-neon-green" : "text-zinc-600 hover:text-paper")}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 transition-colors", viewMode === 'list' ? "bg-zinc-800 text-neon-green" : "text-zinc-600 hover:text-paper")}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-px bg-zinc-900">
        
        {/* Left Sidebar: Market Pulse & AI */}
        <aside className="lg:col-span-4 bg-ink p-6 space-y-8 border-r border-zinc-900">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Global Heatmap</h2>
              <Globe size={14} className="text-zinc-700" />
            </div>
            <div className="bg-zinc-950 border border-zinc-900 p-4 min-h-[300px] flex items-center justify-center">
              {/* <MarketGlobe indices={indices} onSelect={setSelectedIndex} /> */}
              <div className="text-zinc-700 text-[10px] uppercase font-bold">Globe Visualization Loading...</div>
            </div>
          </section>

          <section>
            {sentiment && <SentimentPanel sentiment={sentiment} isLoading={isLoadingSentiment} />}
          </section>

          <section className="p-6 bg-zinc-950 border border-zinc-800">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Market Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">NYSE / NASDAQ</span>
                <span className="text-xs font-bold text-neon-green uppercase">Open</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">LSE / EURONEXT</span>
                <span className="text-xs font-bold text-neon-red uppercase">Closed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">TSE / HKEX</span>
                <span className="text-xs font-bold text-neon-red uppercase">Closed</span>
              </div>
            </div>
          </section>
        </aside>

        {/* Right Content: Index Grid */}
        <div className="lg:col-span-8 bg-ink p-6">
          {/* Region Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={cn(
                  "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all",
                  selectedRegion === region 
                    ? "bg-neon-green border-neon-green text-ink" 
                    : "bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-paper"
                )}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Market Globe Visualization */}
          <div className="mb-8 bg-zinc-950 border border-zinc-800 p-6 relative overflow-hidden group">
            <div className="absolute top-4 left-4 z-10">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1">Global Distribution</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                <span className="text-[10px] font-bold text-neon-green uppercase tracking-widest">Live Network Active</span>
              </div>
            </div>
            <MarketGlobe 
              indices={filteredIndices} 
              onSelect={(idx) => {
                setSearchQuery(idx.symbol);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
            />
          </div>

          {/* Indices Display */}
          <div className={cn(
            "grid gap-6",
            viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
          )}>
            <AnimatePresence mode="popLayout">
              {filteredIndices.map((index) => (
                <IndexCard 
                  key={index.symbol} 
                  index={index} 
                  isSelected={selectedIndex?.symbol === index.symbol}
                  onClick={() => setSelectedIndex(index)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredIndices.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-zinc-600 border border-dashed border-zinc-800">
              <Search size={40} className="mb-4 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">No indices found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="px-6 py-3 bg-zinc-950 border-t border-zinc-900 flex justify-between items-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse" />
            <span>Live Stream Active</span>
          </div>
          <span>Latency: 24ms</span>
        </div>
        <div className="flex items-center space-x-6">
          <span>System Time: {new Date().toLocaleTimeString()}</span>
          <div className="flex items-center space-x-1">
            <RefreshCw size={10} />
            <span>Auto-Refresh: 3s</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
