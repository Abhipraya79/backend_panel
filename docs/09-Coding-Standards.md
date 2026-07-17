# Coding Standards & Guidelines

Dokumen ini mendefinisikan standar penulisan kode, penamaan, penanganan error, dan pola log yang harus dipatuhi di seluruh pengerjaan backend.

---

## 1. Code Formatting & Style
- **Formatter**: Prettier wajib digunakan sebelum melakukan commit.
- **Linter**: ESLint dikonfigurasi untuk menangkap bug logika dan mendeteksi kode mati (dead code).
- **Aturan Sintaks Utama**:
  - Lekukan (Indentation): 2 spasi.
  - Tanda kutip: Single quotes (`'`) untuk string, kecuali JSON / HTML.
  - Semicolon: Wajib digunakan di akhir setiap baris pernyataan.
  - Maksimal lebar baris: 100 karakter (`printWidth: 100`).

---

## 2. Naming Conventions (Konvensi Penamaan)

Pemberian nama file dan simbol kode harus konsisten demi kemudahan navigasi Clean Architecture:

### A. Folder & File
- **Directory**: Menggunakan nama jamak huruf kecil (contoh: `controllers`, `services`, `routes`).
- **File Name**:
  - Controllers: `<name>.controller.ts` (contoh: `telemetry.controller.ts`)
  - Services: `<name>.service.ts` (contoh: `telemetry.service.ts`)
  - Repositories: `<name>.repository.ts` (contoh: `telemetry.repository.ts`)
  - Routes: `<name>.routes.ts` (contoh: `telemetry.routes.ts`)
  - Validations Schema: `<name>.validator.ts`

### B. Classes, Interfaces, & Functions
- **Classes**: PascalCase (contoh: `AppError`, `TelemetryService`).
- **Interfaces**: Awalan huruf `I` kapital atau diakhiri kata `Interface` (contoh: `ITelemetryPayload`).
- **Functions**: camelCase (contoh: `getHealth`, `validatePayload`).
- **Variables**: camelCase (contoh: `tempThreshold`, `mqttClient`).
- **Constants**: UPPER_SNAKE_CASE (contoh: `DEFAULT_PORT`, `VALIDATION_ERROR`).

---

## 3. Error Handling Protocol
1. **DILARANG** mengembalikan error mentah (raw database/connection crash error) ke klien API.
2. Setiap kali melempar (throw) error yang disengaja dalam business logic, gunakan `AppError`:
   ```typescript
   throw new AppError('Device not found', 404, 'DEVICE_NOT_FOUND');
   ```
3. Zod Schema validator harus menangkap error payload masukan dan mengembalikan error berkode `VALIDATION_ERROR` (HTTP 400).
4. Di dalam controller, seluruh pemanggilan asynchronous wajib menggunakan blok `try-catch` dan melemparkan error yang tertangkap ke parameter `next(error)` agar diproses oleh middleware error terpusat.

---

## 4. Winston Logging Guide

Pencatatan logs menggunakan level prioritas log winston:

- **`logger.error`**: Masalah kritis yang membutuhkan intervensi sistem segera (database Firebase crash, MQTT Broker tidak dapat dihubungi, uncaught exception). Wajib menyertakan stack trace error.
- **`logger.warn`**: Masalah operasional minor yang dapat dipulihkan otomatis (client request tidak valid, token auth expired, MQTT koneksi terputus dan sedang reconnecting).
- **`logger.info`**: Informasi status penting (server Express berhasil online, koneksi database sukses, server shutdown bersih).
- **`logger.http`**: Logging morgan (mencatat log akses url web client).
- **`logger.debug`**: Informasi pembantu debug (isi payload telemetry mentah dari sensor ESP32).
