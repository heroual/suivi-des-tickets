import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from './config';
import { actionPlansCollection, actionCausesCollection } from './collections';
import type { ActionPlan, ActionCause } from '../../types';
import { nanoid } from 'nanoid';

// Action Plans
export async function addActionPlan(plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const now = new Date();
    const docRef = await addDoc(actionPlansCollection, {
      ...plan,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      id: nanoid()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding action plan:', error);
    throw error;
  }
}

export async function updateActionPlan(id: string, data: Partial<ActionPlan>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const planRef = doc(actionPlansCollection, id);
    await updateDoc(planRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating action plan:', error);
    throw error;
  }
}

export async function deleteActionPlan(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const planRef = doc(actionPlansCollection, id);
    await deleteDoc(planRef);
  } catch (error) {
    console.error('Error deleting action plan:', error);
    throw error;
  }
}

export async function getActionPlans(): Promise<ActionPlan[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const q = query(actionPlansCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        dueDate: data.dueDate ? data.dueDate.toDate() : undefined
      } as ActionPlan;
    });
  } catch (error) {
    console.error('Error getting action plans:', error);
    throw error;
  }
}

// Action Causes
export async function addActionCause(cause: Omit<ActionCause, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const now = new Date();
    const docRef = await addDoc(actionCausesCollection, {
      ...cause,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      id: nanoid()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding action cause:', error);
    throw error;
  }
}

export async function updateActionCause(id: string, data: Partial<ActionCause>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const causeRef = doc(actionCausesCollection, id);
    await updateDoc(causeRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating action cause:', error);
    throw error;
  }
}

export async function deleteActionCause(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const causeRef = doc(actionCausesCollection, id);
    await deleteDoc(causeRef);
  } catch (error) {
    console.error('Error deleting action cause:', error);
    throw error;
  }
}

export async function getActionCauses(): Promise<ActionCause[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const q = query(actionCausesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as ActionCause;
    });
  } catch (error) {
    console.error('Error getting action causes:', error);
    throw error;
  }
}