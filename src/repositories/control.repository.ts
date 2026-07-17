import { db, admin } from '../config/firebase';
import logger from '../utils/logger';

export interface ControlLogData {
  deviceId: string;
  action: string;
  mode: string;
  pump: boolean;
  wiper: boolean;
  topic: string;
  status: string;
  source: string;
}

export class ControlRepository {
  public static async save(data: ControlLogData): Promise<string> {
    try {
      const collectionRef = db.collection('control_logs');

      const docData = {
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await collectionRef.add(docData);

      const logOutput = `[FIRESTORE]\n\nControl log saved successfully\n\nDocument ID:\n${docRef.id}`;
      logger.info(logOutput);

      return docRef.id;
    } catch (error: any) {
      const logOutput = `[FIRESTORE]\n\nFailed to save control log\n\nReason:\n${error.message || error}`;
      logger.error(logOutput);
      throw error;
    }
  }
}
