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

## Pulihkan pemuatan bagian Legal

Muat CSS milik modul melalui pembantu publik page-styles. Katalog stylesheet bersama hanya menerima nama relatif sumber daya bersama; URL modul menggagalkan impor UI dan menyembunyikan bagian Legal. Pengujian menegakkan batas ini dan memverifikasi penemuan bagian administrasi.

## Pertahankan ID modul pada kunci

Kunci terjemahan menggunakan `module.<manifest.id>.<feature>.<label>`. Pertahankan ID modul yang terdiri dari beberapa kata beserta tanda hubungnya; untuk `terms-of-service`, gunakan `module.terms-of-service.admin.title`. Sufiks setelah ID modul menggunakan kata huruf kecil yang dipisahkan titik. Metadata manifes, berkas XML, dan referensi kode harus memakai namespace yang sama.

## Pertahankan tautan legal di footer

Semua klien browser menggunakan registri footer milik `ctx`, termasuk skrip statis dan bundel yang dimuat terpisah. Deskriptor footer dapat meminta `target: "_blank"`; perender menambahkan `noopener noreferrer`. Penyedia autentikasi menyediakan label terjemahan dan konteks autentikasi, sedangkan tautan legal sesi masuk secara eksplisit memakai konteks aplikasi. Pemulihan riwayat dan cache browser memperbarui tautan dokumen legal yang diterbitkan tanpa mengganti tautan inti Lisensi atau Catatan Perubahan.

## Komit

- [41d44fb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/41d44fb683efbe9206ebe78a32f4b9f78cef2bb9)
- [bf9b760](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/bf9b760ddc729dd30f1309013c186bdd11321308)
- [1fe6b25](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1fe6b25a95416e45b08cbf32600d2d3886b70452)
- [d2639c0](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d2639c08ce40c538932e1bdd938ba03e6a81ddfc)
- [7655c5f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/7655c5f9319158ba37f93d2918704cd23a378526)
- [74202d2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/74202d2bc56373bbce9fbd0c3cc3d271eb74e32f)
- [146fc39](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/146fc39fdefd6b3715d1b0a34a65fa102e05157f)
- [48dde68](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/48dde68726c5009893be9c1ea54e9799653fd655)
- [f4f4598](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f4f45988a7cc220ff43b22f16fae7adfd860148f)
