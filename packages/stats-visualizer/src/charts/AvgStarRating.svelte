<script lang="ts">
  import type { SessionData, ChartConfig } from '../types';
  import { getAverageRatingPerTask } from '../utils/aggregation';

  export let data: SessionData[] = [];
  export let config: ChartConfig = {
    title: 'Average Star Rating Per Task',
    theme: 'light',
    height: 'auto',
    responsive: true
  };

  $: taskRatings = getAverageRatingPerTask(data);
  $: tasks = Object.entries(taskRatings).map(([taskId, rating]) => ({
    taskId,
    rating
  })).sort((a, b) => b.rating - a.rating);

  $: overallAverage = tasks.length > 0
    ? (tasks.reduce((sum, t) => sum + t.rating, 0) / tasks.length).toFixed(1)
    : '0.0';

  function renderStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push('full');
      } else if (i === fullStars && hasHalfStar) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    return stars;
  }

  function getStarColor(rating: number): string {
    if (config.theme === 'dark') {
      if (rating >= 4.5) return '#fbbf24';
      if (rating >= 4) return '#fcd34d';
      if (rating >= 3.5) return '#fde047';
      if (rating >= 3) return '#fef08a';
      return '#fef3c7';
    } else {
      if (rating >= 4.5) return '#f59e0b';
      if (rating >= 4) return '#fbbf24';
      if (rating >= 3.5) return '#fcd34d';
      if (rating >= 3) return '#fde047';
      return '#fef3c7';
    }
  }
</script>

<div class="chart-container" style="--theme: {config.theme}">
  <div class="chart-header">
    <h2>{config.title}</h2>
  </div>

  {#if tasks.length === 0}
    <div class="empty-state">
      <p>No data available</p>
    </div>
  {:else}
    <div class="overall-section">
      <div class="overall-label">Overall Average Rating</div>
      <div class="overall-rating">
        <div class="star-display">
          {#each renderStars(parseFloat(overallAverage)) as star}
            <span class="star {star}" style="--star-color: {getStarColor(parseFloat(overallAverage))}">
              {#if star === 'full'}
                ★
              {:else if star === 'half'}
                ⭐
              {:else}
                ☆
              {/if}
            </span>
          {/each}
        </div>
        <span class="rating-value">{overallAverage}/5</span>
      </div>
    </div>

    <div class="tasks-grid">
      {#each tasks as task (task.taskId)}
        <div class="task-card">
          <div class="task-name">{task.taskId}</div>
          <div class="star-display">
            {#each renderStars(task.rating) as star}
              <span class="star {star}" style="--star-color: {getStarColor(task.rating)}">
                {#if star === 'full'}
                  ★
                {:else if star === 'half'}
                  ⭐
                {:else}
                  ☆
                {/if}
              </span>
            {/each}
          </div>
          <div class="numeric-rating">{task.rating.toFixed(1)}</div>
        </div>
      {/each}
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
    --card-bg: #374151;
  }

  :global([style*="--theme: light"]) {
    --bg-primary: #ffffff;
    --text-primary: #1f2937;
    --card-bg: #f9fafb;
  }

  .chart-header {
    margin-bottom: 1.5rem;
  }

  .chart-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    color: var(--text-primary);
    opacity: 0.6;
  }

  .overall-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    margin-bottom: 2rem;
    border-radius: 1rem;
    background: var(--card-bg);
    border: 1px solid var(--card-bg);
  }

  .overall-label {
    font-size: 0.95rem;
    opacity: 0.8;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .overall-rating {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  .task-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem;
    border-radius: 0.75rem;
    background: var(--card-bg);
    border: 1px solid var(--card-bg);
    transition: all 0.3s ease;
  }

  .task-card:hover {
    transform: translateY(-4px);
    border-color: var(--star-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .task-name {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    color: var(--text-primary);
  }

  .star-display {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
    font-size: 1.5rem;
  }

  .star {
    display: inline-block;
    color: var(--star-color);
    transition: all 0.2s ease;
    line-height: 1;
  }

  .star.full {
    color: var(--star-color);
  }

  .star.half {
    color: var(--star-color);
    opacity: 0.7;
  }

  .star.empty {
    color: var(--star-color);
    opacity: 0.25;
  }

  .numeric-rating {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--star-color);
  }

  @media (max-width: 768px) {
    .chart-container {
      padding: 1rem;
    }

    .chart-header h2 {
      font-size: 1.2rem;
    }

    .tasks-grid {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }

    .overall-rating {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
