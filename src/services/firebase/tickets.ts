import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, writeBatch, Timestamp } from 'firebase/firestore';
import { db, auth } from './config';
import { ticketsCollection } from './collections';
import type { Ticket } from '../../types';

export async function addTicket(ticket: Omit<Ticket, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const docRef = await addDoc(ticketsCollection, {
      ...ticket,
      dateCreation: Timestamp.fromDate(ticket.dateCreation),
      dateCloture: ticket.dateCloture ? Timestamp.fromDate(ticket.dateCloture) : null,
      createdAt: Timestamp.now(),
      userId: auth.currentUser.uid,
      imported: false
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const ticketRef = doc(db, 'tickets', id);
    const updateData: Record<string, any> = {
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid
    };

    if (data.dateCreation) {
      updateData.dateCreation = Timestamp.fromDate(data.dateCreation);
    }
    if (data.dateCloture) {
      updateData.dateCloture = Timestamp.fromDate(data.dateCloture);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'dateCreation' && key !== 'dateCloture') {
        updateData[key] = value;
      }
    });

    await updateDoc(ticketRef, updateData);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}

export async function getTickets(): Promise<Ticket[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const q = query(ticketsCollection, orderBy('dateCreation', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateCreation: data.dateCreation instanceof Timestamp ? data.dateCreation.toDate() : new Date(data.dateCreation),
        dateCloture: data.dateCloture instanceof Timestamp ? data.dateCloture?.toDate() : data.dateCloture ? new Date(data.dateCloture) : undefined,
        imported: data.imported || false
      } as Ticket;
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
}

export async function addMultipleTickets(tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]): Promise<Ticket[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const batch = writeBatch(db);
    const newTickets: Ticket[] = [];

    for (const ticket of tickets) {
      const docRef = doc(ticketsCollection);
      const newTicket: Omit<Ticket, 'id'> = {
        ...ticket,
        reopened: false,
        reopenCount: 0,
        imported: true
      };

      batch.set(docRef, {
        ...newTicket,
        dateCreation: Timestamp.fromDate(ticket.dateCreation),
        dateCloture: ticket.dateCloture ? Timestamp.fromDate(ticket.dateCloture) : null,
        createdAt: Timestamp.now(),
        userId: auth.currentUser.uid
      });

      newTickets.push({ ...newTicket, id: docRef.id } as Ticket);
    }

    await batch.commit();
    return newTickets;
  } catch (error) {
    console.error('Error adding multiple tickets:', error);
    throw error;
  }
}