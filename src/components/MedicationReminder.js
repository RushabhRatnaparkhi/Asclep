'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission } from '@/utils/notifications';
import { ReminderService } from '@/services/reminderService';

export default function MedicationReminder() {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      const granted = await requestNotificationPermission();
      setPermissionGranted(granted);
    }

    setupNotifications();
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    // Check medications every minute
    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/medications/upcoming');
        const medications = await response.json();
        ReminderService.checkMedications(medications);
      } catch (error) {
        console.error('Failed to check medications:', error);
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [permissionGranted]);

  return null; // This is a background component
}