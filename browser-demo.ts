import { sparkline } from './src/index';

const data = [10, 50, 90];

console.log("--- Node Mode (String) ---");
console.log(sparkline(data, { heatmap: true }));

console.log("\n--- Browser Mode (Array) ---");
const output = sparkline(data, { heatmap: true, browser: true });
console.log("Structure for Chrome:", output);