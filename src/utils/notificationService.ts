// Notification Service for managing app notifications and reminders

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'task' | 'alarm' | 'reminder' | 'digest' | 'achievement';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Alarm {
  id: string;
  title: string;
  time: string; // HH:MM format
  enabled: boolean;
  repeat: boolean;
  days?: number[]; // 0-6 for Sunday-Saturday
  sound?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private alarms: Alarm[] = [];
  private listeners: Set<() => void> = new Set();
  private permissionGranted: boolean = false;

  constructor() {
    this.loadFromStorage();
    this.requestPermissions();
    this.startAlarmChecker();
    this.registerServiceWorker();
  }

  // Register service worker for background notifications
  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Request notification permissions with proper UI prompt
  async requestPermissions(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permissionGranted = true;
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notifications are blocked. Please enable them in browser settings.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permissionGranted = permission === 'granted';
      
      if (this.permissionGranted) {
        // Send a test notification to confirm it works
        this.sendBrowserNotification({
          id: 'test',
          title: '🎉 Notifications Enabled!',
          message: 'You will now receive alerts for tasks, alarms, and reminders.',
          type: 'achievement',
          timestamp: new Date(),
          read: false,
          priority: 'medium',
        });
      }
      
      return this.permissionGranted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Check if notifications are supported and enabled
  isNotificationSupported(): boolean {
    return 'Notification' in window;
  }

  isNotificationEnabled(): boolean {
    return this.permissionGranted || Notification.permission === 'granted';
  }

  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveToStorage();
    this.notifyListeners();

    // Send browser notification if permitted
    if (this.isNotificationEnabled()) {
      this.sendBrowserNotification(newNotification);
    }

    return newNotification;
  }

  // Send browser notification
  private sendBrowserNotification(notification: Notification) {
    if (!this.isNotificationEnabled()) return;

    try {
      const options: NotificationOptions = {
        body: notification.message,
        icon: '/app-icon.png',
        badge: '/app-icon.png',
        tag: notification.id,
        requireInteraction: notification.priority === 'high',
        silent: false,
      };

      const browserNotif = new Notification(notification.title, options);

      browserNotif.onclick = () => {
        window.focus();
        this.markAsRead(notification.id);
        if (notification.actionUrl) {
          window.location.href = notification.actionUrl;
        }
      };

      // Vibrate if supported (for mobile)
      if ('vibrate' in navigator && notification.priority === 'high') {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.error('Error sending browser notification:', error);
    }
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Delete notification
  deleteNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveToStorage();
    this.notifyListeners();
  }

  // Alarm management
  addAlarm(alarm: Omit<Alarm, 'id'>) {
    const newAlarm: Alarm = {
      ...alarm,
      id: crypto.randomUUID(),
    };
    this.alarms.push(newAlarm);
    this.saveToStorage();
    this.notifyListeners();
    return newAlarm;
  }

  getAlarms(): Alarm[] {
    return [...this.alarms];
  }

  updateAlarm(id: string, updates: Partial<Alarm>) {
    const alarm = this.alarms.find(a => a.id === id);
    if (alarm) {
      Object.assign(alarm, updates);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  deleteAlarm(id: string) {
    this.alarms = this.alarms.filter(a => a.id !== id);
    this.saveToStorage();
    this.notifyListeners();
  }

  toggleAlarm(id: string) {
    const alarm = this.alarms.find(a => a.id === id);
    if (alarm) {
      alarm.enabled = !alarm.enabled;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Schedule a reminder for a specific time
  scheduleReminder(title: string, message: string, time: Date) {
    const now = new Date();
    const delay = time.getTime() - now.getTime();
    
    if (delay > 0) {
      setTimeout(() => {
        this.addNotification({
          title,
          message,
          type: 'reminder',
          priority: 'high',
        });
      }, delay);
    }
  }

  // Check alarms every minute
  private startAlarmChecker() {
    // Check immediately
    this.checkAlarms();
    
    // Then check every 30 seconds
    setInterval(() => {
      this.checkAlarms();
    }, 30000);
  }

  private checkAlarms() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const currentDay = now.getDay();

    this.alarms.forEach(alarm => {
      if (!alarm.enabled) return;

      const alarmTime = alarm.time;
      if (alarmTime === currentTime) {
        // Check if it's a repeating alarm and if today is included
        if (alarm.repeat && alarm.days && !alarm.days.includes(currentDay)) {
          return;
        }

        // Trigger alarm
        this.triggerAlarm(alarm);
      }
    });
  }

  private triggerAlarm(alarm: Alarm) {
    // Add notification
    this.addNotification({
      title: '⏰ Alarm',
      message: alarm.title,
      type: 'alarm',
      priority: 'high',
    });

    // Play sound
    this.playAlarmSound();

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500]);
    }
  }

  private playAlarmSound() {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Error playing alarm sound:', error);
    }
  }

  // Daily digest
  generateDailyDigest() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const completedToday = tasks.filter((t: any) => {
      const today = new Date().toDateString();
      return t.completed && new Date(t.completedAt).toDateString() === today;
    });

    const pendingTasks = tasks.filter((t: any) => !t.completed);

    this.addNotification({
      title: '📊 Daily Digest',
      message: `Completed: ${completedToday.length} tasks | Pending: ${pendingTasks.length} tasks`,
      type: 'digest',
      priority: 'medium',
    });
  }

  // Send a test notification
  async sendTestNotification() {
    const hasPermission = await this.requestPermissions();
    if (hasPermission) {
      this.addNotification({
        title: '🔔 Test Notification',
        message: 'Notifications are working correctly!',
        type: 'reminder',
        priority: 'medium',
      });
      return true;
    }
    return false;
  }

  // Subscribe to changes
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // Storage
  private saveToStorage() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
    localStorage.setItem('alarms', JSON.stringify(this.alarms));
  }

  private loadFromStorage() {
    try {
      const savedNotifications = localStorage.getItem('notifications');
      const savedAlarms = localStorage.getItem('alarms');

      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
      }

      if (savedAlarms) {
        this.alarms = JSON.parse(savedAlarms);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }
}

export const notificationService = new NotificationService();