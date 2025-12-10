/**
 * Configuration options for chart components
 */
export interface ChartConfig {
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

/**
 * Generic chart data point structure
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

/**
 * Session data from Activity Tracker P1
 * Represents a single study/work session
 */
export interface SessionData {
  id: string;
  taskId: string;
  rating: number; // 1-5 stars
  duration: number; // in minutes
  date: Date | string;
  notes?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * Task data from Activity Tracker P1
 * Represents a task/project
 */
export interface TaskData {
  id: string;
  title: string;
  description?: string;
  sessions?: SessionData[];
  totalSessions?: number;
  averageRating?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  completedAt?: number; // Unix timestamp when task was completed
}

/**
 * Aggregated statistics data
 */
export interface StatsData {
  totalSessions: number;
  averageRating: number;
  totalDuration: number;
  streakDays: number;
  longestStreak: number;
  tasksCompleted: number;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Weekly aggregation data
 */
export interface WeeklyStats {
  week: string; // e.g., "Week 1, 2024"
  tasksCompleted: number;
  totalSessions: number;
  averageRating: number;
}

/**
 * Monthly aggregation data
 */
export interface MonthlyStats {
  month: string; // e.g., "January 2024"
  tasksCompleted: number;
  totalSessions: number;
  averageRating: number;
}

/**
 * Daily streak data for streak tracker
 */
export interface DailyStreak {
  date: Date;
  hasSession: boolean;
  sessionCount: number;
  rating?: number;
}

/**
 * Flame state for FlameTracker component
 * Tracks session-based motivation metric
 */
export interface FlameState {
  size: number; // 0-100 (percentage of max size)
  level: 0 | 1 | 2 | 3; // Visual intensity: 0=smolder, 1=low, 2=medium, 3=high
  sessionCount: number; // Total sessions (all-time, never resets)
  lastSessionDate?: Date | string; // Most recent session
  daysSinceLast: number; // Days since last session
}

/**
 * Trophy state for TrophyTracker component
 * Tracks monthly task achievement metric
 */
export interface TrophyState {
  size: number; // 0-100 (percentage of max size)
  monthlyCount: number; // Tasks completed this month
  currentMonth: string; // 'YYYY-MM' for reset tracking
  lastTaskDate?: Date | string; // Most recent task
  shine: boolean; // Animation trigger for milestone achievement
}

/**
 * FlameTracker component props
 */
export interface FlameTrackerProps {
  data: SessionData[];
  config?: ChartConfig;
}

/**
 * TrophyTracker component props
 */
export interface TrophyTrackerProps {
  data: TaskData[];
  config?: ChartConfig;
}
