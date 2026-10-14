# Selaraskan modul dengan templat kontributor

**Cabang Fitur:** feature-align-module-template

## Lepas status pemuatan saat pembatalan

1.5.47 — Halaman langsung yang dibatalkan segera melepas token pemuatan bersama, meskipun inisialisasi terjemahan, penyedia, atau composer masih tertunda. Pembersihan sumber daya tetap terikat pada sinyal host yang sama.

## Target paket dan panduan pengembang

Rilis 1.5.46 — Validasi paket memastikan titik masuk, ikon, banner, dan tangkapan layar berupa file reguler di dalam checkout, termasuk setelah resolusi jalur. Dokumentasi menjelaskan kontrak publik dan merujuk manifes untuk metadata rilis; changelog mempertahankan asal-usul rilis. Halaman legal publik memakai sinyal siklus hidup entri langsung host. Pemuatan terjemahan atau dokumen yang dibatalkan tidak menerbitkan UI usang, composer dihancurkan saat pembatalan, dan inisialisasi terlambat tidak memperbarui footer halaman tujuan. Setiap token pemuatan dilepas saat selesai, gagal, atau dibatalkan.

## Struktur standar dan integrasi milik modul

Sinkronkan panduan templat, jalur rute domain, dokumentasi integrasi terjemahan, pemeriksaan struktur, dan hash paket akhir. Pertahankan URL publik dan identitas modul. Kontribusi browser mengikuti kontrak siklus hidup host masing-masing.

## Pertahankan ilustrasi banner terlihat

Susun ulang banner Terms of Service agar logo, judul, dokumen dan perisai tetap terlihat penuh dalam potongan Marketplace. Pertahankan ikon dokumen yang ada.

## Deskripsi Marketplace yang konsisten

Gunakan ringkasan tindakan singkat dan deskripsi fitur konkret pada metadata Marketplace dengan makna terjemahan yang selaras.

## Pulihkan nama marketplace dan editor dokumen legal selebar ruang tersedia

Pertahankan pengenal terjemahan marketplace yang telah diterbitkan di seluruh saluran rilis. Muat stylesheet Legal milik modul melalui kapabilitas penggunaan ulang UI host agar editor teks administrasi memenuhi lebar yang tersedia.

## Otorisasi perubahan dokumen legal

Alur penerbitan dan persetujuan mengautentikasi permintaan pada tahap otorisasi. Penerbitan memerlukan administrator; identitas pelaku dan akun persetujuan hanya berasal dari klaim terverifikasi. Pengujian mencakup pemanggilan alur langsung dan identitas palsu. Dokumentasi footer autentikasi kini menjelaskan kontrak penyedia deskriptor.

## Komit

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)
- [7655c5f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/7655c5f9319158ba37f93d2918704cd23a378526)
