"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryRepository = void 0;
const firebase_1 = require("../config/firebase");
const logger_1 = __importDefault(require("../utils/logger"));
class TelemetryRepository {
    static async save(payload, topic, source = 'mqtt') {
        try {
            const collectionRef = firebase_1.db.collection('telemetry');
            const docData = {
                ...payload,
                topic,
                source,
                receivedAt: firebase_1.admin.firestore.FieldValue.serverTimestamp(),
            };
            const docRef = await collectionRef.add(docData);
            const logOutput = `[FIRESTORE]

Telemetry saved successfully

Document ID:
${docRef.id}`;
            logger_1.default.info(logOutput);
            return docRef.id;
        }
        catch (error) {
            const logOutput = `[FIRESTORE]

Failed to save telemetry

Reason:
${error.message || error}`;
            logger_1.default.error(logOutput);
            throw error;
        }
    }
    static async getLatest() {
        try {
            const collectionRef = firebase_1.db.collection('telemetry');
            const snapshot = await collectionRef.orderBy('receivedAt', 'desc').limit(1).get();
            if (snapshot.empty) {
                logger_1.default.info('[REST API] Firestore Read Success');
                return null;
            }
            const doc = snapshot.docs[0];
            const data = doc.data();
            // Format receivedAt field to ISO String if it is a Firestore Timestamp
            if (data.receivedAt && typeof data.receivedAt.toDate === 'function') {
                data.receivedAt = data.receivedAt.toDate().toISOString();
            }
            logger_1.default.info('[REST API] Firestore Read Success');
            return {
                id: doc.id,
                ...data,
            };
        }
        catch (error) {
            logger_1.default.error('[REST API] Firestore Read Failed', { error });
            throw error;
        }
    }
    static async getHistory(page, limit) {
        try {
            const collectionRef = firebase_1.db.collection('telemetry');
            const offset = (page - 1) * limit;
            const snapshot = await collectionRef
                .orderBy('receivedAt', 'desc')
                .offset(offset)
                .limit(limit)
                .get();
            const history = [];
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
            logger_1.default.info('[REST API] Firestore Read Success');
            return history;
        }
        catch (error) {
            logger_1.default.error('[REST API] Firestore Read Failed', { error });
            throw error;
        }
    }
}
exports.TelemetryRepository = TelemetryRepository;
