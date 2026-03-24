import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { MarketIndex } from '../types';

interface MarketGlobeProps {
  indices: MarketIndex[];
  onSelect?: (index: MarketIndex) => void;
}

export const MarketGlobe: React.FC<MarketGlobeProps> = ({ indices, onSelect }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove();

    try {
      const projection = d3.geoOrthographic()
        .scale(250)
        .translate([width / 2, height / 2])
        .rotate([0, -20]);

      const path = d3.geoPath().projection(projection);

      // Draw graticule
      const graticule = d3.geoGraticule();
      svg.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', '#1a1a1a')
        .attr('stroke-width', 0.5);

      // Draw globe outline
      svg.append('path')
        .datum({ type: 'Sphere' })
        .attr('class', 'sphere')
        .attr('d', path)
        .attr('fill', 'rgba(0,0,0,0.5)')
        .attr('stroke', '#333')
        .attr('stroke-width', 1);

      // Add points for indices
      const indexCoords: Record<string, [number, number]> = {
        'S&P 500': [-74.006, 40.7128],
        'NASDAQ': [-122.4194, 37.7749],
        'FTSE 100': [-0.1278, 51.5074],
        'DAX': [13.405, 52.52],
        'NIKKEI 225': [139.6917, 35.6895],
        'HANG SENG': [114.1694, 22.3193],
        'NIFTY 50': [77.209, 28.6139],
        'CAC 40': [2.3522, 48.8566],
      };

      const points = indices.map(idx => ({
        ...idx,
        coords: indexCoords[idx.symbol] || [0, 0]
      }));

      const pointsGroup = svg.append('g');

      const updatePoints = () => {
        const pointSelection = pointsGroup.selectAll('.market-point')
          .data(points);

        pointSelection.enter()
          .append('circle')
          .attr('class', 'market-point')
          .merge(pointSelection as any)
          .attr('cx', d => {
            const projected = projection(d.coords);
            return projected ? projected[0] : -100;
          })
          .attr('cy', d => {
            const projected = projection(d.coords);
            return projected ? projected[1] : -100;
          })
          .attr('r', d => {
            const projected = projection(d.coords);
            if (!projected) return 0;
            const geoPoint = d.coords;
            const rotate = projection.rotate();
            const center = [-rotate[0], -rotate[1]];
            const distance = d3.geoDistance(geoPoint, center);
            return distance < Math.PI / 2 ? 6 : 0;
          })
          .attr('fill', d => d.change >= 0 ? '#00FF00' : '#FF0000')
          .attr('stroke', '#fff')
          .attr('stroke-width', 1)
          .attr('cursor', 'pointer')
          .on('click', (event, d) => onSelect?.(d));

        pointSelection.exit().remove();
      };

      const timer = d3.timer((elapsed) => {
        const rotate = projection.rotate();
        projection.rotate([rotate[0] + 0.2, rotate[1]]);
        svg.selectAll('path').attr('d', path);
        updatePoints();
      });

      return () => timer.stop();
    } catch (error) {
      console.error("D3 Globe initialization failed:", error);
    }
  }, [indices, onSelect]);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      <svg ref={svgRef} className="w-full h-full max-w-[500px]" />
      <div className="absolute bottom-4 left-4 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_5px_#00FF00]" />
          <span className="text-[10px] uppercase font-bold text-zinc-500">Bullish Market</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-red rounded-full shadow-[0_0_5px_#FF0000]" />
          <span className="text-[10px] uppercase font-bold text-zinc-500">Bearish Market</span>
        </div>
      </div>
    </div>
  );
};
