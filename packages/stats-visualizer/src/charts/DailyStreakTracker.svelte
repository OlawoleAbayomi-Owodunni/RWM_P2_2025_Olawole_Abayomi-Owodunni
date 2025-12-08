<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  import { calculateDailyStreak } from '../utils/aggregation';

  export let data: SessionData[] = [];
  export let config: ChartConfig = {
    title: 'Daily Streak Tracker',
    theme: 'light',
    height: 'auto',
    responsive: true
  };

  $: streakData = calculateDailyStreak(data);
  $: currentStreak = streakData.currentStreak || 0;
  $: longestStreak = streakData.longestStreak || 0;
  $: activeDays = streakData.details?.filter(d => d.hasSession).length || 0;

  // Calculate max sessions per day for gradient scaling
  $: maxSessionsPerDay = Math.max(
    ...(streakData.details?.map(d => d.sessionCount) || [0]),
    1
  );

  // Generate 52 weeks of data (365 days)
  $: weeks = (() => {
    const details = streakData.details || [];
    const weeksArray: typeof details[][] = [];
    
    for (let i = 0; i < details.length; i += 7) {
      weeksArray.push(details.slice(i, i + 7));
    }
    
    return weeksArray;
  })();

  function getActivityColor(sessionCount: number): string {
    if (sessionCount === 0) {
      return config.theme === 'dark' ? '#374151' : '#e5e7eb';
    }

    // Gradient intensity based on session count
    const intensity = Math.min(sessionCount / maxSessionsPerDay, 1);

    if (config.theme === 'dark') {
      if (intensity > 0.75) return '#15803d'; // Dark green
      if (intensity > 0.5) return '#22c55e'; // Medium green
      if (intensity > 0.25) return '#4ade80'; // Light green
      return '#86efac'; // Very light green
    } else {
      if (intensity > 0.75) return '#15803d'; // Dark green
      if (intensity > 0.5) return '#16a34a'; // Medium green
      if (intensity > 0.25) return '#4ade80'; // Light green
      return '#86efac'; // Very light green
    }
  }

  function getTooltipText(date: Date, sessionCount: number): string {
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (sessionCount === 0) {
      return `${dateStr} - No activity`;
    }
    return `${dateStr} - ${sessionCount} session${sessionCount !== 1 ? 's' : ''}`;
  }

  // Month labels for heatmap
  $: monthLabels = (() => {
    if (!streakData.details || streakData.details.length === 0) return [];
    
    const labels: { name: string; weekIndex: number }[] = [];
    let currentMonth = -1;
    
    streakData.details.forEach((day, index) => {
      const month = day.date.getMonth();
      if (month !== currentMonth) {
        currentMonth = month;
        labels.push({
          name: day.date.toLocaleDateString('en-US', { month: 'short' }),
          weekIndex: Math.floor(index / 7)
        });
      }
    });
    
    return labels;
  })();

  const cellSize = 12;
  const cellGap = 2;
  const dayLabelWidth = 20;
  const monthLabelHeight = 20;
  const padding = 10;
</script>

<div class="chart-container" style="--theme: {config.theme}">
  <div class="chart-header">
    <h2>{config.title}</h2>
  </div>

  {#if streakData.details && streakData.details.length > 0}
    <div class="stats-row">
      <div class="stat">
        <span class="label">Current Streak</span>
        <span class="value">{currentStreak}</span>
        <span class="unit">days</span>
      </div>
      <div class="stat">
        <span class="label">Longest Streak</span>
        <span class="value">{longestStreak}</span>
        <span class="unit">days</span>
      </div>
      <div class="stat">
        <span class="label">Active Days</span>
        <span class="value">{activeDays}</span>
        <span class="unit">total</span>
      </div>
    </div>

    <div class="heatmap-wrapper">
      <svg
        width="100%"
        height="auto"
        viewBox="0 0 {weeks.length * (cellSize + cellGap) + dayLabelWidth + padding * 2} {7 * (cellSize + cellGap) + monthLabelHeight + padding * 2}"
        preserveAspectRatio="xMidYMid meet"
        class="heatmap"
      >
        <!-- Day labels (Sun-Sat) -->
        {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day, dayIndex}
          <text
            x={padding + dayLabelWidth / 2}
            y={monthLabelHeight + padding + dayIndex * (cellSize + cellGap) + cellSize / 2 + 4}
            class="day-label"
            text-anchor="middle"
          >
            {day.charAt(0)}
          </text>
        {/each}

        <!-- Month labels -->
        {#each monthLabels as month}
          <text
            x={padding + dayLabelWidth + month.weekIndex * (cellSize + cellGap) + cellSize / 2}
            y={padding + monthLabelHeight - 5}
            class="month-label"
            text-anchor="middle"
          >
            {month.name}
          </text>
        {/each}

        <!-- Cells -->
        {#each weeks as week, weekIndex}
          {#each week as day, dayIndex}
            <g class="cell-group">
              <rect
                x={padding + dayLabelWidth + weekIndex * (cellSize + cellGap)}
                y={monthLabelHeight + padding + dayIndex * (cellSize + cellGap)}
                width={cellSize}
                height={cellSize}
                fill={getActivityColor(day.sessionCount)}
                class="cell"
                rx="2"
              >
                <title>{getTooltipText(day.date, day.sessionCount)}</title>
              </rect>
            </g>
          {/each}
        {/each}
      </svg>
    </div>

    <div class="legend">
      <span class="legend-label">Activity:</span>
      <div class="legend-item">
        <div class="legend-cell empty"></div>
        <span>None</span>
      </div>
      <div class="legend-item">
        <div class="legend-cell very-light"></div>
        <span>Low</span>
      </div>
      <div class="legend-item">
        <div class="legend-cell light"></div>
        <span>Medium</span>
      </div>
      <div class="legend-item">
        <div class="legend-cell medium"></div>
        <span>High</span>
      </div>
      <div class="legend-item">
        <div class="legend-cell dark"></div>
        <span>Very High</span>
      </div>
    </div>
  {:else}
    <div class="empty-state">
      <p>No data available</p>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
  }

  :global([style*="--theme: dark"]) {
    --bg-primary: #1f2937;
    --text-primary: #f3f4f6;
    --axis-color: #d1d5db;
  }

  :global([style*="--theme: light"]) {
    --bg-primary: #ffffff;
    --text-primary: #1f2937;
    --axis-color: #374151;
  }

  .chart-header {
    margin-bottom: 1rem;
  }

  .chart-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stats-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    justify-content: center;
    align-items: stretch;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--axis-color);
    flex: 1;
    min-width: 100px;
    max-width: 180px;
  }

  .label {
    font-size: 0.75rem;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #667eea;
    line-height: 1;
  }

  .unit {
    font-size: 0.75rem;
    opacity: 0.6;
    margin-top: 0.25rem;
  }

  .heatmap-wrapper {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    margin-bottom: 1rem;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .heatmap {
    max-width: 100%;
    height: auto;
    display: block;
  }

  :global(.day-label) {
    font-size: 11px;
    fill: var(--text-primary);
    opacity: 0.7;
    font-weight: 500;
  }

  :global(.month-label) {
    font-size: 12px;
    fill: var(--text-primary);
    opacity: 0.8;
    font-weight: 600;
  }

  :global(.cell) {
    transition: all 0.2s ease;
    cursor: pointer;
    stroke: var(--bg-primary);
    stroke-width: 1;
  }

  :global(.cell:hover) {
    filter: brightness(1.2);
    stroke-width: 2;
  }

  .legend {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    flex-wrap: wrap;
  }

  .legend-label {
    font-weight: 600;
    opacity: 0.8;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legend-cell {
    width: 14px;
    height: 14px;
    border-radius: 2px;
  }

  .legend-cell.empty {
    background: var(--empty-color);
  }

  .legend-cell.very-light {
    background: #86efac;
  }

  .legend-cell.light {
    background: #4ade80;
  }

  .legend-cell.medium {
    background: #16a34a;
  }

  .legend-cell.dark {
    background: #15803d;
  }

  :global([style*="--theme: dark"]) {
    --empty-color: #374151;
  }

  :global([style*="--theme: light"]) {
    --empty-color: #e5e7eb;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--text-primary);
    opacity: 0.6;
  }

  @media (max-width: 768px) {
    .chart-container {
      padding: 1rem;
    }

    .chart-header h2 {
      font-size: 1.2rem;
    }

    .stats-row {
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .stat {
      flex: 1;
      min-width: 80px;
      padding: 0.5rem;
    }

    .value {
      font-size: 1.5rem;
    }

    .label {
      font-size: 0.65rem;
    }

    .heatmap-wrapper {
      min-height: 150px;
    }

    .legend {
      font-size: 0.8rem;
      gap: 0.5rem;
    }

    .legend-cell {
      width: 12px;
      height: 12px;
    }
  }

  @media (max-width: 480px) {
    .chart-container {
      padding: 0.75rem;
    }

    .chart-header h2 {
      font-size: 1rem;
    }

    .stats-row {
      gap: 0.35rem;
      margin-bottom: 0.75rem;
    }

    .stat {
      min-width: 70px;
      padding: 0.35rem 0.5rem;
      border-radius: 0.375rem;
    }

    .label {
      font-size: 0.6rem;
    }

    .value {
      font-size: 1.25rem;
    }

    .unit {
      font-size: 0.6rem;
    }

    .heatmap-wrapper {
      min-height: 120px;
      margin-bottom: 0.75rem;
    }

    .legend {
      font-size: 0.7rem;
      gap: 0.35rem;
    }

    .legend-item {
      gap: 0.3rem;
    }

    .legend-cell {
      width: 10px;
      height: 10px;
    }
  }
</style>
