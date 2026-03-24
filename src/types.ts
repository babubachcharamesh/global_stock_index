export interface MarketIndex {
  symbol: string;
  name: string;
  country: string;
  region: 'Americas' | 'Europe' | 'Asia-Pacific' | 'Middle East/Africa';
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  history: { date: string; value: number }[];
}

export interface MarketSentiment {
  overall: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  topPerformers: string[];
  riskLevel: 'Low' | 'Moderate' | 'High';
}
