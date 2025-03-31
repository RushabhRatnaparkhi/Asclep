'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NotificationConsent() {
  const [permission, setPermission] = useState('default');

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });

      toast.success('Notifications enabled successfully!');
    } catch (error) {
      toast.error('Failed to enable notifications');
    }
  };

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        await registerServiceWorker();
      }
    } catch (error) {
      toast.error('Failed to request notification permission');
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Enable Medication Reminders</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get notified when it's time to take your medications
      </p>
      {permission !== 'granted' && (
        <button
          onClick={requestPermission}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Enable Notifications
        </button>
      )}
    </div>
  );
}