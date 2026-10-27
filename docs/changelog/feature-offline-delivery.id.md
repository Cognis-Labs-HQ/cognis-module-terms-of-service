# Antrean dan Persetujuan

**Cabang Fitur:** feature-offline-delivery

## Keamanan Cache Persetujuan

Snapshot persetujuan mempertahankan dokumen yang telah diamati tetapi tidak disertakan dalam respons lama. Dokumen baru yang belum disetujui tetap memblokir akses luring dan pengiriman antrean hingga server mengonfirmasi persetujuan versi terkininya. Batas ukuran cache dan kegagalan penyimpanan mencabut izin luring tanpa membuang status daring terbaru: dialog persetujuan wajib, persetujuan daring, dan tampilan dokumen hukum publik tetap berjalan. Status dalam memori yang dibagikan dan dibatasi per akun mempertahankan versi yang diamati saat cache gagal serta mencegah klien lain pada halaman yang sama memulihkan izin tersimpan yang usang. Izin luring kembali hanya setelah snapshot lengkap yang disetujui berhasil disimpan.

## Antrean dan Persetujuan

Pemulihan memperbarui penyedia dan menjalankan `authenticate-session` sebelum tahap akhir `afterSession` mengirim aktivitas. Penyedia wajib mendeklarasikan `offlineAccessGuard` dalam katalog server. Persyaratan yang tidak diketahui atau persetujuan yang belum ada memblokir akses offline. Terms of Service menyimpan versi dokumen terakhir yang diambil dan persetujuan terkonfirmasi server per akun. Versi baru yang belum disetujui langsung memblokir pembacaan, navigasi, dan catatan offline serta pengiriman sampai persetujuan online berhasil. Persetujuan offline tidak tersedia. Snapshot privat tetap di tab; hanya antrean terbatas dan snapshot dokumen hukum bertahan setelah muat ulang.

Host menyediakan `offline:outbox`, `offline:state`, dan `offline:accessPolicy` melalui ctx. Komponen mendaftarkan pengirim selama masa hidup penyedia dan ID operasi stabil melalui `offline:enqueue`; `offline:flush` mengotorisasi dan mengirim. Antrean permanen per akun dibatasi 1.000 catatan dan 1 MB selama tujuh hari, tanpa token. ID serta waktu asli dipertahankan; kegagalan sementara dicoba ulang, catatan yang dikonfirmasi atau ditolak permanen dihapus. Penolakan menampilkan peringatan terlokalisasi. Keluar menghapus antrean akun; pergantian akun tidak mengirim data akun lain. Menonaktifkan Mode Offline menghentikan catatan baru. Antrean lama tetap dapat dikirim saat online.

## Batas polling offline

Mode Offline menghentikan polling persetujuan dan pemulihan biasa. Hanya satu pemeriksaan kesehatan server ringan berjalan setiap lima belas menit, termasuk setelah peristiwa online browser berulang. Kegagalan pemulihan koneksi saat online memperpanjang interval hingga lima belas menit. Polling persetujuan memperpanjang interval kegagalan hingga lima menit, berhenti sepenuhnya saat offline, dan dilanjutkan setelah tersambung kembali. Persetujuan dokumen wajib yang disimpan tetap menjadi syarat akses offline.

## Komit

- [2dba1c6](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2dba1c61ea1ba7b219e06c09036408d89503571b)
- [2492ad3](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2492ad306ac7458b8d8e27083116420f298bebc1)
- [3b245ac](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3b245ac3c4fd6d4c03551ec02a90deda5fd5549f)
- [2a56415](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2a5641575b9f766b74436fa036ee34b17a5e79c9)
