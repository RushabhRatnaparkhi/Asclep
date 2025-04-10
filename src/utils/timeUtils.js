export function getTimeUntilNextDose(nextDoseTime) {
  const now = new Date();
  const next = new Date(nextDoseTime);
  const diff = next - now;

  if (diff < 0) {
    return 'Dose overdue';
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} remaining`;
  }

  if (hours === 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} remaining`;
  }

  return `${hours}h ${minutes}m remaining`;
}