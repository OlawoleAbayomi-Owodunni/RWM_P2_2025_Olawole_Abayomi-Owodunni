/**
 * @ayola/stats-visualizer
 * Reusable Svelte component library for visualizing activity tracking statistics
 */

// Export components
export { default as SessionsOverDays } from './charts/SessionsOverDays.svelte';

// Export all types
export type {
  ChartConfig,
  ChartDataPoint,
  SessionData,
  TaskData,
  StatsData,
  WeeklyStats,
  MonthlyStats,
  DailyStreak
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
