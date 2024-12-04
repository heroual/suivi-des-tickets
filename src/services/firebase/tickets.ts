import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, writeBatch, Timestamp, collection } from 'firebase/firestore';
import { db, auth } from './config';
import { ticketsCollection } from './collections';
import type { Ticket } from '../../types';
import { nanoid } from 'nanoid';

// Helper function to validate and format ticket data
function validateTicketData(data: any): Omit<Ticket, 'id'> {
  const dateCreation = data.dateCreation instanceof Date ? data.dateCreation : new Date(data.dateCreation);
  const dateCloture = data.dateCloture ? (data.dateCloture instanceof Date ? data.dateCloture : new Date(data.dateCloture)) : undefined;

  if (isNaN(dateCreation.getTime())) {
    throw new Error(`Invalid creation date: ${data.dateCreation}`);
  }
  if (dateCloture && isNaN(dateCloture.getTime())) {
    throw new Error(`Invalid closure date: ${data.dateCloture}`);
  }

  // Validate service type
  const validServiceTypes = ['FIBRE', 'ADSL', 'DEGROUPAGE', 'FIXE'];
  if (!validServiceTypes.includes(data.serviceType)) {
    throw new Error(`Invalid service type: ${data.serviceType}`);
  }

  // Validate cause type
  const validCauseTypes = ['Technique', 'Client', 'Casse'];
  if (!validCauseTypes.includes(data.causeType)) {
    throw new Error(`Invalid cause type: ${data.causeType}`);
  }

  // Validate technician
  const validTechnicians = ['BRAHIM', 'ABDERAHMAN', 'AXE'];
  if (!validTechnicians.includes(data.technician)) {
    throw new Error(`Invalid technician: ${data.technician}`);
  }

  return {
    ndLogin: String(data.ndLogin || ''),
    serviceType: data.serviceType,
    dateCreation,
    dateCloture,
    description: String(data.description || ''),
    cause: String(data.cause || ''),
    causeType: data.causeType,
    technician: data.technician,
    status: data.status || 'EN_COURS',
    delaiRespect: Boolean(data.delaiRespect),
    reopened: Boolean(data.reopened),
    reopenCount: Number(data.reopenCount || 0),
    motifCloture: String(data.motifCloture || '')
  };
}

export async function addTicket(ticket: Omit<Ticket, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const validatedTicket = validateTicketData(ticket);
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

export async function addMultipleTickets(tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]): Promise<{ 
  success: number;
  failed: { index: number; error: string }[];
}> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  const results = {
    success: 0,
    failed: [] as { index: number; error: string }[]
  };

  try {
    const chunkSize = 500; // Firestore batch limit is 500
    const chunks = [];
    for (let i = 0; i < tickets.length; i += chunkSize) {
      chunks.push(tickets.slice(i, i + chunkSize));
    }

    for (const [chunkIndex, chunk] of chunks.entries()) {
      const batch = writeBatch(db);
      const validatedChunk: any[] = [];

      // Validate each ticket in the chunk
      for (const [ticketIndex, ticket] of chunk.entries()) {
        try {
          const validatedTicket = validateTicketData(ticket);
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

      // Commit the batch
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

// New function to get imported tickets
export async function getImportedTickets(): Promise<Ticket[]> {
  try {
    const q = query(
      ticketsCollection,
      orderBy('dateCreation', 'desc'),
      where('imported', '==', true)
    );
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
        imported: true
      } as Ticket;
    });
  } catch (error) {
    console.error('Error getting imported tickets:', error);
    throw error;
  }
}