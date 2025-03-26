import { sendNotification } from '@/utils/notifications';

class ReminderService {
  constructor() {
    this.reminders = new Map();
  }

  scheduleReminder(medication) {
    if (!medication.reminderEnabled) return;

    // Define times for different parts of the day
    const times = {
      'morning': 9,    // 9 AM
      'afternoon': 14, // 2 PM
      'evening': 18,   // 6 PM
      'night': 22,     // 10 PM
    };

    medication.timeOfDay.forEach(time => {
      const hour = times[time];
      const reminderId = `${medication._id}-${time}`;
      
      // Calculate next reminder time
      const now = new Date();
      let reminderTime = new Date();
      reminderTime.setHours(hour, 0, 0, 0);

      if (reminderTime <= now) {
        reminderTime.setDate(reminderTime.getDate() + 1);
      }

      // Schedule the notification
      const timeoutId = setTimeout(() => {
        sendNotification(`Time to take ${medication.name}`, {
          body: `Dosage: ${medication.dosage}`,
          data: { medicationId: medication._id },
          requireInteraction: true,
          actions: [
            { action: 'take', title: 'Take Now' },
            { action: 'snooze', title: 'Remind me later' }
          ]
        });
        
        // Reschedule for next day
        this.scheduleReminder(medication);
      }, reminderTime - now);

      this.reminders.set(reminderId, timeoutId);
    });
  }

  cancelReminder(medicationId) {
    ['morning', 'afternoon', 'evening', 'night'].forEach(time => {
      const reminderId = `${medicationId}-${time}`;
      if (this.reminders.has(reminderId)) {
        clearTimeout(this.reminders.get(reminderId));
        this.reminders.delete(reminderId);
      }
    });
  }
}

export const reminderService = new ReminderService(); 