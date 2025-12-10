<script lang="ts">
  import type { TaskData, ChartConfig } from '../types';
  import { onMount } from 'svelte';

  export let data: TaskData[] = [];
  export let config: ChartConfig = {};

  let containerWidth = 300;
  let containerHeight = 300;
  let trophySize = 0;
  let monthlyCount = 0;
  let currentMonth = '';
  let shineAnimation = false;

  // Detect system theme
  let isDark = false;
  onMount(() => {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        isDark = e.matches;
      });
  });

  // Calculate trophy state from tasks
  $: if (data.length > 0) {
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    currentMonth = currentMonthStr;

    // Count tasks completed this month
    let tasksThisMonth = 0;
    data.forEach(task => {
      if (task.completedAt) {
        const taskDate = new Date(task.completedAt * 1000);
        const taskMonthStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}`;
        if (taskMonthStr === currentMonthStr) {
          tasksThisMonth++;
        }
      }
    });

    monthlyCount = tasksThisMonth;

    // Calculate trophy size
    // Each task adds ~8% (so 12 tasks = ~96%)
    // Cap at 100%
    trophySize = Math.min(monthlyCount * 8, 100);

    // Trigger shine animation on milestone (every 5 tasks)
    shineAnimation = monthlyCount % 5 === 0 && monthlyCount > 0;
  } else {
    trophySize = 0;
    monthlyCount = 0;
    currentMonth = '';
    shineAnimation = false;
  }

  // Theme colors
  $: goldColor = isDark ? '#ffd700' : '#ffc107';
  $: shadowColor = isDark ? '#daa520' : '#ff8c00';
  $: textColor = isDark ? '#ffffff' : '#1a1a1a';

  // Responsive sizing
  $: scale = Math.min(containerWidth, containerHeight) / 300;
  $: trophyHeight = 140 * scale * (trophySize / 100 + 0.3);
  $: trophyWidth = 100 * scale * (trophySize / 100 + 0.3);
</script>

<div
  class="trophy-tracker"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
  class:dark={isDark}
>
  <div class="trophy-container">
    <!-- Glow effect -->
    <svg
      class="trophy-svg trophy-glow"
      style="--scale: {scale}; width: {trophyWidth * 1.6}px; height: {trophyHeight * 1.6}px;"
      viewBox="0 0 120 140"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="trophy-glow-{isDark ? 'dark' : 'light'}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="60" cy="60" rx="45" ry="40" fill={shadowColor} opacity="0.4" filter="url(#trophy-glow-{isDark ? 'dark' : 'light'})" />
    </svg>

    <!-- Main trophy -->
    <svg
      class="trophy-svg trophy-main"
      class:shine={shineAnimation}
      style="--scale: {scale}; width: {trophyWidth}px; height: {trophyHeight}px;"
      viewBox="0 0 120 140"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="trophy-gradient-{isDark ? 'dark' : 'light'}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: white; stop-opacity: 0.3" />
          <stop offset="50%" style="stop-color: {goldColor}; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: {shadowColor}; stop-opacity: 1" />
        </linearGradient>
      </defs>

      <!-- Cup -->
      <ellipse cx="60" cy="50" rx="30" ry="28" fill="url(#trophy-gradient-{isDark ? 'dark' : 'light'})" stroke={shadowColor} stroke-width="2" />

      <!-- Handles -->
      <path
        d="M 30 45 Q 15 35 20 20"
        stroke={goldColor}
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />
      <path
        d="M 90 45 Q 105 35 100 20"
        stroke={goldColor}
        stroke-width="3"
        fill="none"
        stroke-linecap="round"
      />

      <!-- Stem -->
      <rect x="55" y="75" width="10" height="30" fill={goldColor} />

      <!-- Base -->
      <ellipse cx="60" cy="108" rx="35" ry="8" fill={goldColor} />
      <ellipse cx="60" cy="107" rx="35" ry="6" fill={shadowColor} opacity="0.5" />

      <!-- Shine highlight -->
      <ellipse cx="50" cy="40" rx="8" ry="12" fill="white" opacity="0.5" />
    </svg>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat">
      <span class="value">{monthlyCount}</span>
      <span class="label">This Month</span>
    </div>
    <div class="stat">
      <span class="value">{Math.round(trophySize)}%</span>
      <span class="label">Filled</span>
    </div>
    <div class="stat milestone">
      <span class="value">{Math.floor(monthlyCount / 5)}</span>
      <span class="label">Milestones</span>
    </div>
  </div>

  <!-- Message -->
  <div class="message">
    {#if monthlyCount === 0}
      <p>Start a task to begin collecting trophies!</p>
    {:else if monthlyCount < 5}
      <p>Great start! Keep pushing toward your first milestone.</p>
    {:else if monthlyCount < 10}
      <p>Impressive! You're building momentum this month.</p>
    {:else}
      <p>Outstanding! You're a trophy-collecting machine!</p>
    {/if}
  </div>
</div>

<style>
  .trophy-tracker {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: var(--bg, #ffffff);
    border-radius: 12px;
    text-align: center;
  }

  .trophy-tracker.dark {
    --bg: #1a1a1a;
  }

  .trophy-container {
    position: relative;
    width: 200px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .trophy-svg {
    position: absolute;
    filter: drop-shadow(0 4px 12px rgba(255, 193, 7, 0.3));
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .trophy-glow {
    opacity: 0.6;
    filter: drop-shadow(0 4px 20px rgba(255, 165, 0, 0.4));
  }

  .trophy-main {
    z-index: 10;
  }

  .trophy-main.shine {
    animation: shimmer 0.6s ease-out;
  }

  @keyframes shimmer {
    0% {
      filter: drop-shadow(0 4px 12px rgba(255, 193, 7, 0.3)) drop-shadow(0 0 8px rgba(255, 215, 0, 0.4));
    }
    50% {
      filter: drop-shadow(0 4px 20px rgba(255, 193, 7, 0.8)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
    }
    100% {
      filter: drop-shadow(0 4px 12px rgba(255, 193, 7, 0.3));
    }
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    width: 100%;
    max-width: 300px;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    border-radius: 8px;
    background: var(--stat-bg, #f5f5f5);
    transition: all 0.3s ease;
  }

  .trophy-tracker.dark .stat {
    --stat-bg: #2a2a2a;
  }

  .stat.milestone {
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text, #1a1a1a);
  }

  .trophy-tracker.dark .value {
    --text: #ffffff;
  }

  .label {
    font-size: 0.75rem;
    color: var(--text-secondary, #666);
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .trophy-tracker.dark .label {
    --text-secondary: #999;
  }

  .message {
    font-size: 0.95rem;
    color: var(--text, #1a1a1a);
    font-style: italic;
    max-width: 100%;
  }

  .trophy-tracker.dark .message {
    --text: #ffffff;
  }

  .message p {
    margin: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .trophy-tracker {
      padding: 1rem;
      gap: 1rem;
    }

    .trophy-container {
      width: 150px;
      height: 200px;
    }

    .stats {
      gap: 0.75rem;
    }

    .stat {
      padding: 0.6rem;
    }

    .value {
      font-size: 1.2rem;
    }

    .message {
      font-size: 0.85rem;
    }
  }

  /* Respect user's motion preference */
  @media (prefers-reduced-motion: reduce) {
    .trophy-svg,
    .trophy-main {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
