#!/usr/bin/env node
import { createInterface } from 'readline';
import { sparkline, SparklineOptions } from './index';

function printHelp() {
  console.log(`
  🏥 VITALS - System Health Monitor

  Usage
    $ vitals <values...>
    $ <command> | vitals [options]

  Diagnostic Features
    --style     Visuals: 'line' (ECG style), 'fire', 'bar', 'shaded', 'bubble'
    --heat      Enable Criticality Heatmap (Green -> Red)
    --stream    Live Pulse Mode (Real-time monitoring)
    --smooth    Smooth out signal noise

  Options
    --min <n>   Floor value
    --max <n>   Ceiling value
    --help      Show this screen

  Examples
    # 1. Quick Pulse Check
    $ vitals 10 20 50 30 10 --style line

    # 2. System Load Dashboard (Fire Style)
    $ echo 10 20 80 40 100 | vitals --style fire --heat

    # 3. Live Latency Heartbeat (The "ECG" Look)
    $ ping google.com | awk -F'time=' '{print $2}' | vitals --stream --style line --heat
  `);
}

function parseArgs(args: string[]) {
  const options: SparklineOptions & { stream?: boolean } = {};
  const numbers: number[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (arg.startsWith('--min')) {
      options.min = parseFloat(arg.split('=')[1] || args[++i]);
    } else if (arg.startsWith('--max')) {
      options.max = parseFloat(arg.split('=')[1] || args[++i]);
    } else if (arg.startsWith('--style')) {
      options.style = (arg.split('=')[1] || args[++i]) as SparklineOptions['style'];
    } else if (arg === '--heat' || arg === '--heatmap') {
      options.heatmap = true;
    } else if (arg === '--smooth') {
      options.smooth = true;
    } else if (arg === '--stream') {
      options.stream = true;
    } else if (!isNaN(parseFloat(arg))) {
      numbers.push(parseFloat(arg));
    }
  }

  return { options, numbers };
}

async function run() {
  const { options, numbers } = parseArgs(process.argv.slice(2));

  if (numbers.length > 0) {
    console.log(sparkline(numbers, options));
    return;
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const streamData: number[] = [];
  const WINDOW_SIZE = 40; 

  rl.on('line', (line: string) => {
    const matches = line.match(/-?[\d.]+/g);
    if (!matches) return;

    const nums = matches.map(Number).filter((n: number) => !isNaN(n));
    
    if (options.stream) {
      streamData.push(...nums);
      
      if (streamData.length > WINDOW_SIZE) {
        streamData.splice(0, streamData.length - WINDOW_SIZE);
      }

      process.stdout.write(`\r\x1b[K${sparkline(streamData, options)}`);
    } else {
      numbers.push(...nums);
    }
  });

  rl.on('close', () => {
    if (!options.stream && numbers.length > 0) {
      console.log(sparkline(numbers, options));
    } else if (options.stream) {
      console.log('');
    }
  });
}

run();