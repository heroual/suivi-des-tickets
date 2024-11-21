import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, orderBy, writeBatch } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import type { Ticket, Device } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBEon3bFk8y6I_oS1pYmLL5Ap3IxdIHvKI",
  authDomain: "suividestickets.firebaseapp.com",
  projectId: "suividestickets",
  storageBucket: "suividestickets.appspot.com",
  messagingSenderId: "595964409945",
  appId: "1:595964409945:web:cbd0957eb6c8da450c5948"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export const ticketsCollection = collection(db, 'tickets');
export const devicesCollection = collection(db, 'devices');

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function addTicket(ticket: Omit<Ticket, 'id'>): Promise<string> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const ticketRef = doc(db, 'tickets', id);
    const updateData: Record<string, any> = {
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid
    };

    // Handle date fields
    if (data.dateCreation) {
      updateData.dateCreation = Timestamp.fromDate(data.dateCreation);
    }
    if (data.dateCloture) {
      updateData.dateCloture = Timestamp.fromDate(data.dateCloture);
    }

    // Add all other fields except dates which we handled above
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

export async function closeTicket(id: string): Promise<void> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const ticketRef = doc(db, 'tickets', id);
    const updateData = {
      status: 'CLOTURE',
      dateCloture: Timestamp.now(),
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid,
      delaiRespect: true // You might want to calculate this based on business logic
    };

    await updateDoc(ticketRef, updateData);
  } catch (error) {
    console.error('Error closing ticket:', error);
    throw error;
  }
}

export async function deleteTicket(id: string): Promise<void> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const ticketRef = doc(db, 'tickets', id);
    await deleteDoc(ticketRef);
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw error;
  }
}

export async function getTickets(): Promise<Ticket[]> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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

      newTickets.push({ ...newTicket, id: docRef.id });
    }

    await batch.commit();
    return newTickets;
  } catch (error) {
    console.error('Error adding multiple tickets:', error);
    throw error;
  }
}

// Device management functions remain the same...
export async function addDevice(device: Omit<Device, 'id'>): Promise<string> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const docRef = await addDoc(devicesCollection, {
      ...device,
      dateInstalled: Timestamp.fromDate(device.dateInstalled),
      createdAt: Timestamp.now(),
      userId: auth.currentUser.uid
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding device:', error);
    throw error;
  }
}

export async function updateDevice(id: string, data: Partial<Device>): Promise<void> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const deviceRef = doc(db, 'devices', id);
    const updateData = {
      ...data,
      dateInstalled: data.dateInstalled ? Timestamp.fromDate(data.dateInstalled) : null,
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid
    };
    await updateDoc(deviceRef, updateData);
  } catch (error) {
    console.error('Error updating device:', error);
    throw error;
  }
}

export async function deleteDevice(id: string): Promise<void> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const deviceRef = doc(db, 'devices', id);
    await deleteDoc(deviceRef);
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
}

export async function getDevices(): Promise<Device[]> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const q = query(devicesCollection, orderBy('dateInstalled', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        dateInstalled: data.dateInstalled instanceof Timestamp ? data.dateInstalled.toDate() : new Date(data.dateInstalled)
      } as Device;
    });
  } catch (error) {
    console.error('Error getting devices:', error);
    throw error;
  }
}