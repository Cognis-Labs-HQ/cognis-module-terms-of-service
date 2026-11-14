# Persetujuan pendaftaran

**Cabang Fitur:** feature-onboarding-consent-scope

## Persetujuan pendaftaran

Pendaftaran menggunakan kontrak auth:onboarding versi satu. Kontribusi constructRegistrationUi hanya mendeklarasikan terms-of-service:consent:status dan terms-of-service:consent:record. Fungsi penyelesaian menerima executeOnboarding dan menolak melanjutkan tanpa kotak persetujuan yang dipilih secara eksplisit. Fungsi ini mengirim tepat versi dokumen terbit saat ini. Persetujuan yang tidak ada serta versi tidak valid atau tidak lengkap ditolak; versi yang berubah atau sudah disetujui menghasilkan konflik, bukan persetujuan ulang diam-diam.

Auth menyediakan akun pendaftaran terverifikasi serta mengelola kedaluwarsa, pencabutan, ketersediaan operasi, dan masa hidup penyedia. Modul tidak menerima ID akun dari masukan pendaftaran. Alur persiapannya hanya memvalidasi; pemanggilan alur langsung tidak dapat menyimpan persetujuan. Wewenang diperiksa setelah inisialisasi dan tepat sebelum penyimpanan setelah pembacaan dokumen asinkron. Rute persetujuan biasa, pelaporan, dan penerbitan tetap memakai pemeriksaan sesi dan peran.

Pasang dahulu host Cognis dengan auth:onboarding dan kontrak fungsi pendaftaran terbatas. Kemudian perbarui modul sebelum membuka kembali pendaftaran. Host dan modul harus dirilis secara terkoordinasi: fungsi lama yang mengharapkan apiFetch terautentikasi tidak dapat memakai kredensial pendaftaran terbatas. Tanpa auth:onboarding, inisialisasi modul ditolak. Tidak ada jalur cadangan token luas atau alias alur lama. Dokumen dan versi yang telah disetujui tetap dipertahankan.

Penyimpanan persetujuan dan pencabutan kredensial Auth merupakan operasi terpisah. Penulisan basis data yang sedang berjalan tidak dapat dibatalkan oleh pembatalan berikutnya; penyimpanan berhasil dapat mendahului kegagalan respons atau pemeriksaan pencabutan. Masuk kembali secara normal untuk memeriksa status persetujuan; kegagalan transportasi tidak membuktikan persetujuan. Pendaftaran hanya mengirim persetujuan setelah pengguna memilihnya secara eksplisit.

## Komit

- [c57bfd2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c57bfd265cba82e573273e41313de8bfbdf07120)
