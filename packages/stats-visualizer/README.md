# @ayola/stats-visualizer

A reusable Svelte component library for visualizing activity tracking statistics. Provides multiple chart types to display session data, task performance, and productivity metrics.

## Installation

```bash
npm install @ayola/stats-visualizer
```

Or from GitHub:
```bash
npm install git+https://github.com/OlawoleAbayomi-Owodunni/RWM_P2_2025_Olawole_Abayomi-Owodunni.git
```

## Features

- 📊 Multiple chart types: Sessions over days, task ratings, weekly/monthly breakdowns, streak tracking
- 🎨 Light/dark theme support
- 📱 Fully responsive (mobile & desktop)
- ⚙️ Highly customizable via props
- 🔐 Works with P1 Activity Tracker API
- 📈 Built-in data aggregation utilities
- 🎯 TypeScript support with full type definitions

## Chart Components (Coming Soon)

### 1. SessionsOverDays
Line/area chart showing session count trends over days
```svelte
<SessionsOverDays data={sessions} config={config} />
```

### 2. AvgRatingPerTask
Bar chart comparing average ratings across tasks
```svelte
<AvgRatingPerTask sessions={sessions} tasks={tasks} config={config} />
```

### 3. TasksPerWeek
Bar chart displaying tasks completed per week
```svelte
<TasksPerWeek data={taskData} config={config} />
```

### 4. TasksPerMonth
Bar chart showing monthly task completion trends
```svelte
<TasksPerMonth data={taskData} config={config} />
```

### 5. DailyStreakTracker
Visual streak counter with calendar heatmap
```svelte
<DailyStreakTracker data={sessions} config={config} />
```

## Data Utilities

Import utility functions for data aggregation:

```typescript
import {
  aggregateSessionsByDay,
  aggregateByWeek,
  aggregateByMonth,
  getAverageRatingPerTask,
  calculateDailyStreak,
  filterByDateRange,
  getTaskSessions
} from '@ayola/stats-visualizer';
```

### Available Functions

#### `aggregateSessionsByDay(sessions: SessionData[])`
Groups sessions by calendar day

```typescript
const byDay = aggregateSessionsByDay(sessions);
// Returns: { '2024-12-08': [...sessions], '2024-12-07': [...sessions] }
```

#### `aggregateByWeek(sessions: SessionData[]): WeeklyStats[]`
Aggregates sessions into weekly statistics

```typescript
const weeklyStats = aggregateByWeek(sessions);
// Returns: [
//   { week: 'Week 49, 2024', tasksCompleted: 5, totalSessions: 12, averageRating: 4.2 },
//   ...
// ]
```

#### `aggregateByMonth(sessions: SessionData[]): MonthlyStats[]`
Aggregates sessions into monthly statistics

```typescript
const monthlyStats = aggregateByMonth(sessions);
// Returns: [
//   { month: 'December 2024', tasksCompleted: 15, totalSessions: 40, averageRating: 4.1 },
//   ...
// ]
```

#### `getAverageRatingPerTask(sessions: SessionData[]): Record<string, number>`
Calculates average rating for each task

```typescript
const avgRatings = getAverageRatingPerTask(sessions);
// Returns: { 'task-1': 4.5, 'task-2': 3.8, ... }
```

#### `calculateDailyStreak(sessions: SessionData[])`
Calculates current and longest daily streak

```typescript
const streak = calculateDailyStreak(sessions);
// Returns: { current: 7, longest: 23, details: [...] }
```

#### `filterByDateRange(sessions: SessionData[], startDate: Date, endDate: Date): SessionData[]`
Filters sessions within date range

```typescript
const recent = filterByDateRange(sessions, new Date('2024-12-01'), new Date('2024-12-08'));
```

#### `getTaskSessions(sessions: SessionData[], taskId: string): SessionData[]`
Gets all sessions for a specific task

```typescript
const taskSessions = getTaskSessions(sessions, 'task-123');
```

## Type Definitions

### ChartConfig
```typescript
interface ChartConfig {
  title?: string;
  theme?: 'light' | 'dark';
  responsive?: boolean;
  height?: number;
  width?: number;
  showLegend?: boolean;
  dateRange?: {
    startDate: Date | string;
    endDate: Date | string;
  };
}
```

### SessionData
```typescript
interface SessionData {
  id: string;
  taskId: string;
  rating: number; // 1-5 stars
  duration: number; // in minutes
  date: Date | string;
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

### TaskData
```typescript
interface TaskData {
  id: string;
  title: string;
  description?: string;
  sessions?: SessionData[];
  totalSessions?: number;
  averageRating?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
```

## Usage Example

```svelte
<script lang="ts">
  import { SessionsOverDays, aggregateByWeek } from '@ayola/stats-visualizer';
  import type { SessionData, ChartConfig } from '@ayola/stats-visualizer';

  let sessions: SessionData[] = [
    {
      id: '1',
      taskId: 'task-1',
      rating: 4,
      duration: 60,
      date: '2024-12-08'
    },
    // ... more sessions
  ];

  let config: ChartConfig = {
    title: 'My Study Sessions',
    theme: 'light',
    height: 400,
    responsive: true
  };

  // Calculate weekly stats
  $: weeklyStats = aggregateByWeek(sessions);
</script>

<SessionsOverDays data={sessions} {config} />
```

## Integration with P1

For use in the P1 Activity Tracker project:

```bash
npm install @ayola/stats-visualizer
```

Then import components and utilities as needed.

## Development

To develop this component library:

```bash
cd packages/stats-visualizer
npm run dev
npm run build
```

## License

MIT
