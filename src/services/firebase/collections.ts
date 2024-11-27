import { collection } from 'firebase/firestore';
import { db } from './config';

export const ticketsCollection = collection(db, 'tickets');
export const devicesCollection = collection(db, 'devices');
export const actionPlansCollection = collection(db, 'actionPlans');
export const actionCausesCollection = collection(db, 'actionCauses');
export const emailConfigCollection = collection(db, 'emailConfig');
export const usersCollection = collection(db, 'users');