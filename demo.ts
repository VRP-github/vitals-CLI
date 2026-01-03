import { sparkline } from './dist/index.mjs';
import type { SparklineOptions } from './src/index';

const data = [10, 20, 50, 40, 80, 95, 100, 60, 20];

console.log("--- CUSTOM THEME DEMO ---");


const cyberpunkOptions: SparklineOptions = {
  heatmap: true,
  browser: true,
  size: 'large',
  theme: {
    low: '#00f3ff',
    mid: '#bd00ff',
    high: '#ff0055'
  }
};

console.log(
  ...sparkline(data, cyberpunkOptions)
);