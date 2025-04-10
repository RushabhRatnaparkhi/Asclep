import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'PPP');
};

export const formatTime = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'p');
};

export const formatRelativeTime = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};