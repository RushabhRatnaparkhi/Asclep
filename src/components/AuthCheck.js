import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function getAuthStatus() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (token) {
      const decoded = await verifyAuth(token.value);
      return !!decoded?.userId;
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
  return false;
} 