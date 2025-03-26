export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function sendNotification(title, options = {}) {
  if (Notification.permission === "granted") {
    return new Notification(title, {
      icon: '/medication-icon.png', // Add an icon to your public folder
      badge: '/medication-badge.png',
      ...options
    });
  }
} 