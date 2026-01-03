const STYLES = {
  bar: [' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'],
  line: ['_', '.', '-', '¯'],
  fire: [' ', '⡀', '⣀', '⣄', '⣤', '⣦', '⣶', '⣷', '⣿'],
  shaded: [' ', '░', '▒', '▓', '█'],
  bubble: ['·', '•', 'o', 'O', '@'],
  ascii: ['.', '-', '=', '#']
};

const DEFAULT_THEME = {
  low: { ansi: '\x1b[32m', css: '#69f0ae' },
  mid: { ansi: '\x1b[33m', css: '#ffd740' },
  high: { ansi: '\x1b[31m', css: '#ff5252' },
  reset: { ansi: '\x1b[0m', css: 'inherit' }
};

const SIZES = {
  small: 'font-size: 10px',
  medium: 'font-size: 14px',
  large: 'font-size: 20px; font-weight: bold; line-height: 20px;',
  xl: 'font-size: 35px; font-weight: bold; line-height: 35px;'
};

export interface SparklineOptions {
  min?: number;
  max?: number;
  smooth?: boolean;
  heatmap?: boolean;
  browser?: boolean;
  size?: 'small' | 'medium' | 'large' | 'xl';
  verbose?: boolean;
  style?: 'bar' | 'line' | 'fire' | 'shaded' | 'bubble' | 'ascii';
  theme?: {
    low?: string;
    mid?: string;
    high?: string;
  };
}

function movingAverage(data: number[], windowSize: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const subset = data.slice(start, i + 1);
    const average = subset.reduce((a, b) => a + b, 0) / subset.length;
    result.push(average);
  }
  return result;
}

export function sparkline(data: number[], options: SparklineOptions = {}): any {
  if (data.length === 0) return '';

  let processedData = data;
  if (options.smooth) {
    processedData = movingAverage(data, 2);
  }

  const min = options.min ?? Math.min(...processedData);
  const max = options.max ?? Math.max(...processedData);

  const styleKey = options.style || 'bar';
  const selectedChars = STYLES[styleKey] || STYLES.bar;
  const fontSize = SIZES[options.size || 'medium'];

  const lowColor = options.theme?.low ? `color: ${options.theme.low}` : `color: ${DEFAULT_THEME.low.css}`;
  const midColor = options.theme?.mid ? `color: ${options.theme.mid}` : `color: ${DEFAULT_THEME.mid.css}`;
  const highColor = options.theme?.high ? `color: ${options.theme.high}` : `color: ${DEFAULT_THEME.high.css}`;

  let ansiString = '';
  let browserFormatString = ''; 
  let browserStyles: string[] = [];
  let verboseLine = '';
  processedData.forEach((n) => {
    const val = Math.min(Math.max(n, min), max);
    const normalized = (max === min) ? 0.5 : (val - min) / (max - min);
    
    const index = Math.floor(normalized * (selectedChars.length - 1));
    const char = selectedChars[index];

    if (options.verbose) {
       verboseLine += Math.round(n).toString().padEnd(3, ' '); 
    }

    let currentAnsiColor = DEFAULT_THEME.reset.ansi;
    let currentCssColor = DEFAULT_THEME.reset.css;

    if (options.heatmap) {
      if (normalized < 0.35) {
        currentAnsiColor = DEFAULT_THEME.low.ansi;
        currentCssColor = lowColor;
      } else if (normalized < 0.75) {
        currentAnsiColor = DEFAULT_THEME.mid.ansi;
        currentCssColor = midColor;
      } else {
        currentAnsiColor = DEFAULT_THEME.high.ansi;
        currentCssColor = highColor;
      }
    }

    ansiString += `${currentAnsiColor}${char}${DEFAULT_THEME.reset.ansi}`;
    browserFormatString += `%c${char}`;
    browserStyles.push(`${currentCssColor}; ${fontSize}`);
  });

  if (options.browser) {
    if (options.verbose) {
      console.log(`Values: ${processedData.map(n => Math.round(n)).join(' | ')}`);
    }
    return [browserFormatString, ...browserStyles];
  }

  return options.verbose ? `${ansiString}\n${verboseLine}` : ansiString;
}