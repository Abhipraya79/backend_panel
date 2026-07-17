import { db, admin } from '../config/firebase';
import logger from '../utils/logger';
import { TelemetryPayload } from '../validators/telemetry.validator';

export class TelemetryRepository {
  public static async save(
    payload: TelemetryPayload,
    topic: string,
    source: string = 'mqtt',
  ): Promise<string> {
    try {
      const collectionRef = db.collection('telemetry');

      const docData = {
        ...payload,
        topic,
        source,
        receivedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await collectionRef.add(docData);

      const logOutput = `[FIRESTORE]

Telemetry saved successfully

Document ID:
${docRef.id}`;

      logger.info(logOutput);
      return docRef.id;
    } catch (error: any) {
      const logOutput = `[FIRESTORE]

Failed to save telemetry

Reason:
${error.message || error}`;

      logger.error(logOutput);
      throw error;
    }
  }

  public static async getLatest(): Promise<any | null> {
    try {
      const collectionRef = db.collection('telemetry');
      const snapshot = await collectionRef.orderBy('receivedAt', 'desc').limit(1).get();

      if (snapshot.empty) {
        logger.info('[REST API] Firestore Read Success');
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      // Format receivedAt field to ISO String if it is a Firestore Timestamp
      if (data.receivedAt && typeof data.receivedAt.toDate === 'function') {
        data.receivedAt = data.receivedAt.toDate().toISOString();
      }

      logger.info('[REST API] Firestore Read Success');
      return {
        id: doc.id,
        ...data,
      };
    } catch (error: any) {
      logger.error('[REST API] Firestore Read Failed', { error });
      throw error;
    }
  }

  public static async getHistory(page: number, limit: number): Promise<any[]> {
    try {
      const collectionRef = db.collection('telemetry');
      const offset = (page - 1) * limit;
      const snapshot = await collectionRef
        .orderBy('receivedAt', 'desc')
        .offset(offset)
        .limit(limit)
        .get();

      const history: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.receivedAt && typeof data.receivedAt.toDate === 'function') {
          data.receivedAt = data.receivedAt.toDate().toISOString();
        }
        history.push({
          id: doc.id,
          ...data,
        });
      });

      logger.info('[REST API] Firestore Read Success');
      return history;
    } catch (error: any) {
      logger.error('[REST API] Firestore Read Failed', { error });
      throw error;
    }
  }
}
