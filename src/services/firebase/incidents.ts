import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from './config';
import { incidentCausesCollection } from './collections';
import type { IncidentCause } from '../../types/admin';

export async function addIncidentCause(cause: Omit<IncidentCause, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const docRef = await addDoc(incidentCausesCollection, {
      ...cause,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      occurrences: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding incident cause:', error);
    throw error;
  }
}

export async function updateIncidentCause(id: string, data: Partial<IncidentCause>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const causeRef = doc(incidentCausesCollection, id);
    await updateDoc(causeRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating incident cause:', error);
    throw error;
  }
}

export async function deleteIncidentCause(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const causeRef = doc(incidentCausesCollection, id);
    await deleteDoc(causeRef);
  } catch (error) {
    console.error('Error deleting incident cause:', error);
    throw error;
  }
}

export async function getIncidentCauses(): Promise<IncidentCause[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const q = query(incidentCausesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as IncidentCause));
  } catch (error) {
    console.error('Error getting incident causes:', error);
    throw error;
  }
}