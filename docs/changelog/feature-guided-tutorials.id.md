# Tutorial terpandu

**Feature Branch:** feature-guided-tutorials

## Spesifikasi Teknis

Alur memperkenalkan dokumen hukum dan navigasinya tanpa memberikan atau mengubah persetujuan. Sesi online terautentikasi diperlukan.

Modul mendaftarkan alur dan teks terjemahannya melalui ctx. Host mengelola katalog, petunjuk, panah, sorotan, kendali papan ketik dan penunjuk, navigasi SPA dengan pemeriksaan akses, serta aksesibilitas. Menutup tutorial, berpindah halaman di luar alur, kehilangan akses atau menonaktifkan modul mengakhiri sesi. Kegagalan pemasangan penyedia membatalkan pendaftarannya.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

## Kunjungan Awal Terikat Halaman

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

## Panduan Halaman

Panduan hukum cocok dengan halaman Ketentuan Layanan, Kebijakan Privasi, dan EULA, serta tetap pada dokumen yang dibuka pengguna.

## Panduan Administrasi Hukum

Panduan terbatas pada bagian administrasi Hukum yang terlihat menjelaskan penerbitan berversi dan laporan persetujuan tanpa mengubah dokumen atau memberikan persetujuan.

## Petunjuk Yang Berguna

Langkah tutorial berfokus pada kontrol dan tugas yang tersedia, tanpa pernyataan yang tidak relevan tentang izin atau tindakan yang tidak dilakukan panduan.

## Komit

- [5c18cc7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5c18cc77ee2ea8a0629214557234304abab94ab8)
- [16412de](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/16412de6ffeaa1dbf3f5fc759e3b5dba57affa0f)
- [76a5028](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/76a5028bf65622ee5102df8ae30e241e7e059ec5)
- [c61b252](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c61b2522ce21c069eff5106a637926da90567d55)
- [8831fd7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/8831fd774be8df97f89e50e30f27cd9b04757f73)
