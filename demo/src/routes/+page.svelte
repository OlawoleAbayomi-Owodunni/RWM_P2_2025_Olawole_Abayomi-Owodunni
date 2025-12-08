<script lang="ts">
  import { SessionsOverDays } from '@ayola/stats-visualizer';
  import type { SessionData, ChartConfig } from '@ayola/stats-visualizer';

  let sessions: SessionData[] = [];
  
  function generateSampleData() {
    sessions = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Add 0-8 sessions per day randomly
      const sessionsPerDay = Math.floor(Math.random() * 9);
      for (let j = 0; j < sessionsPerDay; j++) {
        sessions.push({
          id: `session-${i}-${j}`,
          taskId: `task-${Math.floor(Math.random() * 3) + 1}`,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          duration: Math.floor(Math.random() * 90) + 30, // 30-120 minutes
          date: dateStr,
          notes: `Sample session`
        });
      }
    }
  }

  function clearData() {
    sessions = [];
  }

  // Generate initial data
  generateSampleData();

  // Detect system theme preference
  const prefersDark = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;

  let config: ChartConfig = {
    title: '📊 Sessions Over Time',
    theme: prefersDark ? 'dark' : 'light',
    height: 400,
    responsive: true
  };
</script>

<div class="container">
  <header>
    <h1>Stats Visualizer Demo</h1>
    <p>Real-time preview of chart components</p>
  </header>

  <div class="controls">
    <button on:click={generateSampleData}>
      Generate New Data
    </button>
    <button on:click={clearData} class="secondary">
      Clear Data
    </button>
  </div>

  <main>
    <section>
      <SessionsOverDays data={sessions} {config} />
    </section>

    <section class="info">
      <h2>About Sessions Over Days</h2>
      <p>
        This chart visualizes the number of sessions tracked over consecutive days. 
        It shows trends in your productivity and helps identify patterns in your study/work habits.
      </p>
      <ul>
        <li>Line chart with area fill</li>
        <li>Shows daily session counts</li>
        <li>Displays peak sessions and total metrics</li>
        <li>Fully responsive for mobile & desktop</li>
      </ul>
    </section>
  </main>
</div>

<style>
  .container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 2rem;
  }

  header h1 {
    font-size: 2.5rem;
    margin: 0;
    font-weight: 700;
  }

  header p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0.5rem 0 0 0;
  }

  main {
    max-width: 1000px;
    margin: 0 auto;
    display: grid;
    gap: 2rem;
  }

  section {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    background: white;
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  button.secondary {
    background: #e0e0e0;
    color: #333;
  }

  button.secondary:hover {
    background: #d0d0d0;
  }

  .info {
    background: #f8f9ff;
  }

  .info h2 {
    color: #667eea;
    margin-top: 0;
  }

  .info p {
    color: #666;
    line-height: 1.6;
  }

  .info ul {
    color: #666;
    line-height: 1.8;
  }

  .info li {
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    header h1 {
      font-size: 1.8rem;
    }

    section {
      padding: 1.5rem;
    }

    main {
      gap: 1.5rem;
    }
  }
</style>
