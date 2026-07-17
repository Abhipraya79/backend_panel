# Security Configuration and Best Practices

Dokumen ini mendokumentasikan taktik dan fitur keamanan yang diterapkan pada backend sistem Solar Panel IoT.

---

## 1. HTTP Security Headers (Helmet.js)
Backend menggunakan **Helmet** sebagai middleware Express. Helmet membantu mengamankan aplikasi dari serangan web umum dengan menyetel berbagai header HTTP secara otomatis:
- Melumpuhkan header `X-Powered-By` (mencegah fingerprinting teknologi server).
- Mengaktifkan `Strict-Transport-Security` (memaksa koneksi HTTPS).
- Mengaktifkan filter `X-Content-Type-Options: nosniff`.
- Menerapkan `Content-Security-Policy` (CSP) ketat.

---

## 2. Cross-Origin Resource Sharing (CORS)
Hanya client dari origin yang diizinkan yang dapat melakukan API requests. 
- Pada tahap *Development*, CORS diatur untuk mengizinkan semua origin (`*`) guna mempermudah integrasi local Flutter emulator dan web dashboard.
- Pada tahap *Production*, origin harus dibatasi secara spesifik pada alamat domain Flutter Web dashboard atau mobile app package schema.

---

## 3. Rate Limiting (Pencegahan brute-force & DDoS)
Untuk mencegah eksploitasi API endpoint, rate limiter dikonfigurasi pada endpoint sensitif (seperti login verifikasi dan device control):
- Batasan default: Maksimal **100 requests** per **15 menit** per IP address.
- Response code jika limit dilampaui: **HTTP 429 Too Many Requests**.

---

## 4. REST API Authentication (Firebase JWT Verification)
Verifikasi autentikasi user dilakukan tanpa menyimpan session (stateless) menggunakan token Firebase:
1. Flutter App melakukan otentikasi langsung ke Firebase Auth Client SDK.
2. Flutter memperoleh **Firebase ID Token** (JWT).
3. Setiap request HTTP ke backend menyertakan token ini di header `Authorization: Bearer <token>`.
4. Middleware backend menggunakan Firebase Admin SDK `admin.auth().verifyIdToken(token)` untuk mendekripsi dan memvalidasi keabsahan token.
5. Jika valid, data payload token didelegasikan ke objek request (`req.user`) dan request diteruskan ke controller.

---

## 5. Input Validation (Zod Schema Validation)
Seluruh request body, query params, dan route params harus melalui validasi tipe data dan batasan nilai sebelum masuk ke business logic:
- Zod melumpuhkan serangan SQL Injection/NoSQL Injection secara inheren karena tipe data dipaksa sesuai dengan schema.
- Data yang tidak terdaftar di schema secara otomatis dibuang (stripping untrusted properties).

---

## 6. MQTT Security
Keamanan jalur MQTT didesain dengan tingkat keamanan bertahap:
- **Authentication**: Koneksi mikrokontroler ke MQTT broker diwajibkan menyertakan Username & Password unik yang dikonfigurasi di broker.
- **TLS/SSL Encryption**: Transmisi payload telemetry dan control wajib menggunakan port secure `8883` dengan enkripsi TLS v1.2/1.3 untuk mencegah penyadapan data sensor di jalur internet publik.
- **ACL (Access Control List)**: Membatasi hak akses ESP32 agar hanya bisa menulis ke topik telemetrinya sendiri dan membaca dari topik kontrol miliknya sendiri.
