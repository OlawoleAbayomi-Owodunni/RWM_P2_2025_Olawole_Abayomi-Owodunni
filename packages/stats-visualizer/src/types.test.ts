import { describe, it, expect } from 'vitest';
import type { SessionData, TaskData, ChartConfig } from '../types';

describe('Type Definitions', () => {
  describe('SessionData', () => {
    it('should have required properties', () => {
      const session: SessionData = {
        id: 'session-1',
        taskId: 'task-1',
        rating: 4,
        duration: 60,
        date: '2024-12-01',
        notes: 'Test session'
      };

      expect(session).toHaveProperty('id');
      expect(session).toHaveProperty('taskId');
      expect(session).toHaveProperty('rating');
      expect(session).toHaveProperty('duration');
      expect(session).toHaveProperty('date');
      expect(session).toHaveProperty('notes');
    });

    it('should accept valid rating values (1-5)', () => {
      for (let rating = 1; rating <= 5; rating++) {
        const session: SessionData = {
          id: 'session-1',
          taskId: 'task-1',
          rating: rating,
          duration: 60,
          date: '2024-12-01',
          notes: ''
        };
        expect(session.rating).toBe(rating);
      }
    });

    it('should accept positive duration values', () => {
      const durations = [15, 30, 60, 120, 300];
      durations.forEach(duration => {
        const session: SessionData = {
          id: 'session-1',
          taskId: 'task-1',
          rating: 4,
          duration: duration,
          date: '2024-12-01',
          notes: ''
        };
        expect(session.duration).toBe(duration);
      });
    });

    it('should accept ISO date strings', () => {
      const dates = ['2024-12-01', '2024-01-15', '2024-12-31'];
      dates.forEach(date => {
        const session: SessionData = {
          id: 'session-1',
          taskId: 'task-1',
          rating: 4,
          duration: 60,
          date: date,
          notes: ''
        };
        expect(session.date).toBe(date);
      });
    });
  });

  describe('TaskData', () => {
    it('should have required properties', () => {
      const task: TaskData = {
        id: 'task-1',
        title: 'Test Task',
        description: 'A test task',
        sessions: [],
        completedAt: Math.floor(Date.now() / 1000),
        totalSessions: 5,
        averageRating: 4.2
      };

      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('description');
      expect(task).toHaveProperty('sessions');
      expect(task).toHaveProperty('completedAt');
      expect(task).toHaveProperty('totalSessions');
      expect(task).toHaveProperty('averageRating');
    });

    it('should handle completedAt as Unix timestamp', () => {
      const now = Math.floor(Date.now() / 1000);
      const task: TaskData = {
        id: 'task-1',
        title: 'Test Task',
        description: 'A test task',
        sessions: [],
        completedAt: now,
        totalSessions: 0,
        averageRating: 0
      };

      expect(typeof task.completedAt).toBe('number');
      expect(task.completedAt).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
    });

    it('should accept empty sessions array', () => {
      const task: TaskData = {
        id: 'task-1',
        title: 'Test Task',
        description: 'A test task',
        sessions: [],
        completedAt: Math.floor(Date.now() / 1000),
        totalSessions: 0,
        averageRating: 0
      };

      expect(Array.isArray(task.sessions)).toBe(true);
      expect(task.sessions.length).toBe(0);
    });

    it('should accept sessions with data', () => {
      const sessions: SessionData[] = [
        {
          id: 'session-1',
          taskId: 'task-1',
          rating: 4,
          duration: 60,
          date: '2024-12-01',
          notes: ''
        }
      ];

      const task: TaskData = {
        id: 'task-1',
        title: 'Test Task',
        description: 'A test task',
        sessions: sessions,
        completedAt: Math.floor(Date.now() / 1000),
        totalSessions: 1,
        averageRating: 4.0
      };

      expect(task.sessions.length).toBe(1);
      expect(task.sessions[0].id).toBe('session-1');
    });
  });

  describe('ChartConfig', () => {
    it('should have required properties', () => {
      const config: ChartConfig = {
        title: 'Test Chart',
        theme: 'light',
        height: 400,
        responsive: true
      };

      expect(config).toHaveProperty('title');
      expect(config).toHaveProperty('theme');
      expect(config).toHaveProperty('height');
      expect(config).toHaveProperty('responsive');
    });

    it('should accept both light and dark themes', () => {
      const lightConfig: ChartConfig = {
        title: 'Test',
        theme: 'light',
        height: 400,
        responsive: true
      };

      const darkConfig: ChartConfig = {
        title: 'Test',
        theme: 'dark',
        height: 400,
        responsive: true
      };

      expect(lightConfig.theme).toBe('light');
      expect(darkConfig.theme).toBe('dark');
    });

    it('should accept various height values', () => {
      const heights = [300, 400, 500, 600];
      heights.forEach(height => {
        const config: ChartConfig = {
          title: 'Test',
          theme: 'light',
          height: height,
          responsive: true
        };
        expect(config.height).toBe(height);
      });
    });

    it('should accept optional properties', () => {
      const config: ChartConfig = {
        title: 'Test',
        theme: 'light',
        height: 400,
        responsive: true,
        width: 800,
        showLegend: true,
        dateRange: { start: '2024-12-01', end: '2024-12-31' }
      };

      expect(config.width).toBe(800);
      expect(config.showLegend).toBe(true);
      expect(config.dateRange).toBeDefined();
    });
  });
});
