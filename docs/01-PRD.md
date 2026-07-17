# PRD - Backend IoT Solar Panel Management System

## 1. Project Information
- **Project Name**: Solar Panel IoT Monitoring and Automatic Cleaning & Cooling System
- **Version**: 1.0.0
- **Document Owner**: Hayatun Nufus
- **Backend Technology**: Node.js, MQTT.js, Firebase Admin SDK (Firestore, Auth, FCM), Winston Logger

---

## 2. Background
Sistem ini merupakan backend utama yang menghubungkan perangkat IoT (ESP32), MQTT Broker, Firebase, dan aplikasi Flutter untuk melakukan monitoring serta kontrol sistem pendinginan dan pembersihan panel surya secara real-time.

Backend bertanggung jawab sebagai pusat business logic sehingga seluruh komunikasi tidak dilakukan secara langsung antara ESP32 dan Firebase.

---

## 3. Objectives
Backend harus mampu:
1. Menerima data sensor dari ESP32 melalui MQTT.
2. Memvalidasi seluruh payload.
3. Menyimpan data telemetry ke Firestore.
4. Mengirim data realtime ke Flutter.
5. Menerima perintah dari Flutter.
6. Meneruskan command ke ESP32 menggunakan MQTT.
7. Mengirim push notification menggunakan Firebase Cloud Messaging (FCM).
8. Mencatat seluruh aktivitas sistem (logging).
9. Menyediakan REST API untuk aplikasi mobile.

---

## 4. Scope

### Backend menangani:
- MQTT Communication (Telemetry & Command status)
- REST API (Express server)
- Firebase Services (Firestore, Firebase Auth, FCM)
- Device Management & Control Logic
- System Logging (Winston)

### Backend TIDAK menangani:
- User Interface (UI) Flutter
- Firmware ESP32 & Wi-Fi management on microcontroller
- Decision Tree logic di mikrokontroler (ESP32)

---

## 5. System Architecture
```
ESP32
  │
  ▼ (MQTT Publish/Subscribe)
MQTT Broker
  │
  ▼ (MQTT Subscribe/Publish)
Node.js Backend (Clean Architecture)
  │
  ├── Firestore Database (Store telemetry, logs, devices)
  ├── Firebase Auth (Verify tokens)
  └── Firebase Cloud Messaging (Push notifications)
  │
  ▼ (REST API / JWT)
Flutter Mobile Application
```

---

## 6. Actors & Roles
- **User (Flutter)**: Memonitor telemetry, mengontrol pompa & wiper secara manual, mengatur mode (Auto/Manual), menerima FCM push alert.
- **ESP32 Perangkat**: Mengirim telemetry secara periodik, menerima status perintah, mengirim status koneksi.
- **Backend**: Validasi payload, mengeksekusi business logic, mengelola antrean command, mendistribusikan data, mengelola logs.

---

## 7. Functional Requirements
1. **Authentication**: Autentikasi user via Firebase Auth token. Backend memverifikasi token JWT.
2. **MQTT Communication**: Subscribe data telemetry dan publish command. Reconnect otomatis jika koneksi putus.
3. **Monitoring**: Menerima data suhu panel, suhu air, debu, arus, tegangan, daya, status pompa/wiper, status koneksi, lalu menyimpannya ke Firestore.
4. **Device Control**: Meneruskan command dari Flutter (ON/OFF Pompa, ON/OFF Wiper, Mode AUTO/MANUAL) ke MQTT topic command ESP32.
5. **Notification (FCM)**: Mengirim notification ketika suhu > threshold, debu > threshold, pompa gagal, atau device offline.
6. **Logging**: Mencatat aktivitas login/logout, MQTT publish/subscribe, REST API requests, Error, dan Events ke log local.
