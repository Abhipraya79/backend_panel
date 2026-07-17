# Backend Development Roadmap

Dokumen ini memetakan langkah-langkah implementasi backend dari pondasi awal (Phase 1) hingga rilis production (Phase 10).

---

## Roadmap Overview

```
┌───────────────────────────────────────────────────────────────┐
│ [V] Phase 1: Project Foundation (Clean Arch, Logger, Configs)  │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 2: MQTT Communication & Subscription Protocol       │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 3: Firebase Firestore & Core Admin Integration       │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 4: Telemetry Service & Processing Pipeline          │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 5: Device Control & Command Dispatching             │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 6: REST API Controllers & Routing (Endpoints)       │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 7: Firebase Authentication Middleware Validation    │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 8: Cloud Messaging (FCM Alerts) & Event Service     │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 9: Winston Logger Expansion & Historical Database   │
└───────────────┬───────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────────┐
│ [ ] Phase 10: Production Deployment (Docker, PM2, Nginx)      │
└───────────────────────────────────────────────────────────────┘
```

---

## Rincian Milestone Kerja

### Phase 1: Project Foundation (SELESAI)
- Membangun struktur direktori Clean Architecture.
- Mengonfigurasi TypeScript, ESLint, Prettier, dan Nodemon.
- Menulis program Winston Logger & morgan logging.
- Membuat validasi `.env` berbasis Zod.
- Menyusun penanganan error terpusat (error handler middleware).
- Membuat stub config Firebase Admin & MQTT Client.
- Menyediakan endpoint health check `/health`.

### Phase 2: MQTT Communication & Subscription
- Menghubungkan client backend secara penuh ke MQTT Broker.
- Melakukan subscription ke topic telemetry (`solar/panel/telemetry`) & status (`solar/panel/status`).
- Mengimplementasikan reconnect-logic otomatis.

### Phase 3: Firebase Integration
- Mengaktifkan Firebase Firestore & Auth Admin SDK secara fungsional.
- Menulis utility/helper database untuk manipulasi koleksi Firestore.

### Phase 4: Telemetry Pipeline
- Menulis logika bisnis pemrosesan data sensor.
- Menyimpan data telemetri yang valid dari ESP32 ke Firestore.
- Melakukan filtering data duplikat/invalid.

### Phase 5: Device Control
- Mengimplementasikan logic pengiriman perintah ke ESP32 (`solar/panel/control`).
- Melacak status pengiriman perintah (`SENT`, `EXECUTED`, `FAILED`).

### Phase 6: REST API Development
- Membangun endpoint REST API lengkap (Get Latest Telemetry, History, Device List, Device Detail).
- Membuat pagination & filter pencarian data.

### Phase 7: Authentication Validation
- Mengaktifkan auth middleware untuk memvalidasi token JWT Firebase.
- Membaca data user (`req.user`) dari token JWT.

### Phase 8: Firebase Cloud Messaging
- Menulis modul Notification Service.
- Memicu push notification ke aplikasi Flutter ketika anomali (suhu/debu melebihi batas) terdeteksi.

### Phase 9: Logging & Monitoring
- Meningkatkan keamanan penulisan log.
- Memastikan rotasi file log berkala (winston-daily-rotate-file) agar kapasitas server aman.

### Phase 10: Production Deployment
- Setup environment Docker.
- Konfigurasi process manager PM2 & reverse proxy Nginx.
- Uji coba performa (load testing) REST API & latensi MQTT.
