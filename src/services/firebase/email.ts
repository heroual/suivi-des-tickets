import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth } from './config';
import { emailConfigCollection } from './collections';
import type { EmailConfig } from '../../types';

export async function saveEmailConfig(config: EmailConfig): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const configRef = doc(emailConfigCollection, 'config');
    await setDoc(configRef, {
      ...config,
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid
    });
  } catch (error) {
    console.error('Error saving email config:', error);
    throw error;
  }
}

export async function getEmailConfig(): Promise<EmailConfig | null> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const configRef = doc(emailConfigCollection, 'config');
    const configDoc = await getDoc(configRef);
    
    if (configDoc.exists()) {
      return configDoc.data() as EmailConfig;
    }
    return null;
  } catch (error) {
    console.error('Error getting email config:', error);
    throw error;
  }
}