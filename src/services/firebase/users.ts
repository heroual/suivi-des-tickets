import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs, 
    query, 
    orderBy, 
    Timestamp,
    where
  } from 'firebase/firestore';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { db, auth } from './config';
  import { usersCollection } from './collections';
  import type { User } from '../../types';
  
  export async function addUser(userData: Omit<User, 'id'>): Promise<string> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
  
      // Add user to Firestore
      const docRef = await addDoc(usersCollection, {
        uid: userCredential.user.uid,
        email: userData.email,
        role: userData.role,
        createdAt: Timestamp.now()
      });
  
      return docRef.id;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }
  
  export async function updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(usersCollection, id);
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  export async function deleteUser(id: string): Promise<void> {
    try {
      const userRef = doc(usersCollection, id);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  
  export async function getUsers(): Promise<User[]> {
    try {
      const q = query(usersCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }
  
  export async function getUsersByRole(role: string): Promise<User[]> {
    try {
      const q = query(
        usersCollection,
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw error;
    }
  }