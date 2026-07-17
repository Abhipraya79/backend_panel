# Firebase Cloud Messaging (FCM) Flow

Dokumen ini menjelaskan alur kerja pengiriman push notification dari backend ke aplikasi Flutter menggunakan Firebase Cloud Messaging (FCM) ketika terjadi anomali pada panel surya.

---

## 1. Alur Pengiriman Notifikasi (FCM Sequence Flow)

```
 ESP32                  MQTT Broker             Node.js Backend            Firebase FCM             Flutter App
   │                         │                         │                         │                       │
   │─── Publish Telemetry ──>│                         │                         │                       │
   │    (temp=50.2°C)        │─── Forward Telemetry ──>│                         │                       │
   │                         │                         │ (Threshold Check:       │                       │
   │                         │                         │  50.2°C > limit 45°C)   │                       │
   │                         │                         │                         │                       │
   │                         │                         │─── Send Push Notification ──>│                       │
   │                         │                         │    (FCM Token, Payload) │                       │
   │                         │                         │                         │─── Deliver Notification ─>│
   │                         │                         │                         │    (Show alert pop-up)│
   │                         │                         │                         │                       │
```

1. **Detection**: ESP32 mengirim data sensor telemetri secara berkala.
2. **Analysis**: Backend menerima telemetri, lalu membandingkannya dengan ambang batas (thresholds) di koleksi Firestore `settings`.
3. **Trigger**: Jika sensor melewati ambang batas (misal: suhu > 45°C), Backend menginisialisasi proses pengiriman notifikasi.
4. **Resolution**: Backend mengambil list token FCM aktif pengguna dari koleksi Firestore `users`.
5. **Dispatch**: Backend mengirimkan payload notifikasi terstruktur ke API Firebase Cloud Messaging melalui Firebase Admin SDK.
6. **Delivery**: Firebase mengirimkan push notification ke device mobile target pengguna.

---

## 2. Event Pemicu Notifikasi (Trigger Events)

| Event Code | Event Trigger Condition | Title Notifikasi | Body Notifikasi | Priority |
| :--- | :--- | :--- | :--- | :--- |
| `TEMP_ALERT` | Suhu Panel > `tempThreshold` | Suhu Panel Kritis! | Suhu panel {deviceId} mencapai {temperature}°C. Pendingin aktif. | High |
| `DUST_ALERT` | Tingkat Debu > `dustThreshold` | Panel Kotor / Berdebu | Nilai debu pada panel {deviceId} terdeteksi {dust}. Segera bersihkan. | Normal |
| `PUMP_FAILURE`| Status Pompa diset ON tapi arus panel / pompa tidak sesuai | Pompa Gagal Aktif | Peringatan! Deteksi aliran air pompa pada {deviceId} gagal berjalan. | High |
| `DEVICE_OFFLINE`| Konektivitas terputus (`solar/panel/status` = `OFFLINE`) | Perangkat Terputus! | Koneksi panel {deviceId} dengan server terputus (Offline). | High |

---

## 3. Payload Notifikasi FCM

Payload dikirim dalam dua tipe data: `notification` (untuk notifikasi sistem tray bawaan OS) dan `data` (untuk diproses custom di background Flutter app).

```json
{
  "message": {
    "token": "d7k2...L1n",
    "notification": {
      "title": "Suhu Panel Kritis!",
      "body": "Suhu panel panel001 mencapai 46.8°C. Pendingin aktif."
    },
    "data": {
      "click_action": "FLUTTER_NOTIFICATION_CLICK",
      "deviceId": "panel001",
      "type": "TEMP_ALERT",
      "value": "46.8",
      "timestamp": "2026-07-10T20:35:00Z"
    },
    "android": {
      "priority": "high",
      "notification": {
        "sound": "default",
        "channelId": "solar_panel_alerts"
      }
    },
    "apns": {
      "headers": {
        "apns-priority": "10"
      },
      "payload": {
        "aps": {
          "sound": "default"
        }
      }
    }
  }
}
```
