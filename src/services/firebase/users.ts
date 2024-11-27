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
    where,
    setDoc
  } from 'firebase/firestore';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { db, auth } from './config';
  import { usersCollection } from './collections';
  import type { User } from '../../types';
  
  const DEFAULT_ADMIN_PERMISSIONS = {
    dashboard: true,
    users: true,
    tickets: true,
    devices: true,
    reports: true,
    settings: true,
    analytics: true,
    email: true,
    actionPlans: true,
    feedback: true,
    export: true,
    import: true,
    delete: true
  };
  
  export async function addUser(userData: Omit<User, 'id'>): Promise<string> {
    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password || ''
      );
  
      const isAdmin = userData.role === 'admin';
      
      // Prepare user document
      const userDoc = {
        uid: userCredential.user.uid,
        email: userData.email,
        role: userData.role,
        permissions: isAdmin ? DEFAULT_ADMIN_PERMISSIONS : {},
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        lastLogin: null,
        status: 'active',
        settings: {
          emailNotifications: isAdmin,
          theme: 'light',
          language: 'fr'
        }
      };
  
      // Add user to Firestore with custom ID (using uid)
      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
  
      // If user is admin, set additional admin-specific data
      if (isAdmin) {
        const adminDoc = {
          uid: userCredential.user.uid,
          email: userData.email,
          superAdmin: false,
          permissions: DEFAULT_ADMIN_PERMISSIONS,
          accessLevel: 'full',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        };
        
        await setDoc(doc(db, 'admins', userCredential.user.uid), adminDoc);
      }
  
      return userCredential.user.uid;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }
  
  export async function updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
      const userRef = doc(usersCollection, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };
  
      // If role is being updated to admin, add admin permissions
      if (data.role === 'admin') {
        updateData.permissions = DEFAULT_ADMIN_PERMISSIONS;
        
        // Add to admins collection
        await setDoc(doc(db, 'admins', id), {
          uid: id,
          email: data.email,
          superAdmin: false,
          permissions: DEFAULT_ADMIN_PERMISSIONS,
          accessLevel: 'full',
          updatedAt: Timestamp.now()
        }, { merge: true });
      }
  
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  export async function deleteUser(id: string): Promise<void> {
    try {
      // Delete from users collection
      const userRef = doc(usersCollection, id);
      await deleteDoc(userRef);
  
      // Delete from admins collection if exists
      const adminRef = doc(db, 'admins', id);
      await deleteDoc(adminRef);
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
  
  export async function getAdminUsers(): Promise<User[]> {
    try {
      const adminsQuery = query(
        collection(db, 'admins'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(adminsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
    } catch (error) {
      console.error('Error getting admin users:', error);
      throw error;
    }
  }