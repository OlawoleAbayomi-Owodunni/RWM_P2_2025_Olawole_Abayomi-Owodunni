<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  import { onMount } from 'svelte';

  export let data: SessionData[] = [];
  export let config: ChartConfig = {};

  let containerWidth = 300;
  let containerHeight = 300;
  let flameSize = 0;
  let flameLevel: 0 | 1 | 2 | 3 = 0;
  let daysSinceLast = 0;
  let sessionCount = 0;

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

  // Calculate flame state from sessions
  $: if (data.length > 0) {
    sessionCount = data.length;

    // Find most recent session
    const sortedByDate = [...data].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    const lastSession = sortedByDate[0];
    const lastDate = new Date(lastSession.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    // Calculate days since last session
    const msPerDay = 24 * 60 * 60 * 1000;
    daysSinceLast = Math.floor((today.getTime() - lastDate.getTime()) / msPerDay);

    // Calculate flame size
    // Growth: Each session adds ~3% (so 33 sessions = ~100%)
    // Decay: Lose 15% per day without session
    let baseSize = Math.min(sessionCount * 3, 100);
    let decayFactor = Math.max(1 - daysSinceLast * 0.15, 0.1); // Never below 10% (smolder)
    flameSize = baseSize * decayFactor;

    // Determine flame level (for visual intensity)
    if (flameSize < 15) flameLevel = 0; // Smolder
    else if (flameSize < 40) flameLevel = 1; // Low
    else if (flameSize < 70) flameLevel = 2; // Medium
    else flameLevel = 3; // High
  } else {
    flameSize = 0;
    flameLevel = 0;
    daysSinceLast = 0;
    sessionCount = 0;
  }

  // Theme colors
  $: flameColor = isDark ? '#ff7f50' : '#ff6b35';
  $: glowColor = isDark ? '#ffa500' : '#ff8c00';
  $: textColor = isDark ? '#ffffff' : '#1a1a1a';
  $: bgColor = isDark ? '#1a1a1a' : '#ffffff';

  // Responsive sizing
  $: scale = Math.min(containerWidth, containerHeight) / 300;
  $: flameHeight = 140 * scale * (flameSize / 100 + 0.3); // Min size 30% of max
  $: flameWidth = 80 * scale * (flameSize / 100 + 0.4);
</script>

<div
  class="flame-tracker"
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
  class:dark={isDark}
>
  <div class="flame-container">
    <!-- Glow effect -->
    <svg
      class="flame-svg flame-glow"
      style="--scale: {scale}; width: {flameWidth * 1.5}px; height: {flameHeight * 1.5}px;"
      viewBox="0 0 100 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="flame-glow-{isDark ? 'dark' : 'light'}" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M 50 80 Q 30 60 30 40 Q 30 10 50 0 Q 70 10 70 40 Q 70 60 50 80 Z"
        fill={glowColor}
        opacity="0.4"
        filter="url(#flame-glow-{isDark ? 'dark' : 'light'})"
      />
    </svg>

    <!-- Main flame -->
    <svg
      class="flame-svg flame-main"
      style="--scale: {scale}; width: {flameWidth}px; height: {flameHeight}px;"
      viewBox="0 0 100 200"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="flame-gradient-{isDark ? 'dark' : 'light'}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: {glowColor}; stop-opacity: 1" />
          <stop offset="100%" style="stop-color: {flameColor}; stop-opacity: 1" />
        </linearGradient>
      </defs>

      <!-- Flame shape -->
      <path
        class="flame-path"
        d="M 50 150 C 30 130 20 110 20 80 C 20 40 35 10 50 0 C 65 10 80 40 80 80 C 80 110 70 130 50 150 Z"
        fill="url(#flame-gradient-{isDark ? 'dark' : 'light'})"
        class:level-0={flameLevel === 0}
        class:level-1={flameLevel === 1}
        class:level-2={flameLevel === 2}
        class:level-3={flameLevel === 3}
      />

      <!-- Inner light for intensity -->
      <ellipse cx="50" cy="100" rx="25" ry="40" fill="{glowColor}" opacity="0.3" />
    </svg>
  </div>

  <!-- Stats -->
  <div class="stats">
    <div class="stat">
      <span class="value">{sessionCount}</span>
      <span class="label">Sessions</span>
    </div>
    <div class="stat">
      <span class="value">{Math.round(flameSize)}%</span>
      <span class="label">Intensity</span>
    </div>
    {#if daysSinceLast > 0}
      <div class="stat warning">
        <span class="value">{daysSinceLast}d</span>
        <span class="label">No session</span>
      </div>
    {:else}
      <div class="stat success">
        <span class="value">Today!</span>
        <span class="label">Session</span>
      </div>
    {/if}
  </div>

  <!-- Message -->
  <div class="message">
    {#if flameLevel === 0}
      <p>Your flame is smoldering. One session to reignite it!</p>
    {:else if flameLevel === 1}
      <p>Keep the flame growing!</p>
    {:else if flameLevel === 2}
      <p>Your momentum is building!</p>
    {:else}
      <p>You're on fire!</p>
    {/if}
  </div>
</div>

<style>
  .flame-tracker {
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

  .flame-tracker.dark {
    --bg: #1a1a1a;
  }

  .flame-container {
    position: relative;
    width: 200px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .flame-svg {
    position: absolute;
    filter: drop-shadow(0 4px 12px rgba(255, 107, 53, 0.3));
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .flame-glow {
    opacity: 0.6;
    filter: drop-shadow(0 4px 20px rgba(255, 165, 0, 0.4));
  }

  .flame-main {
    z-index: 10;
  }

  .flame-path {
    transition: all 0.4s ease;
  }

  /* Flame intensity animations */
  .flame-path.level-0 {
    opacity: 0.5;
    animation: smolder 2s ease-in-out infinite;
  }

  .flame-path.level-1 {
    opacity: 0.8;
    animation: burn 1.5s ease-in-out infinite;
  }

  .flame-path.level-2 {
    opacity: 1;
    animation: blaze 1s ease-in-out infinite;
  }

  .flame-path.level-3 {
    opacity: 1;
    animation: inferno 0.8s ease-in-out infinite;
  }

  @keyframes smolder {
    0%, 100% {
      filter: drop-shadow(0 0 2px rgba(255, 107, 53, 0.4));
    }
    50% {
      filter: drop-shadow(0 0 4px rgba(255, 107, 53, 0.6));
    }
  }

  @keyframes burn {
    0%, 100% {
      filter: drop-shadow(0 2px 8px rgba(255, 107, 53, 0.5));
    }
    50% {
      filter: drop-shadow(0 4px 12px rgba(255, 165, 0, 0.6));
    }
  }

  @keyframes blaze {
    0%, 100% {
      filter: drop-shadow(0 4px 16px rgba(255, 107, 53, 0.6));
    }
    50% {
      filter: drop-shadow(0 6px 20px rgba(255, 165, 0, 0.8));
    }
  }

  @keyframes inferno {
    0%, 100% {
      filter: drop-shadow(0 6px 20px rgba(255, 107, 53, 0.8))
        drop-shadow(0 0 10px rgba(255, 165, 0, 0.6));
    }
    50% {
      filter: drop-shadow(0 8px 24px rgba(255, 107, 53, 1))
        drop-shadow(0 0 15px rgba(255, 165, 0, 0.8));
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

  .flame-tracker.dark .stat {
    --stat-bg: #2a2a2a;
  }

  .stat.success {
    background: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.3);
  }

  .stat.warning {
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
  }

  .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text, #1a1a1a);
  }

  .flame-tracker.dark .value {
    --text: #ffffff;
  }

  .label {
    font-size: 0.75rem;
    color: var(--text-secondary, #666);
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .flame-tracker.dark .label {
    --text-secondary: #999;
  }

  .message {
    font-size: 0.95rem;
    color: var(--text, #1a1a1a);
    font-style: italic;
    max-width: 100%;
  }

  .flame-tracker.dark .message {
    --text: #ffffff;
  }

  .message p {
    margin: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .flame-tracker {
      padding: 1rem;
      gap: 1rem;
    }

    .flame-container {
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
    .flame-svg,
    .flame-path {
      animation: none !important;
      transition: none !important;
    }
  }
</style>
