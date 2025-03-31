import webpush from 'web-push';

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:your-email@domain.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function sendPushNotification(subscription, payload) {
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}