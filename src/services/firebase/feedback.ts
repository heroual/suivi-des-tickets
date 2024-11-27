import { addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { feedbackCollection } from './collections';
import type { Feedback } from '../../types';

export async function addFeedback(feedback: Omit<Feedback, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const docRef = await addDoc(feedbackCollection, {
      ...feedback,
      createdAt: Timestamp.fromDate(feedback.createdAt),
      userId: auth.currentUser.uid
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding feedback:', error);
    throw error;
  }
}

export async function updateFeedback(id: string, data: Partial<Feedback>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const feedbackRef = doc(db, 'feedback', id);
    await updateDoc(feedbackRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
}

export async function deleteFeedback(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const feedbackRef = doc(db, 'feedback', id);
    await deleteDoc(feedbackRef);
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const q = query(feedbackCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    } as Feedback));
  } catch (error) {
    console.error('Error getting feedbacks:', error);
    throw error;
  }
}