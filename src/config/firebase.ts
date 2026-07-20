import * as admin from 'firebase-admin';
import { env } from './env';
import logger from '../utils/logger';

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let messaging: admin.messaging.Messaging;

try {
  logger.info('Initializing Firebase Admin SDK...');

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
  });

  db = admin.firestore();
  auth = admin.auth();
  messaging = admin.messaging();

  logger.info('Firebase Admin SDK initialized successfully.');
} catch (error) {
  logger.error('Failed to initialize Firebase Admin SDK. Services will be unavailable.', { error });
  throw error;
}

export { admin, db, auth, messaging };
