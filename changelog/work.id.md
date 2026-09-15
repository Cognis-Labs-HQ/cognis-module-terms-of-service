# Dokumen Hukum Publik Tanpa Shell Login

**Cabang Fitur:** work

## Dokumen hukum tersedia tanpa masuk

Setiap rute hukum tetap menggunakan penyusun halaman Cognis. Bagi pengunjung tanpa sesi login, flag penyusun menyembunyikan bilah atas, navigasi, tombol tema, footer, konteks halaman, bilah alat, penyimpanan tata letak, dan penyempurnaan akun sehingga hanya dokumen terbitan hasil render Markdown yang terlihat. Setiap rute SPA hukum didaftarkan secara tegas dengan kemampuan rute host `public: true`, sehingga Cognis dapat menyajikan dan merutekannya secara anonim tanpa melemahkan rute yang dilindungi. Halaman masuk dan pendaftaran memuat plugin footer autentikasi khusus yang menyumbangkan ketiga tautan rute hukum publik terlokalisasi secara sinkron melalui registri footer bersama, tanpa menunggu permintaan API dokumen. Pengguna terautentikasi tetap memperoleh tampilan dokumen dengan shell lengkap dan perbandingan perubahan yang sudah ada.

## Status belum diterima terlihat merah

Status persetujuan yang belum diterima kembali memakai pil status nonaktif merah dari inti sehingga tetap terlihat berbeda dari status yang diterima.

## Commit

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
