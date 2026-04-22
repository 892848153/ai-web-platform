
// Daily update utility for AI hot technologies

interface UpdateSchedule {
  time: string; // HH:MM format (24-hour)
  task: () => Promise<void> | void;
  lastRun?: string; // ISO date string
}

export class DailyUpdateScheduler {
  private schedules: UpdateSchedule[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startScheduler();
  }

  // Add a daily task
  addDailyTask(time: string, task: () => Promise<void> | void): void {
    this.schedules.push({ time, task });
  }

  // Start the scheduler
  private startScheduler(): void {
    // Check every minute for scheduled tasks
    this.checkInterval = setInterval(() => {
      this.checkScheduledTasks();
    }, 60000); // 1 minute

    // Also check immediately on startup
    this.checkScheduledTasks();
  }

  // Check if any tasks should run
  private checkScheduledTasks(): void {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const today = now.toISOString().split('T')[0];

    this.schedules.forEach(schedule => {
      // Check if it's time to run and hasn't run today
      if (currentTime === schedule.time && schedule.lastRun !== today) {
        console.log(`Running scheduled task at ${currentTime}`);
        schedule.task();
        schedule.lastRun = today;
      }
    });
  }

  // Stop the scheduler
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  // Force run all tasks (for testing)
  forceRunAll(): void {
    this.schedules.forEach(schedule => {
      console.log('Force running task:', schedule.time);
      schedule.task();
    });
  }

  // Clear cache for today's data
  clearTodayCache(): void {
    const today = new Date().toISOString().split('T')[0];
    localStorage.removeItem(`dailyHotAI_${today}`);
    console.log('Cleared today\'s cache');
  }

  // Check if cache exists for today
  static hasTodayCache(): boolean {
    const today = new Date().toISOString().split('T')[0];
    return !!localStorage.getItem(`dailyHotAI_${today}`);
  }

  // Get cache age in hours
  static getCacheAge(): number {
    const today = new Date().toISOString().split('T')[0];
    const cachedData = localStorage.getItem(`dailyHotAI_${today}`);

    if (!cachedData) return Infinity;

    try {
      const data = JSON.parse(cachedData);
      const cacheDate = new Date(data.date + 'T00:00:00.000Z');
      const now = new Date();
      const diffMs = now.getTime() - cacheDate.getTime();
      return diffMs / (1000 * 60 * 60); // Convert to hours
    } catch {
      return Infinity;
    }
  }
}

// Create and export a singleton instance
export const dailyUpdateScheduler = new DailyUpdateScheduler();

// Function to force refresh daily hot AI data
export const refreshDailyHotAI = async (): Promise<void> => {
  try {
    // Clear today's cache
    dailyUpdateScheduler.clearTodayCache();

    // Force component to refetch data
    if (typeof window !== 'undefined') {
      // Dispatch a custom event that components can listen to
      window.dispatchEvent(new CustomEvent('refreshDailyHotAI'));
    }

    console.log('Daily Hot AI data refresh triggered');
  } catch (error) {
    console.error('Failed to refresh Daily Hot AI data:', error);
  }
};

// Initialize daily tasks
export const initializeDailyUpdates = (): void => {
  // Schedule daily refresh at 8:00 AM
  dailyUpdateScheduler.addDailyTask('08:00', async () => {
    console.log('Running scheduled daily refresh at 8:00 AM');
    await refreshDailyHotAI();
  });

  console.log('Daily update scheduler initialized');
};

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  initializeDailyUpdates();
}

