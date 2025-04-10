'use client';

import { useState, useEffect } from 'react';

export default function MedicationReminder() {
  const checkMedications = async () => {
    try {
      // Get medications
      const response = await fetch('/api/medications', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch medications');
      const medications = await response.json();

      // Get current time
      const now = new Date();
      
      medications.forEach(medication => {
        if (!medication.nextDoseTime) return;
        
        const nextDose = new Date(medication.nextDoseTime);
        
        // Check if it's time for medication (within the last minute)
        const timeDiff = Math.abs(now - nextDose);
        if (timeDiff <= 60000) { // 60000 milliseconds = 1 minute
          alert(`🔔 Medication Reminder!\n\nIt's time to take ${medication.name}\nDosage: ${medication.dosage}`);
        }
      });
    } catch (error) {
      console.error('Medication check error:', error);
    }
  };

  useEffect(() => {
    // Check immediately when component mounts
    checkMedications();

    // Set up interval to check every minute
    const timer = setInterval(checkMedications, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  // Add console log to verify component is mounted
  console.log('MedicationReminder mounted');

  return null;
}