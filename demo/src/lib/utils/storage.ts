import type { SessionData, TaskData } from '@ayola/stats-visualizer';

const SESSIONS_KEY = 'rwm_sessions';
const TASKS_KEY = 'rwm_tasks';
const APP_TIME_KEY = 'rwm_app_time';

/**
 * Save sessions to localStorage
 */
export function saveSessions(sessions: SessionData[]): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
	}
}

/**
 * Save tasks to localStorage
 */
export function saveTasks(tasks: TaskData[]): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
	}
}

/**
 * Retrieve sessions from localStorage
 */
export function getSessions(): SessionData[] {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(SESSIONS_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				console.error('Failed to parse stored sessions');
				return [];
			}
		}
	}
	return [];
}

/**
 * Retrieve tasks from localStorage
 */
export function getTasks(): TaskData[] {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(TASKS_KEY);
		if (stored) {
			try {
				return JSON.parse(stored);
			} catch {
				console.error('Failed to parse stored tasks');
				return [];
			}
		}
	}
	return [];
}

/**
 * Get the current app time (can be different from real time for testing)
 */
export function getAppTime(): Date {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem(APP_TIME_KEY);
		if (stored) {
			try {
				return new Date(stored);
			} catch {
				console.error('Failed to parse stored app time');
				return new Date();
			}
		}
	}
	return new Date();
}

/**
 * Set the app time
 */
export function setAppTime(date: Date): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(APP_TIME_KEY, date.toISOString());
	}
}

/**
 * Advance app time by days
 */
export function advanceAppTime(days: number): Date {
	const currentTime = getAppTime();
	currentTime.setDate(currentTime.getDate() + days);
	setAppTime(currentTime);
	return currentTime;
}

/**
 * Clear all stored data
 */
export function clearStoredData(): void {
	if (typeof window !== 'undefined') {
		localStorage.removeItem(SESSIONS_KEY);
		localStorage.removeItem(TASKS_KEY);
		localStorage.removeItem(APP_TIME_KEY);
	}
}

/**
 * Check if there is any stored data
 */
export function hasStoredData(): boolean {
	if (typeof window !== 'undefined') {
		return localStorage.getItem(SESSIONS_KEY) !== null || localStorage.getItem(TASKS_KEY) !== null;
	}
	return false;
}
