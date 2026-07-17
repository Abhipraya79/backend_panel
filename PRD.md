PRD - Backend IoT Solar Panel Management System
1. Project Information
Project Name

Solar Panel IoT Monitoring and Automatic Cleaning & Cooling System

Version

1.0.0

Document Owner

Hayatun Nufus

Backend Technology
Node.js
MQTT.js
Firebase Admin SDK
Firebase Firestore
Firebase Cloud Messaging
Winston Logger
2. Background

Sistem ini merupakan backend utama yang menghubungkan perangkat IoT (ESP32), MQTT Broker, Firebase, dan aplikasi Flutter untuk melakukan monitoring serta kontrol sistem pendinginan dan pembersihan panel surya secara real-time.

Backend bertanggung jawab sebagai pusat business logic sehingga seluruh komunikasi tidak dilakukan secara langsung antara ESP32 dan Firebase.

3. Objectives

Backend harus mampu:

menerima data sensor dari ESP32 melalui MQTT
memvalidasi seluruh payload
menyimpan data telemetry ke Firestore
mengirim data realtime ke Flutter
menerima perintah dari Flutter
meneruskan command ke ESP32 menggunakan MQTT
mengirim push notification menggunakan Firebase Cloud Messaging
mencatat seluruh aktivitas sistem
menyediakan REST API untuk aplikasi mobile
4. Scope

Backend hanya menangani:

MQTT Communication
REST API
Firebase
Firestore
FCM
Logging
Device Management
Telemetry Management
Control Management
Notification Management

Backend tidak menangani:

UI Flutter
Firmware ESP32
Decision Tree di mikrokontroler
5. Architecture
ESP32
   │
   ▼
MQTT Broker
   │
   ▼
Node.js Backend
   │
   ├── Firestore
   ├── Firebase Auth
   ├── Firebase FCM
   │
   ▼
Flutter Mobile

Backend menjadi pusat komunikasi seluruh sistem.

6. Actors
User

Melakukan monitoring panel surya.

Mengontrol pompa pendingin.

Mengontrol sistem pembersihan.

Melihat histori.

Menerima notifikasi.

ESP32

Mengirim telemetry.

Menerima command.

Mengirim status device.

Backend

Validasi data.

Business Logic.

Logging.

MQTT Client.

REST API.

FCM Sender.

7. Functional Requirements
Authentication

User login menggunakan Firebase Authentication.

Backend melakukan verifikasi token.

MQTT Communication

Backend harus subscribe topic MQTT.

Backend harus publish command MQTT.

Reconnect otomatis apabila koneksi terputus.

Monitoring

Backend menerima:

suhu panel
suhu air
debu
arus
tegangan
daya
status pompa
status wiper
status koneksi

Data disimpan ke Firestore.

Device Control

Flutter dapat mengirim:

ON Pompa Pendingin
OFF Pompa Pendingin
ON Pembersihan
OFF Pembersihan
Mode Manual
Mode Otomatis

Backend publish command ke MQTT.

Notification

Backend mengirim FCM ketika:

suhu > threshold
debu > threshold
pompa gagal aktif
device offline
koneksi MQTT putus
Logging

Backend mencatat:

login
logout
MQTT publish
MQTT subscribe
API Request
Error
Device Command
Notification
8. Non Functional Requirements
Availability

99%

Response Time

REST API < 500 ms

MQTT Publish < 100 ms

Scalability

Minimal mendukung:

100 device

100 user

Security

Firebase Authentication

JWT Verification

Environment Variable

Helmet

CORS

Rate Limiter

9. MQTT Topics
Telemetry
solar/panel/telemetry

ESP32 Publish

Backend Subscribe

Device Status
solar/panel/status

ESP32 Publish

Backend Subscribe

Command
solar/panel/control

Backend Publish

ESP32 Subscribe

Notification
solar/panel/event

ESP32 Publish

Backend Subscribe

10. Telemetry Payload
{
  "deviceId":"panel001",
  "temperature":42.5,
  "dust":210,
  "voltage":18.7,
  "current":2.31,
  "power":43.19,
  "pumpStatus":true,
  "wiperStatus":false,
  "mode":"AUTO",
  "timestamp":"2026-07-10T20:30:00Z"
}
11. Control Payload
{
  "deviceId":"panel001",
  "command":"PUMP_ON"
}

Contoh command:

PUMP_ON
PUMP_OFF
WIPER_ON
WIPER_OFF
AUTO_MODE
MANUAL_MODE
12. Firestore Collections
users

devices

telemetry

commands

notifications

logs

settings
13. REST API
Health

GET

/health
Latest Telemetry

GET

/api/telemetry/latest
History

GET

/api/telemetry/history
Device List

GET

/api/devices
Device Detail

GET

/api/devices/:id
Send Command

POST

/api/control
Notifications

GET

/api/notifications
14. Folder Structure
backend

src

config

controllers

services

repositories

routes

mqtt

firebase

middlewares

validators

interfaces

entities

models

utils

helpers

constants

types

logs

tests

docs
15. Error Handling

Semua response menggunakan format:

{
  "success": false,
  "message": "Invalid payload",
  "error": {
    "code": "VALIDATION_ERROR"
  }
}
16. Success Response
{
  "success": true,
  "message": "Telemetry saved successfully",
  "data": {}
}
17. Logging Strategy

Menggunakan Winston.

Log:

console
file
error.log
combined.log
18. Environment Variables
PORT=

NODE_ENV=

MQTT_HOST=

MQTT_PORT=

MQTT_USERNAME=

MQTT_PASSWORD=

FIREBASE_PROJECT_ID=

FIREBASE_CLIENT_EMAIL=

FIREBASE_PRIVATE_KEY=

JWT_SECRET=
19. Future Development
Multiple Solar Panel
OTA Firmware Update
Dashboard Web
Analytics
AI Prediction
Predictive Maintenance
Grafana Integration
InfluxDB
Docker Deployment
Kubernetes
Multi Tenant
20. Development Roadmap

Phase 1

Project Foundation

Phase 2

MQTT Module

Phase 3

Firebase Integration

Phase 4

Telemetry Module

Phase 5

Device Control

Phase 6

REST API

Phase 7

Authentication

Phase 8

Notification (FCM)

Phase 9

Logging & Monitoring

Phase 10

Production Deployment