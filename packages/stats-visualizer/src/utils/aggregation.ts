import type { SessionData, TaskData, WeeklyStats, MonthlyStats, DailyStreak } from '../types';

/**
 * Aggregate sessions by day
 */
export function aggregateSessionsByDay(sessions: SessionData[]): Record<string, SessionData[]> {
  return sessions.reduce((acc, session) => {
    const date = new Date(session.date);
    const dateKey = date.toISOString().split('T')[0];
    
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {} as Record<string, SessionData[]>);
}

/**
 * Aggregate sessions by week
 */
export function aggregateByWeek(sessions: SessionData[]): WeeklyStats[] {
  const byWeek = new Map<string, SessionData[]>();
  
  sessions.forEach(session => {
    const date = new Date(session.date);
    const weekStart = getWeekStart(date);
    const weekKey = weekStart.toISOString().split('T')[0];
    
    if (!byWeek.has(weekKey)) {
      byWeek.set(weekKey, []);
    }
    byWeek.get(weekKey)!.push(session);
  });

  return Array.from(byWeek.entries()).map(([weekStart, weeklySessions]) => ({
    week: formatWeekLabel(new Date(weekStart)),
    tasksCompleted: new Set(weeklySessions.map(s => s.taskId)).size,
    totalSessions: weeklySessions.length,
    averageRating: weeklySessions.reduce((sum, s) => sum + s.rating, 0) / weeklySessions.length
  }));
}

/**
 * Aggregate sessions by month
 */
export function aggregateByMonth(sessions: SessionData[]): MonthlyStats[] {
  const byMonth = new Map<string, SessionData[]>();
  
  sessions.forEach(session => {
    const date = new Date(session.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!byMonth.has(monthKey)) {
      byMonth.set(monthKey, []);
    }
    byMonth.get(monthKey)!.push(session);
  });

  return Array.from(byMonth.entries()).map(([monthKey, monthlySessions]) => ({
    month: formatMonthLabel(monthKey),
    tasksCompleted: new Set(monthlySessions.map(s => s.taskId)).size,
    totalSessions: monthlySessions.length,
    averageRating: monthlySessions.reduce((sum, s) => sum + s.rating, 0) / monthlySessions.length
  }));
}

/**
 * Calculate average rating per task
 */
export function getAverageRatingPerTask(sessions: SessionData[]): Record<string, number> {
  const byTask = new Map<string, SessionData[]>();
  
  sessions.forEach(session => {
    if (!byTask.has(session.taskId)) {
      byTask.set(session.taskId, []);
    }
    byTask.get(session.taskId)!.push(session);
  });

  const averages: Record<string, number> = {};
  byTask.forEach((taskSessions, taskId) => {
    const avg = taskSessions.reduce((sum, s) => sum + s.rating, 0) / taskSessions.length;
    averages[taskId] = Math.round(avg * 10) / 10; // Round to 1 decimal
  });

  return averages;
}

/**
 * Calculate daily streak
 */
export function calculateDailyStreak(sessions: SessionData[]): {
  currentStreak: number;
  longestStreak: number;
  details: DailyStreak[];
} {
  const byDay = aggregateSessionsByDay(sessions);
  const dates = Object.keys(byDay).sort();
  
  if (dates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      details: []
    };
  }

  let longestStreak = 0;
  let tempStreak = 0;
  let currentStreak = 0;
  
  const details: DailyStreak[] = [];
  const today = new Date();
  const dayStates: { [key: string]: boolean } = {};
  
  // Mark all days with sessions
  dates.forEach(dateKey => {
    dayStates[dateKey] = true;
  });
  
  // Build 365-day history from today backwards
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    const hasSessions = dateKey in byDay;
    details.push({
      date: new Date(dateKey),
      hasSession: hasSessions,
      sessionCount: hasSessions ? byDay[dateKey].length : 0,
      rating: hasSessions ? (byDay[dateKey].reduce((sum, s) => sum + s.rating, 0) / byDay[dateKey].length) : undefined
    });
  }
  
  // Reverse to go chronologically forward
  details.reverse();
  
  // Calculate streaks by going through days chronologically
  for (let i = 0; i < details.length; i++) {
    if (details[i].hasSession) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Calculate current streak from today backwards
  tempStreak = 0;
  for (let i = details.length - 1; i >= 0; i--) {
    if (details[i].hasSession) {
      tempStreak++;
    } else {
      break;
    }
  }
  currentStreak = tempStreak;
  
  return {
    currentStreak,
    longestStreak,
    details
  };
}

/**
 * Filter sessions by date range
 */
export function filterByDateRange(sessions: SessionData[], startDate: Date, endDate: Date): SessionData[] {
  return sessions.filter(session => {
    const date = new Date(session.date);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Get sessions for a specific task
 */
export function getTaskSessions(sessions: SessionData[], taskId: string): SessionData[] {
  return sessions.filter(session => session.taskId === taskId);
}

/**
 * Helper: Get the start of the week (Monday)
 */
function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Helper: Format week label
 */
function formatWeekLabel(date: Date): string {
  const weekNum = getWeekNumber(date);
  return `Week ${weekNum}, ${date.getFullYear()}`;
}

/**
 * Helper: Get ISO week number
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

/**
 * Helper: Format month label
 */
function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
