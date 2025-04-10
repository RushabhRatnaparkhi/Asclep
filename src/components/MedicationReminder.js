'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, sendMedicationReminder } from '@/services/notificationService';

export default function MedicationReminder() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    async function setupNotifications() {
      const granted = await requestNotificationPermission();
      setHasPermission(granted);
    }
    setupNotifications();
  }, []);

  useEffect(() => {
    if (!hasPermission) return;

    // Check medications every minute
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/medications/upcoming', {
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to fetch medications');
        
        const medications = await response.json();
        const now = new Date();

        medications.forEach(medication => {
          const nextDose = new Date(medication.nextDoseTime);
          // If it's time for medication (within the last minute)
          if (nextDose <= now && nextDose > new Date(now - 60000)) {
            sendMedicationReminder(medication);
          }
        });
      } catch (error) {
        console.error('Failed to check medications:', error);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [hasPermission]);

  return null; // This is a background component
}