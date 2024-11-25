import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, orderBy, writeBatch, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import type { Ticket, Device, ActionPlan, ActionCause, EmailConfig, UserProfile } from '../types';
import { nanoid } from 'nanoid';

const firebaseConfig = {
  apiKey: "AIzaSyBEon3bFk8y6I_oS1pYmLL5Ap3IxdIHvKI",
  authDomain: "suividestickets.firebaseapp.com",
  projectId: "suividestickets",
  storageBucket: "suividestickets.appspot.com",
  messagingSenderId: "595964409945",
  appId: "1:595964409945:web:cbd0957eb6c8da450c5948"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

// Collections
export const ticketsCollection = collection(db, 'tickets');
export const devicesCollection = collection(db, 'devices');
export const actionPlansCollection = collection(db, 'actionPlans');
export const actionCausesCollection = collection(db, 'actionCauses');
export const emailConfigCollection = collection(db, 'emailConfig');
export const usersCollection = collection(db, 'users');

// Auth functions
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

export async function getUserRole(userId: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    // If no role is set, create a default viewer role
    const defaultProfile: UserProfile = {
      email: auth.currentUser?.email || '',
      role: 'viewer'
    };
    // Only set admin role for the specified email
    if (auth.currentUser?.email === 'admin@sticket.ma') {
      defaultProfile.role = 'admin';
    }
    await setDoc(doc(db, 'users', userId), defaultProfile);
    return defaultProfile;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

// Action Plans CRUD
export async function addActionPlan(plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const planRef = doc(actionPlansCollection, id);
    await deleteDoc(planRef);
  } catch (error) {
    console.error('Error deleting action plan:', error);
    throw error;
  }
}

export async function getActionPlans(): Promise<ActionPlan[]> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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

// Action Causes CRUD
export async function addActionCause(cause: Omit<ActionCause, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const causeRef = doc(actionCausesCollection, id);
    await deleteDoc(causeRef);
  } catch (error) {
    console.error('Error deleting action cause:', error);
    throw error;
  }
}

export async function getActionCauses(): Promise<ActionCause[]> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

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

// Tickets CRUD
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

      newTickets.push({ ...newTicket, id: docRef.id } as Ticket);
    }

    await batch.commit();
    return newTickets;
  } catch (error) {
    console.error('Error adding multiple tickets:', error);
    throw error;
  }
}

// Device management
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

// Email configuration
export async function saveEmailConfig(config: EmailConfig): Promise<void> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const configRef = doc(emailConfigCollection, 'config');
    await setDoc(configRef, {
      ...config,
      updatedAt: Timestamp.now(),
      userId: auth.currentUser.uid
    });
  } catch (error) {
    console.error('Error saving email config:', error);
    throw error;
  }
}

export async function getEmailConfig(): Promise<EmailConfig | null> {
  try {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const configRef = doc(emailConfigCollection, 'config');
    const configDoc = await getDoc(configRef);
    
    if (configDoc.exists()) {
      return configDoc.data() as EmailConfig;
    }
    return null;
  } catch (error) {
    console.error('Error getting email config:', error);
    throw error;
  }
}