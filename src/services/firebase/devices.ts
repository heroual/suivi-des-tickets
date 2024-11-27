import { addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from './config';
import { devicesCollection } from './collections';
import type { Device } from '../../types';

export async function addDevice(device: Omit<Device, 'id'>): Promise<string> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
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
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
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
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
    const deviceRef = doc(db, 'devices', id);
    await deleteDoc(deviceRef);
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
}

export async function getDevices(): Promise<Device[]> {
  if (!auth.currentUser) throw new Error('User not authenticated');

  try {
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