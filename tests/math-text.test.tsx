// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MathText, parseMathSegments } from '../src/components/common/MathText';

describe('MathText & KaTeX parser', () => {
  it('parses plain text without math delimiters', () => {
    const segments = parseMathSegments('Học sinh phát biểu định nghĩa hàm số.');
    expect(segments).toEqual([
      { type: 'text', content: 'Học sinh phát biểu định nghĩa hàm số.' }
    ]);
  });

  it('parses inline math correctly', () => {
    const segments = parseMathSegments('Giải phương trình $sin x = m$ với điều kiện $|m| \\le 1$.');
    expect(segments.length).toBe(5);
    expect(segments[0]).toEqual({ type: 'text', content: 'Giải phương trình ' });
    expect(segments[1]).toEqual({ type: 'inline-math', content: 'sin x = m' });
    expect(segments[2]).toEqual({ type: 'text', content: ' với điều kiện ' });
    expect(segments[3]).toEqual({ type: 'inline-math', content: '|m| \\le 1' });
    expect(segments[4]).toEqual({ type: 'text', content: '.' });
  });

  it('parses block math correctly', () => {
    const input = 'Công thức tổng quát:\n$$\\int_a^b f(x)dx = F(b) - F(a)$$\nÁp dụng tính tích phân.';
    const segments = parseMathSegments(input);
    expect(segments.some(s => s.type === 'block-math')).toBe(true);
    const block = segments.find(s => s.type === 'block-math');
    expect(block?.content).toBe('\\int_a^b f(x)dx = F(b) - F(a)');
  });

  it('renders KaTeX HTML elements for formulas', () => {
    const { container } = render(<MathText text="Biểu thức $\\sqrt{x^2+1}$ cần xét tập xác định." />);
    expect(container.querySelector('.katex')).not.toBeNull();
    expect(screen.getByText(/cần xét tập xác định/)).toBeDefined();
  });

  it('renders gracefully when formula has KaTeX error', () => {
    // Unfinished syntax with throwOnError: false
    const { container } = render(<MathText text="Lỗi cú pháp $\\frac{a}$ xem có crash không" />);
    expect(container).toBeDefined();
    expect(screen.getByText(/xem có crash không/)).toBeDefined();
  });
});
