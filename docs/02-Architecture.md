# System Architecture - Clean Architecture

Sistem Backend Solar Panel IoT dirancang menggunakan **Clean Architecture** (pola arsitektur bersih). Prinsip utama dari arsitektur ini adalah pemisahan kekhawatiran (separation of concerns) dan independensi logika bisnis utama dari framework, database, UI, dan tool eksternal lainnya.

---

## 1. Lapisan Arsitektur (Layers)

Project backend dibagi menjadi beberapa bagian utama:

```
┌─────────────────────────────────────────────────────────────┐
│                   Frameworks & Drivers                      │
│            (Express App, MQTT Client, Firebase SDK)          │
│                              │                              │
│         ┌────────────────────▼────────────────────┐         │
│         │            Interface Adapters           │         │
│         │      (Controllers, Routes, DTOs)        │         │
│         │                    │                    │         │
│         │       ┌────────────▼────────────┐       │         │
│         │       │    Application Services │       │         │
│         │       │      (Business Logic)   │       │         │
│         │       │            │            │       │         │
│         │       │    ┌───────▼───────┐    │       │         │
│         │       │    │ Core Entities │    │       │         │
│         │       │    │ (Domain Models)    │       │         │
│         │       │    └───────────────┘    │       │         │
│         │       └─────────────────────────┘       │         │
│         └─────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

### A. Core Domain / Entities (`src/entities`)
- Berisi aturan bisnis inti tingkat perusahaan (enterprise business rules).
- Diimplementasikan dalam bentuk TypeScript interfaces atau classes.
- Tidak bergantung pada database, framework web (Express), atau external SDKs.

### B. Application Use Cases / Services (`src/services`)
- Berisi aturan bisnis spesifik aplikasi (application-specific business rules).
- Menghubungkan entity dengan flow logic.
- Berinteraksi dengan database melalui abstraksi interface repository (mengikuti Dependency Inversion Principle).

### C. Interface Adapters
- **Controllers (`src/controllers`)**: Menerima request HTTP, memanggil Service yang sesuai, dan memformat output response REST API.
- **Repositories (`src/repositories`)**: Implementasi detail cara penyimpanan data (ke Firestore). Services hanya memanggil interface repository, tidak peduli dengan detail Firestore.
- **MQTT Event Handlers (`src/mqtt`)**: Menerima data payload mentah dari MQTT broker, memvalidasi payload, lalu memanggil service untuk mengolah data telemetry.

### D. Frameworks & Drivers
- **Express Server (`src/app.ts`)**: Konfigurasi server HTTP, routing middleware, penanganan CORS, Security headers (Helmet), dan body parsing.
- **Firebase Admin SDK (`src/config/firebase.config.ts`)**: Integrasi database Firestore, Firebase Authentication, dan FCM.
- **MQTT.js Client (`src/config/mqtt.config.ts`)**: Konektivitas jaringan ke MQTT Broker eksternal.

---

## 2. Aliran Data (Data Flow)

### A. Aliran Telemetri (Read Path)
1. **ESP32** mempublikasikan data sensor ke MQTT Topic `solar/panel/telemetry`.
2. **MQTT Client** di Backend menerima payload event.
3. Event handler meneruskan data ke **Validator Schema** (Zod).
4. Payload tervalidasi dikirim ke **Telemetry Service**.
5. Service memproses logika bisnis (misal: membandingkan dengan threshold untuk notifikasi).
6. Service memanggil **Telemetry Repository** untuk menyimpan data ke **Firebase Firestore**.
7. Jika threshold terlampaui, Service memicu **Notification Service** untuk mengirim push notification ke Flutter via **FCM Client**.

### B. Aliran Perintah (Write/Control Path)
1. **Flutter Mobile App** mengirim request `POST /api/control` dengan payload command.
2. **Express Route** menangkap request dan memvalidasi token JWT pengguna melalui **Auth Middleware**.
3. **Control Controller** memvalidasi body request.
4. Controller memanggil **Control Service**.
5. Service memvalidasi status perangkat saat ini di Firestore, kemudian memicu **MQTT Client** untuk mempublikasikan command ke topic `solar/panel/control`.
6. **ESP32** menerima command via MQTT dan mengaktifkan aktuator (pompa pendingin atau motor wiper).
