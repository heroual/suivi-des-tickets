import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from './config';
import { techniciansCollection } from './collections';
import type { Technician } from '../../types/admin';

export async function addTechnician(technician: Omit<Technician, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const docRef = await addDoc(techniciansCollection, {
      ...technician,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      assignedTickets: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding technician:', error);
    throw error;
  }
}

export async function updateTechnician(id: string, data: Partial<Technician>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const technicianRef = doc(techniciansCollection, id);
    await updateDoc(technicianRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating technician:', error);
    throw error;
  }
}

export async function deleteTechnician(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const technicianRef = doc(techniciansCollection, id);
    await deleteDoc(technicianRef);
  } catch (error) {
    console.error('Error deleting technician:', error);
    throw error;
  }
}

export async function getTechnicians(): Promise<Technician[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const q = query(techniciansCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Technician));
  } catch (error) {
    console.error('Error getting technicians:', error);
    throw error;
  }
}