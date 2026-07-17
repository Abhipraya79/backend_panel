# Firestore Database Design

Dokumen ini mendefinisikan desain skema Firestore Database untuk sistem panel surya IoT. Sebagai database NoSQL berorientasi dokumen, Firestore menyimpan data dalam bentuk Dokumen yang dikelompokkan ke dalam Koleksi (Collections).

---

## 1. Koleksi Utama (Collections)

Koleksi database terdiri dari:
1. `users` (Data pengguna terdaftar)
2. `devices` (Daftar perangkat panel surya terintegrasi)
3. `telemetry` (Histori data sensor)
4. `commands` (Histori perintah yang dikirim ke hardware)
5. `notifications` (Histori log notifikasi peringatan)
6. `logs` (Audit logs sistem backend)
7. `settings` (Konfigurasi ambang batas / threshold)

---

## 2. Struktur Skema Dokumen

### A. Koleksi `users`
- **Document ID**: Auth UID (dari Firebase Authentication)
```json
{
  "name": "Hayatun Nufus",
  "email": "owner@example.com",
  "role": "OWNER",
  "fcmToken": "d7k2...L1n",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

### B. Koleksi `devices`
- **Document ID**: `deviceId` perangkat (contoh: `panel001`)
```json
{
  "deviceId": "panel001",
  "name": "Panel Surya Samping Lab",
  "status": "ONLINE", 
  "lastSeen": "Timestamp",
  "createdAt": "Timestamp"
}
```

### C. Koleksi `telemetry`
- **Document ID**: Auto-generated oleh Firestore
- **Query Optimization**: Diurutkan berdasarkan `deviceId` dan `timestamp` DESC.
```json
{
  "deviceId": "panel001",
  "temperature": 42.5,
  "dust": 210,
  "voltage": 18.7,
  "current": 2.31,
  "power": 43.19,
  "pumpStatus": true,
  "wiperStatus": false,
  "mode": "AUTO",
  "timestamp": "Timestamp"
}
```

### D. Koleksi `commands`
- **Document ID**: Auto-generated
```json
{
  "deviceId": "panel001",
  "command": "PUMP_ON",
  "triggeredBy": "AuthUID_User",
  "status": "SENT", // PENDING, SENT, EXECUTED, FAILED
  "timestamp": "Timestamp"
}
```

### E. Koleksi `notifications`
- **Document ID**: Auto-generated
```json
{
  "deviceId": "panel001",
  "type": "TEMP_ALERT", // TEMP_ALERT, DUST_ALERT, DEVICE_OFFLINE
  "title": "Suhu Panel Terlalu Tinggi!",
  "body": "Suhu panel panel001 mencapai 42.5°C. Pompa pendingin otomatis diaktifkan.",
  "sentAt": "Timestamp",
  "isRead": false
}
```

### F. Koleksi `settings`
- **Document ID**: `global` / per-device (misal: `panel001`)
```json
{
  "deviceId": "panel001",
  "tempThreshold": 45.0, // Ambang batas menyalakan pompa pendingin otomatis (°C)
  "dustThreshold": 300,  // Ambang batas menyalakan wiper pembersih otomatis
  "updatedAt": "Timestamp",
  "updatedBy": "AuthUID_User"
}
```

---

## 3. Aturan Indeks (Indexing Rules)
Untuk menghindari error query Firestore, indeks komposit (Composite Indexes) berikut harus dikonfigurasi:

1. Koleksi: `telemetry`
   - Fields: `deviceId` (Ascending), `timestamp` (Descending)
   - Scope: Collection

2. Koleksi: `commands`
   - Fields: `deviceId` (Ascending), `timestamp` (Descending)
   - Scope: Collection
