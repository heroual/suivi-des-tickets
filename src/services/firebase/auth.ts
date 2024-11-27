import { signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { UserProfile } from '../../types';

export { auth };

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function getUserRole(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    
    const defaultProfile: UserProfile = {
      email: auth.currentUser?.email || '',
      role: auth.currentUser?.email === 'admin@sticket.ma' ? 'admin' : 'viewer'
    };
    
    await setDoc(doc(db, 'users', userId), defaultProfile);
    return defaultProfile;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}