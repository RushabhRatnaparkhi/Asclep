import { sendNotification } from '@/utils/notifications';

export class ReminderService {
  static checkMedications(medications) {
    if (!medications) return;

    medications.forEach(medication => {
      if (!medication.reminders.enabled || medication.status !== 'active') return;

      const now = new Date();
      const nextDose = new Date(medication.nextDoseTime);

      // Check if it's time for medication
      if (nextDose <= now) {
        this.sendMedicationReminder(medication);
      }
    });
  }

  static sendMedicationReminder(medication) {
    const title = `Time to take ${medication.name}`;
    const body = `Dosage: ${medication.dosage}\nInstructions: ${medication.instructions || 'Take as prescribed'}`;

    sendNotification(title, {
      body,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      data: { medicationId: medication._id }
    });
  }
}