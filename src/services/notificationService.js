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

export function sendMedicationReminder(medication) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification('Time to Take Your Medication', {
    body: `It's time to take ${medication.name} - ${medication.dosage}`,
    icon: '/medicine-icon.png', // Add an icon to your public folder
    badge: '/medicine-icon.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
  });

  notification.onclick = function() {
    window.focus();
    this.close();
  };
}