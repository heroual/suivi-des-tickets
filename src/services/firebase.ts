import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, Timestamp, query, orderBy } from 'firebase/firestore';
import type { Ticket } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBEon3bFk8y6I_oS1pYmLL5Ap3IxdIHvKI",
  authDomain: "suividestickets.firebaseapp.com",
  projectId: "suividestickets",
  storageBucket: "suividestickets.firebasestorage.app",
  messagingSenderId: "595964409945",
  appId: "1:595964409945:web:cbd0957eb6c8da450c5948"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firestore with relaxed security rules for development
// Note: In production, proper authentication should be implemented
export const ticketsCollection = collection(db, 'tickets');

export async function addTicket(ticket: Omit<Ticket, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(ticketsCollection, {
      ...ticket,
      dateCreation: Timestamp.fromDate(ticket.dateCreation),
      dateCloture: ticket.dateCloture ? Timestamp.fromDate(ticket.dateCloture) : null,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    const q = query(ticketsCollection, orderBy('dateCreation', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateCreation: (doc.data().dateCreation as Timestamp).toDate(),
      dateCloture: doc.data().dateCloture ? (doc.data().dateCloture as Timestamp).toDate() : undefined
    })) as Ticket[];
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets', id);
    const updateData = {
      ...data,
      dateCloture: data.dateCloture ? Timestamp.fromDate(data.dateCloture) : null,
      updatedAt: Timestamp.now()
    };
    await updateDoc(ticketRef, updateData);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}