# 🏥 vitals-cli

![npm version](https://img.shields.io/npm/v/vitals-cli?color=brightgreen)
![license](https://img.shields.io/npm/l/vitals-cli)
![downloads](https://img.shields.io/npm/dt/vitals-cli)
![minified size](https://img.shields.io/bundlephobia/min/vitals-cli)

> **The Terminal Health Monitor.**
> A zero-dependency, real-time telemetry visualization tool for DevOps, SREs, and Developers.

**vitals-cli** turns boring text streams (logs, pings, voltage readings) into beautiful, animated charts directly in your terminal.

---

## 🚀 Features

* **🔴 Live Streaming:** Pipe real-time data directly into a moving chart.
* **🌡️ Smart Heatmaps:** Automatically colors data: **Green** (Low) → **Yellow** (Mid) → **Red** (High).
* **🏥 ECG Mode:** Visualize latency heartbeats with the `line` style.
* **🔥 Fire Mode:** Uses Braille characters for high-density rendering.
* **🦄 Zero Dependencies:** Lightweight (<4KB), fast, and isomorphic (Node + Browser).

---

## 📦 Installation

To use it as a command-line tool, install it globally:
```bash
npm install -g vitals-cli
```

To use it as a library in your project:
```bash
npm install vitals-cli
```

---

## ⚡ CLI Usage

### 1. The "Heartbeat" Monitor (Latency)

Visualize `ping` latency in real-time.
```bash
# macOS / Linux (Note: We use grep to force unbuffered output)
ping google.com | grep --line-buffered "time=" | awk -F'time=' '{print $2}' | vitals --stream --style line --heat
```

### 2. Server Load Dashboard (Fire Style)

Perfect for visualizing CPU load, memory usage, or request volume.
```bash
# Simulating a server load stream
echo "10 20 15 40 80 90 40 20" | vitals --style fire --heat
```

### 3. Static Analysis

Quickly check the trend of a dataset.
```bash
vitals 10 32 45 12 90 100 23
# Output:  ▃▄▂▇█▂
```

---

## 🎨 Styles & Options

Customize your graph with flags:

| Style | Preview | Best For |
|-------|---------|----------|
| `line` | `_.-¯` | Latency, Stock Prices, Trends |
| `fire` | `⡀⣀⣄⣤⣦⣶⣷⣿` | High-density data (CPU/Memory) |
| `bar` | `▂▃▅▆▇█` | General Statistics (Default) |
| `shaded` | `░▒▓█` | Retro dashboards |
| `bubble` | `·•oO@` | Weight / Volume indicators |

### Full Options List

| Flag | Description |
|------|-------------|
| `--stream` | Real-Time Mode. Listens for continuous input via pipe (`stdin`). |
| `--heat` | Heatmap. Enables dynamic coloring (Green → Red). |
| `--smooth` | Smoothing. Applies a moving average to reduce noise. |
| `--style <name>` | Sets the visual style (see table above). |
| `--min <n>` | Force a minimum Y-axis value. |
| `--max <n>` | Force a maximum Y-axis value. |

---

## 💻 Library Usage

You can use the core engine in your own Node.js or Browser scripts.
```typescript
import { sparkline } from 'vitals-cli';

const data = [10, 20, 90, 100, 50];

// Returns a colored ANSI string (Node) or CSS-styled array (Browser)
console.log(sparkline(data, { 
    style: 'fire', 
    heatmap: true 
}));
```

---

## 🔧 Troubleshooting

### "Nothing is showing up when I pipe `ping`!"

This is usually due to **OS Output Buffering**.

* **Linux:** `ping` usually works fine, but you can add `stdbuf -oL` before the command if it lags.
* **macOS:** macOS buffers pipe output aggressively. You must force it to flush lines immediately.
   * **Fix:** Use `grep --line-buffered "time="` in your chain (as seen in the examples).

---

## 👨‍💻 Development

Want to contribute?

1. Clone the repo.
2. Install dependencies: `npm install`
3. Run the build watcher: `npm run build`
4. Link globally for local testing: `npm link`

---

## 📄 License

MIT © Viraj Patel