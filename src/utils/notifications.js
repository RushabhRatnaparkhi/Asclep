export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export function sendNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    new Notification(title, {
      icon: '/medication-icon.png',
      badge: '/medication-icon.png',
      ...options
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}