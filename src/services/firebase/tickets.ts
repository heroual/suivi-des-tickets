import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, writeBatch, Timestamp, collection, where } from 'firebase/firestore';
import { db, auth } from './config';
import { ticketsCollection } from './collections';
import type { Ticket } from '../../types';
import { nanoid } from 'nanoid';
import { validateTicketData } from '../../utils/ticketValidation';

async function checkTicketExists(ndLogin: string, dateCreation: Date): Promise<boolean> {
  const q = query(
    ticketsCollection,
    where('ndLogin', '==', ndLogin),
    where('dateCreation', '==', Timestamp.fromDate(dateCreation))
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function addTicket(ticket: Omit<Ticket, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const validatedTicket = validateTicketData(ticket);
    
    // Check if ticket already exists
    const exists = await checkTicketExists(validatedTicket.ndLogin, validatedTicket.dateCreation);
    if (exists) {
      throw new Error('Ticket already exists');
    }

    const docRef = await addDoc(ticketsCollection, {
      ...validatedTicket,
      dateCreation: Timestamp.fromDate(validatedTicket.dateCreation),
      dateCloture: validatedTicket.dateCloture ? Timestamp.fromDate(validatedTicket.dateCloture) : null,
      createdAt: Timestamp.now(),
      userId: auth.currentUser.uid,
      imported: false,
      reopened: false,
      reopenCount: 0
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
}

export async function addMultipleTickets(tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]): Promise<{ 
  success: number;
  failed: { index: number; error: string }[];
  duplicates: number;
}> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  const results = {
    success: 0,
    failed: [] as { index: number; error: string }[],
    duplicates: 0
  };

  try {
    const chunkSize = 500; // Firestore batch limit
    const chunks = [];
    for (let i = 0; i < tickets.length; i += chunkSize) {
      chunks.push(tickets.slice(i, i + chunkSize));
    }

    for (const [chunkIndex, chunk] of chunks.entries()) {
      const batch = writeBatch(db);
      const validatedChunk: any[] = [];

      // Validate and check duplicates for each ticket
      for (const [ticketIndex, ticket] of chunk.entries()) {
        try {
          const validatedTicket = validateTicketData(ticket);
          
          // Check for duplicates
          const exists = await checkTicketExists(validatedTicket.ndLogin, validatedTicket.dateCreation);
          if (exists) {
            results.duplicates++;
            continue;
          }

          validatedChunk.push({
            ...validatedTicket,
            id: nanoid(),
            dateCreation: Timestamp.fromDate(validatedTicket.dateCreation),
            dateCloture: validatedTicket.dateCloture ? Timestamp.fromDate(validatedTicket.dateCloture) : null,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            userId: auth.currentUser.uid,
            imported: true,
            reopened: false,
            reopenCount: 0
          });
        } catch (error) {
          const globalIndex = chunkIndex * chunkSize + ticketIndex;
          results.failed.push({
            index: globalIndex,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Add valid tickets to batch
      for (const validTicket of validatedChunk) {
        const docRef = doc(collection(db, 'tickets'));
        batch.set(docRef, validTicket);
        results.success++;
      }

      // Commit the batch if there are valid tickets
      if (validatedChunk.length > 0) {
        await batch.commit();
      }
    }

    return results;
  } catch (error) {
    console.error('Error adding multiple tickets:', error);
    throw error;
  }
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const ticketRef = doc(ticketsCollection, id);
    const updateData: Record<string, any> = {
      ...data,
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid
    };

    if (data.dateCreation) {
      updateData.dateCreation = Timestamp.fromDate(data.dateCreation);
    }
    if (data.dateCloture) {
      updateData.dateCloture = Timestamp.fromDate(data.dateCloture);
    }

    await updateDoc(ticketRef, updateData);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}

export async function deleteTicket(id: string): Promise<void> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const ticketRef = doc(ticketsCollection, id);
    await deleteDoc(ticketRef);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const q = query(ticketsCollection, orderBy('dateCreation', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ndLogin: data.ndLogin,
        serviceType: data.serviceType,
        dateCreation: data.dateCreation?.toDate() || new Date(),
        dateCloture: data.dateCloture?.toDate(),
        description: data.description,
        cause: data.cause,
        causeType: data.causeType,
        technician: data.technician,
        status: data.status,
        delaiRespect: data.delaiRespect,
        reopened: data.reopened || false,
        reopenCount: data.reopenCount || 0,
        motifCloture: data.motifCloture,
        imported: data.imported || false
      } as Ticket;
    });
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
}