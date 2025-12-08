<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  import { getTaskSessions } from '../utils/aggregation';

  export let data: SessionData[] = [];
  export let taskId: string = '';
  export let config: ChartConfig = {
    title: 'Session Ratings Over Time',
    theme: 'light',
    height: 400,
    responsive: true
  };

  $: taskSessions = getTaskSessions(data, taskId).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  $: averageRating = taskSessions.length > 0
    ? (taskSessions.reduce((sum, s) => sum + s.rating, 0) / taskSessions.length).toFixed(1)
    : '0.0';

  const chartPadding = { top: 40, right: 20, bottom: 60, left: 50 };
  const innerHeight = config.height - chartPadding.top - chartPadding.bottom;
  const chartWidth = 800;
  const dotRadius = 5;

  $: xScale = taskSessions.length > 1
    ? chartWidth / (taskSessions.length - 1)
    : chartWidth / 2;

  function getXPosition(index: number): number {
    return chartPadding.left + index * xScale;
  }

  function getYPosition(rating: number): number {
    return chartPadding.top + innerHeight - ((rating - 1) / 4) * innerHeight;
  }

  $: linePathData = taskSessions.length > 0
    ? taskSessions.map((session, index) => 
        `${getXPosition(index)},${getYPosition(session.rating)}`
      ).join('L')
    : '';

  $: linePathD = linePathData ? `M${linePathData}` : '';

  function getRatingColor(rating: number): string {
    if (config.theme === 'dark') {
      if (rating >= 4.5) return '#4ade80';
      if (rating >= 4) return '#60a5fa';
      if (rating >= 3.5) return '#facc15';
      if (rating >= 3) return '#fb923c';
      return '#f87171';
    } else {
      if (rating >= 4.5) return '#16a34a';
      if (rating >= 4) return '#2563eb';
      if (rating >= 3.5) return '#d97706';
      if (rating >= 3) return '#ea580c';
      return '#dc2626';
    }
  }
</script>

<div class="chart-container" style="--theme: {config.theme}">
  <div class="chart-header">
    <h2>{config.title}</h2>
    <p class="subtitle">{taskId}</p>
  </div>

  {#if taskSessions.length === 0}
    <div class="empty-state">
      <p>No sessions found for {taskId}</p>
    </div>
  {:else}
    <div class="chart-wrapper">
      <svg
        width="100%"
        height={config.height}
        viewBox="0 0 {chartWidth + chartPadding.left + chartPadding.right} {config.height}"
        preserveAspectRatio="xMidYMid meet"
      >
        <!-- Grid lines for ratings -->
        {#each Array.from({ length: 5 }) as _, i}
          {@const rating = 1 + i}
          {@const y = getYPosition(rating)}
          <line
            x1={chartPadding.left}
            y1={y}
            x2={chartWidth + chartPadding.left}
            y2={y}
            class="grid-line"
          />
          <text
            x={chartPadding.left - 10}
            y={y + 5}
            class="axis-label"
            text-anchor="end"
          >
            {rating}
          </text>
        {/each}

        <!-- X-axis labels (session numbers) -->
        {#each taskSessions as session, index}
          {@const x = getXPosition(index)}
          {@const y = chartPadding.top + innerHeight + 35}
          {#if taskSessions.length <= 20 || index % Math.ceil(taskSessions.length / 10) === 0}
            <text
              {x}
              {y}
              class="axis-label x-label"
              text-anchor="middle"
            >
              {index + 1}
            </text>
          {/if}
        {/each}

        <!-- Line path -->
        {#if linePathD}
          <polyline
            points={taskSessions.map((_, i) => `${getXPosition(i)},${getYPosition(taskSessions[i].rating)}`).join(' ')}
            class="line-path"
            fill="none"
            stroke="#667eea"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        {/if}

        <!-- Data points (circles on line) -->
        {#each taskSessions as session, index}
          {@const x = getXPosition(index)}
          {@const y = getYPosition(session.rating)}
          <circle
            cx={x}
            cy={y}
            r={dotRadius}
            fill={getRatingColor(session.rating)}
            class="data-point"
          >
            <title>Session {index + 1}: {session.rating} stars ({session.date})</title>
          </circle>
        {/each}

        <!-- Y-axis line -->
        <line
          x1={chartPadding.left}
          y1={chartPadding.top}
          x2={chartPadding.left}
          y2={chartPadding.top + innerHeight}
          class="axis-line"
        />

        <!-- X-axis line -->
        <line
          x1={chartPadding.left}
          y1={chartPadding.top + innerHeight}
          x2={chartWidth + chartPadding.left}
          y2={chartPadding.top + innerHeight}
          class="axis-line"
        />

        <!-- Y-axis label -->
        <text
          x={-config.height / 2}
          y={15}
          class="axis-title"
          text-anchor="middle"
          transform="rotate(-90 15 {config.height / 2})"
        >
          Rating (1-5 stars)
        </text>
      </svg>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="label">Average Rating</span>
        <span class="value">{averageRating}/5</span>
      </div>
      <div class="stat">
        <span class="label">Total Sessions</span>
        <span class="value">{taskSessions.length}</span>
      </div>
      <div class="stat">
        <span class="label">Highest Rating</span>
        <span class="value">{Math.max(...taskSessions.map(s => s.rating))}</span>
      </div>
      <div class="stat">
        <span class="label">Lowest Rating</span>
        <span class="value">{Math.min(...taskSessions.map(s => s.rating))}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .chart-container {
    padding: 1.5rem;
    border-radius: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  :global([style*="--theme: dark"]) {
    --bg-primary: #1f2937;
    --text-primary: #f3f4f6;
    --axis-color: #d1d5db;
    --grid-color: rgba(209, 213, 219, 0.1);
  }

  :global([style*="--theme: light"]) {
    --bg-primary: #ffffff;
    --text-primary: #1f2937;
    --axis-color: #374151;
    --grid-color: rgba(0, 0, 0, 0.05);
  }

  .chart-header {
    margin-bottom: 1.5rem;
  }

  .chart-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0.5rem 0 0 0;
    font-size: 0.95rem;
    opacity: 0.7;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: var(--text-primary);
    opacity: 0.6;
  }

  .chart-wrapper {
    overflow-x: auto;
    margin-bottom: 1.5rem;
  }

  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  :global(.grid-line) {
    stroke: var(--grid-color);
    stroke-width: 1;
  }

  :global(.axis-line) {
    stroke: var(--axis-color);
    stroke-width: 2;
  }

  :global(.axis-label) {
    font-size: 12px;
    fill: var(--text-primary);
    opacity: 0.7;
  }

  :global(.x-label) {
    font-size: 12px;
  }

  :global(.axis-title) {
    font-size: 13px;
    font-weight: 600;
    fill: var(--text-primary);
  }

  :global(.data-point) {
    transition: all 0.2s ease;
    cursor: pointer;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  }

  :global(.data-point:hover) {
    r: 8;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--axis-color);
    opacity: 0.8;
  }

  .label {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 0.25rem;
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

    .chart-header h2 {
      font-size: 1.2rem;
    }

    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
