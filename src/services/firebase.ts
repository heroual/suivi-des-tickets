import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, orderBy, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
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
export const auth = getAuth(app);

export const ticketsCollection = collection(db, 'tickets');

export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function addTicket(ticket: Omit<Ticket, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(ticketsCollection, {
      ...ticket,
      dateCreation: Timestamp.fromDate(ticket.dateCreation),
      dateCloture: ticket.dateCloture ? Timestamp.fromDate(ticket.dateCloture) : null,
      createdAt: Timestamp.now(),
      userId: auth.currentUser?.uid,
      imported: false // Mark as not imported
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding ticket:', error);
    throw error;
  }
}

export async function updateTicket(id: string, data: Partial<Ticket>): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets', id);
    const updateData = {
      ...data,
      dateCloture: data.dateCloture ? Timestamp.fromDate(data.dateCloture) : null,
      dateCreation: data.dateCreation ? Timestamp.fromDate(data.dateCreation) : null,
      updatedAt: Timestamp.now()
    };
    await updateDoc(ticketRef, updateData);
  } catch (error) {
    console.error('Error updating ticket:', error);
    throw error;
  }
}

export async function deleteTicket(id: string): Promise<void> {
  try {
    const ticketRef = doc(db, 'tickets', id);
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
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      dateCreation: (doc.data().dateCreation as Timestamp).toDate(),
      dateCloture: doc.data().dateCloture ? (doc.data().dateCloture as Timestamp).toDate() : undefined,
      imported: doc.data().imported || false
    })) as Ticket[];
  } catch (error) {
    console.error('Error getting tickets:', error);
    throw error;
  }
}

export async function addMultipleTickets(tickets: Omit<Ticket, 'id' | 'reopened' | 'reopenCount'>[]): Promise<Ticket[]> {
  const batch = writeBatch(db);
  const newTickets: Ticket[] = [];

  try {
    for (const ticket of tickets) {
      const docRef = doc(ticketsCollection);
      const newTicket: Omit<Ticket, 'id'> = {
        ...ticket,
        reopened: false,
        reopenCount: 0,
        imported: true // Mark as imported
      };

      batch.set(docRef, {
        ...newTicket,
        dateCreation: Timestamp.fromDate(ticket.dateCreation),
        dateCloture: ticket.dateCloture ? Timestamp.fromDate(ticket.dateCloture) : null,
        createdAt: Timestamp.now(),
        userId: auth.currentUser?.uid
      });

      newTickets.push({ ...newTicket, id: docRef.id });
    }

    await batch.commit();
    return newTickets;
  } catch (error) {
    console.error('Error adding multiple tickets:', error);
    throw error;
  }
}