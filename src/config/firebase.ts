import * as admin from 'firebase-admin';
import path from 'path';
import logger from '../utils/logger';

let db: admin.firestore.Firestore;
let auth: admin.auth.Auth;
let messaging: admin.messaging.Messaging;

try {
  logger.info('Initializing Firebase Admin SDK...');
  const serviceAccountPath = path.join(process.cwd(), 'credentials', 'firebase-admin.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
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
