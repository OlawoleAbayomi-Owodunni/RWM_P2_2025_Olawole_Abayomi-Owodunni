/**
 * @ayola/stats-visualizer
 * Reusable Svelte component library for visualizing activity tracking statistics
 */

// Export components
export { default as SessionsOverDays } from './charts/SessionsOverDays.svelte';
export { default as AvgRatingPerTask } from './charts/AvgRatingPerTask.svelte';
export { default as SessionRatingsPerTask } from './charts/SessionRatingsPerTask.svelte';
export { default as TasksPerMonth } from './charts/TasksPerMonth.svelte';
export { default as DailyStreakTracker } from './charts/DailyStreakTracker.svelte';
export { FlameTracker } from './components/FlameTracker';

// Export all types
export type {
  ChartConfig,
  ChartDataPoint,
  SessionData,
  TaskData,
  StatsData,
  WeeklyStats,
  MonthlyStats,
  DailyStreak,
  FlameState,
  TrophyState,
  FlameTrackerProps,
  TrophyTrackerProps
} from './types';

// Export utility functions
export {
  aggregateSessionsByDay,
  aggregateByWeek,
  aggregateByMonth,
  getAverageRatingPerTask,
  calculateDailyStreak,
  filterByDateRange,
  getTaskSessions
} from './utils';
