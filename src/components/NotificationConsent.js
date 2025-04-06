'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function NotificationConsent() {
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState('default');

  const urlBase64ToUint8Array = (base64String) => {
    try {
      // Remove whitespace and validate key
      const vapidKey = base64String.trim();
      if (!vapidKey) {
        throw new Error('Empty VAPID key');
      }

      // Convert URL-safe characters back to standard base64
      const base64 = vapidKey
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      // Add padding if needed
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const paddedBase64 = base64 + padding;

      // Decode base64 to binary string
      const binaryString = window.atob(paddedBase64);
      
      // Convert to Uint8Array
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      return uint8Array;
    } catch (error) {
      console.error('VAPID key conversion error:', error);
      throw new Error('Invalid VAPID key format');
    }
  };

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const setupNotifications = async () => {
    setIsLoading(true);
    let swRegistration = null;

    try {
      // Check browser support
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        throw new Error('Push notifications are not supported');
      }

      // Request permission first
      const permissionResult = await Notification.requestPermission();
      if (permissionResult !== 'granted') {
        throw new Error('Notification permission denied');
      }
      setPermission(permissionResult);

      // Get and validate VAPID key before any service worker operations
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        throw new Error('VAPID public key is not configured');
      }

      // Convert VAPID key
      const applicationServerKey = urlBase64ToUint8Array(vapidKey);

      // Register service worker
      swRegistration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      // Wait for the service worker to be ready
      const activeServiceWorker = await navigator.serviceWorker.ready;
      console.log('[Notification] Service Worker is active');

      // Check for existing subscription first
      let subscription = await activeServiceWorker.pushManager.getSubscription();
      
      if (!subscription) {
        // Create new subscription if none exists
        subscription = await activeServiceWorker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey
        });
        console.log('[Notification] Created new push subscription');
      }

      // Save subscription to server
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save subscription');
      }

      toast.success('Notifications enabled successfully');
    } catch (error) {
      console.error('[Notification] Setup failed:', error);
      
      // Clean up on error
      if (swRegistration) {
        try {
          const subscription = await swRegistration.pushManager.getSubscription();
          if (subscription) {
            await subscription.unsubscribe();
          }
          await swRegistration.unregister();
        } catch (cleanupError) {
          console.error('[Notification] Cleanup failed:', cleanupError);
        }
      }
      
      setPermission('default');
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg mb-4">
      <h3 className="font-semibold mb-2">Enable Notifications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Get notified when it's time to take your medications
      </p>
      {permission !== 'granted' && (
        <button
          onClick={setupNotifications}
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 
                     transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Enabling...' : 'Enable Notifications'}
        </button>
      )}
      {permission === 'granted' && (
        <p className="text-green-600">✓ Notifications are enabled</p>
      )}
    </div>
  );
}