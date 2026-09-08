import React from 'react';
import type { MindmapNode } from '../../types';

/** Layout actual lesson nodes left to right; the full labels remain in the accessible tree. */
export const LessonMindmap: React.FC<{ root: MindmapNode }> = ({ root }) => {
  const nodes: { node: MindmapNode; x: number; y: number; depth: number; parent?: number }[] = [];
  let leaf = 0;
  const place = (node: MindmapNode, depth: number, parent?: number): number => {
    const index = nodes.length;
    nodes.push({ node, x: depth * 154 + 8, y: 0, depth, parent });
    const children = (node.children || []).map(child => place(child, depth + 1, index));
    nodes[index].y = children.length
      ? (nodes[children[0]].y + nodes[children[children.length - 1]].y) / 2
      : leaf++ * 60 + 12;
    return index;
  };
  place(root, 0);
  const width = Math.max(...nodes.map(item => item.x)) + 144;
  const height = Math.max(160, leaf * 60 + 14);
  const colors = ['#efbdac', '#ecdbab', '#c9ded3', '#d6c8e3'];
  const lines = (label: string) => {
    const words = label.split(/\s+/);
    const result = [''];
    for (const word of words) {
      const last = result.length - 1;
      if ((result[last] + ' ' + word).trim().length > 19 && result[last]) result.push(word);
      else result[last] = (result[last] + ' ' + word).trim();
    }
    return result.length > 2 ? [result[0], result[1].slice(0, 17) + '…'] : result;
  };
  return <svg className="lesson-mindmap" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Sơ đồ tư duy: ${root.label}`}>
    <title>{root.label}</title>
    {nodes.filter(item => item.parent !== undefined).map((item, index) => {
      const parent = nodes[item.parent!];
      return <path key={`edge-${index}`} d={`M${parent.x + 136},${parent.y + 22} C${parent.x + 146},${parent.y + 22} ${item.x - 10},${item.y + 22} ${item.x},${item.y + 22}`} fill="none" stroke="#b8c4b7" strokeWidth="1.5" />;
    })}
    {nodes.map((item, index) => <g key={index}>
      <title>{item.node.label}</title>
      <rect x={item.x} y={item.y} width="136" height="44" rx="20" fill={colors[item.depth === 0 ? 0 : (index % 3) + 1]} stroke="#bbc3b2" strokeWidth=".7" />
      <text x={item.x + 68} y={item.y + (lines(item.node.label).length === 1 ? 26 : 19)} textAnchor="middle" fill="#4e5a50" fontSize="12" fontFamily="system-ui, sans-serif">
        {lines(item.node.label).map((line, lineIndex) => <tspan key={lineIndex} x={item.x + 68} dy={lineIndex ? 14 : 0}>{line}</tspan>)}
      </text>
    </g>)}
  </svg>;
};
