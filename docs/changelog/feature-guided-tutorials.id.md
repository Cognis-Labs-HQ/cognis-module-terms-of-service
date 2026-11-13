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

## Tentukan isyarat Berikutnya per langkah

Setiap langkah tutorial kini menetapkan `highlightNext` secara eksplisit: penjelasan yang memerlukan Berikutnya atau Selesai mengaktifkannya, sedangkan latihan berbasis interaksi atau penantian menonaktifkannya. Pengurangan gerakan mempertahankan garis tepi statis.

Setiap komponen antarmuka wajib dicakup tutorial. Panduan kontribusi mengharuskan alur tugas yang berfokus pada pengguna dan peninjauan tutorial setiap kali fitur atau perilaku antarmuka berubah.

## Target tepat dan pengulangan cabang

Panduan dokumen menyoroti judul dokumen, sedangkan panduan persetujuan menyoroti kolom pencarian laporan persetujuan dokumen terbit yang tersedia. Target pertama yang dapat digunakan dipilih dalam bagian tutorial; langkah dilewati jika tidak ada kontrol yang cocok.

## Wilayah tutorial yang terlihat

Wilayah tutorial dan isyarat Berikutnya ditetapkan secara eksplisit.

## Antrean menu mengambang bersama

Menu mengikuti antrean host bersama dan masa hidup komponen.

## Kontrol pemulihan yang didokumentasikan

Tampilan target hilang menyediakan Berikutnya dan Mulai Ulang Tutorial; pemutaran ulang juga menyediakan Batal.

## Panduan tutorial terarah

Tutorial menjelaskan kontrol terlihat yang berbeda sesuai urutan UI. Petunjuk bersama mencakup penemuan tampilan aktif, contoh stabil, keadaan kosong, cabang bersyarat, dan pembersihan siklus hidup. Kontrol pemutaran ulang serta dokumentasi pengurangan gerakan sesuai host bersama.

## Katalog Terjemahan yang Konsisten

Kunci terjemahan menggunakan kata huruf kecil yang dipisahkan titik pada metadata modul dan tutorial. Entri katalog mempertahankan nilai terjemahan asli dan mengikuti indentasi XML di sekitarnya. Pemeriksaan namespace yang ketat menolak tanda hubung dan garis bawah pada kunci terjemahan. ID modul, UUID, kapabilitas, dan identitas penyelesaian tutorial tetap sama.

## Perbaikan Tutorial Dokumen Hukum

Panduan publik menjelaskan judul bagian dalam dokumen saat ini dan melewati navigasi jika tidak ada judul bagian. Panduan administrator membuka editor untuk satu dokumen yang tetap, memerlukan perubahan nyata sebelum cabang Pratinjau, dan menjelaskan penerbitan hanya setelah pratinjau draf terlihat. Berikutnya melewati cabang pengeditan yang belum dijalankan, laporan persetujuan yang tidak tersedia dikecualikan, dan konten tidak diterbitkan atau dibuang secara otomatis. Kunci penyimpanan `module.terms-of-service.offline` tetap dipertahankan agar snapshot yang dikonfirmasi server terus mengizinkan akses luring setelah pembaruan.

## Komit

- [5c18cc7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5c18cc77ee2ea8a0629214557234304abab94ab8)
- [16412de](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/16412de6ffeaa1dbf3f5fc759e3b5dba57affa0f)
- [76a5028](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/76a5028bf65622ee5102df8ae30e241e7e059ec5)
- [c61b252](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c61b2522ce21c069eff5106a637926da90567d55)
- [8831fd7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/8831fd774be8df97f89e50e30f27cd9b04757f73)
- [50559bd](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/50559bde9f2021065a433e64f87563e18d35edee)
- [65032ae](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/65032aee78c1abd7007732ec97fee081a436aa14)
- [5613809](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/56138097d74e38bd34f0c05c024d9770d59adedf)
- [1a75db1](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1a75db178c7c3550aa4e5aea74089df66c8acfb0)
- [5fe49707c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5fe49707c9638dbdd173fd74046188312f13945e)
- [46186da39](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/46186da399d77530c3349fb0bd9c711315bcc719)
- [feaf0ce](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/feaf0ceecf088f06aa8d80891e0413086bec6ddd)
