import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { sparkline } from './index';

const stripAnsi = (str: string) => str.replace(/\x1B\[\d+m/g, '');

describe('sparkline (Library)', () => {
  
  it('renders a simple ramp correctly', () => {
    const rawResult = sparkline([10, 20, 80, 100]);
    const cleanResult = stripAnsi(rawResult);
    
    expect(cleanResult).toBe('  ▆█'); 
  });

  it('handles flat lines', () => {
    const rawResult = sparkline([50, 50, 50]);
    const cleanResult = stripAnsi(rawResult);
    
    expect(cleanResult).toBe('▄▄▄');
  });

  it('smooths noisy data', () => {
    const raw = sparkline([10, 100, 10]);
    const smoothed = sparkline([10, 100, 10], { smooth: true });
    
    expect(raw).not.toBe(smoothed);
  });

  it('supports different styles', () => {
    const lineResult = stripAnsi(sparkline([10, 50, 100], { style: 'line' }));
    expect(lineResult).toBe('_.¯');
    
    const fireResult = stripAnsi(sparkline([10, 50, 100], { style: 'fire' }));
    expect(fireResult).toBe(' ⣄⣿');
  });

  it('generates heatmaps (ANSI codes)', () => {
    const result = sparkline([10, 50, 90], { heatmap: true });
    expect(result).toContain('\x1b['); 
  });

  it('outputs browser-compatible array when browser: true', () => {
    const result = sparkline([10, 50], { browser: true, heatmap: true });
    
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toContain('%c');
  });
});

describe('sparkline (CLI)', () => {
  
  const runCLI = (args: string) => {
    try {
      return execSync(`npx tsx src/cli.ts ${args}`, { encoding: 'utf-8' }).trim();
    } catch (e) {
      return '';
    }
  };

  it('accepts numbers as arguments', () => {
    const rawOutput = runCLI('10 20 30 40');
    const output = stripAnsi(rawOutput);
    
    expect(output).toContain(' ▃▅█');
  });

  it('accepts --style flag', () => {
    const rawOutput = runCLI('10 50 100 --style line');
    const output = stripAnsi(rawOutput);
    
    expect(output).toContain('_.¯');
  });

  it('accepts --min and --max flags', () => {
    const rawOutput = runCLI('50 --min 0 --max 100');
    const output = stripAnsi(rawOutput);
    
    expect(output).not.toContain('█'); 
  });
});