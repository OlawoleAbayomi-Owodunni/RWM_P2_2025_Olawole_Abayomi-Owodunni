<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  import { aggregateSessionsByDay } from '../utils/aggregation';

  export let data: SessionData[] = [];
  export let config: ChartConfig = {
    theme: 'light',
    height: 400,
    responsive: true
  };

  $: sessionsByDay = aggregateSessionsByDay(data);
  $: dates = Object.keys(sessionsByDay).sort();
  $: counts = dates.map(date => sessionsByDay[date].length);
  $: maxCount = Math.max(...counts, 1);

  // Format date for display
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Calculate SVG path for line chart
  function createPath(values: number[], height: number, padding: number): string {
    if (values.length === 0) return '';
    
    const chartWidth = 800 - padding * 2;
    const chartHeight = height - padding * 2;
    const pointSpacing = chartWidth / (values.length - 1 || 1);
    
    let path = '';
    values.forEach((value, i) => {
      const x = padding + i * pointSpacing;
      const y = padding + chartHeight - (value / maxCount) * chartHeight;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    
    return path;
  }

  $: linePath = createPath(counts, config.height || 400, 50);
  $: areaPath = counts.length > 0 
    ? `${linePath} L ${800 - 50} ${(config.height || 400) - 50} L 50 ${(config.height || 400) - 50} Z`
    : '';
</script>

<div class="chart-container" class:dark={config.theme === 'dark'}>
  {#if config.title}
    <h3 class="chart-title">{config.title}</h3>
  {/if}

  {#if dates.length === 0}
    <div class="no-data">
      <p>No session data available</p>
    </div>
  {:else}
    <div class="chart-wrapper" style="height: {config.height || 400}px">
      <svg viewBox={`0 0 800 ${config.height || 400}`} preserveAspectRatio="xMidYMid meet">
        <!-- Grid lines -->
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color: #667eea; stop-opacity: 0.3" />
            <stop offset="100%" style="stop-color: #667eea; stop-opacity: 0.05" />
          </linearGradient>
        </defs>

        <!-- Y-axis grid lines -->
        {#each Array(5) as _, i}
          <line
            x1="50"
            y1={50 + (i * ((config.height || 400) - 100)) / 4}
            x2="750"
            y2={50 + (i * ((config.height || 400) - 100)) / 4}
            stroke="#e0e0e0"
            stroke-width="1"
            stroke-dasharray="4"
          />
        {/each}

        <!-- Axes -->
        <line x1="50" y1="50" x2="50" y2={config.height ? config.height - 50 : 350} stroke="#333" stroke-width="2" />
        <line x1="50" y1={config.height ? config.height - 50 : 350} x2="750" y2={config.height ? config.height - 50 : 350} stroke="#333" stroke-width="2" />

        <!-- Area fill -->
        {#if areaPath}
          <path d={areaPath} fill="url(#areaGradient)" />
        {/if}

        <!-- Line -->
        {#if linePath}
          <path d={linePath} fill="none" stroke="#667eea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        {/if}

        <!-- Data points -->
        {#each counts as count, i}
          <circle
            cx={50 + (i * 700) / (counts.length - 1 || 1)}
            cy={((config.height || 400) - 50) - (count / maxCount) * ((config.height || 400) - 100)}
            r="5"
            fill="#667eea"
            stroke="white"
            stroke-width="2"
            class="data-point"
          >
            <title>{dates[i]}: {count} session{count !== 1 ? 's' : ''}</title>
          </circle>
        {/each}

        <!-- X-axis labels (every nth label to avoid crowding) -->
        {#each dates as date, i}
          {#if i % Math.max(1, Math.floor(dates.length / 8)) === 0 || i === dates.length - 1}
            <text
              x={50 + (i * 700) / (dates.length - 1 || 1)}
              y={config.height ? config.height - 20 : 380}
              text-anchor="middle"
              font-size="12"
              fill="#666"
            >
              {formatDate(date)}
            </text>
          {/if}
        {/each}

        <!-- Y-axis labels -->
        {#each Array(5) as _, i}
          <text
            x="35"
            y={55 + (i * ((config.height || 400) - 100)) / 4}
            text-anchor="end"
            font-size="12"
            fill="#666"
          >
            {Math.round(maxCount - (i * maxCount) / 4)}
          </text>
        {/each}
      </svg>
    </div>

    <div class="chart-stats">
      <div class="stat">
        <span class="label">Total Sessions:</span>
        <span class="value">{data.length}</span>
      </div>
      <div class="stat">
        <span class="label">Days Tracked:</span>
        <span class="value">{dates.length}</span>
      </div>
      <div class="stat">
        <span class="label">Peak Sessions:</span>
        <span class="value">{maxCount}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    padding: 1.5rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .chart-container.dark {
    background: #1a1a1a;
    color: #f0f0f0;
  }

  .chart-title {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
  }

  .chart-container.dark .chart-title {
    color: #f0f0f0;
  }

  .chart-wrapper {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .data-point {
    cursor: pointer;
    transition: r 0.2s ease;
  }

  .data-point:hover {
    r: 7;
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    background: #f5f5f5;
    border-radius: 0.5rem;
    color: #999;
  }

  .chart-container.dark .no-data {
    background: #2a2a2a;
    color: #666;
  }

  .chart-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .chart-container.dark .chart-stats {
    border-top-color: #333;
  }

  .stat {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 0.875rem;
    color: #999;
    margin-bottom: 0.25rem;
  }

  .chart-container.dark .label {
    color: #aaa;
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  @media (max-width: 768px) {
    .chart-container {
      padding: 1rem;
    }

    .chart-title {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .chart-stats {
      grid-template-columns: 1fr;
    }
  }
</style>
