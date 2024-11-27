import { collection } from 'firebase/firestore';
import { db } from './config';

export const ticketsCollection = collection(db, 'tickets');
export const devicesCollection = collection(db, 'devices');
export const actionPlansCollection = collection(db, 'actionPlans');
export const actionCausesCollection = collection(db, 'actionCauses');
export const emailConfigCollection = collection(db, 'emailConfig');
export const usersCollection = collection(db, 'users');
export const feedbackCollection = collection(db, 'feedback');
export const techniciansCollection = collection(db, 'technicians');
export const incidentCausesCollection = collection(db, 'incidentCauses');