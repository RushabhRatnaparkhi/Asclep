import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('token')?.value;
    
    if (!token) {
      throw new Error('No token found');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
}