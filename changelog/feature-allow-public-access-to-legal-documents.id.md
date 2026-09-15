# Dokumen Hukum Publik Tanpa Shell Login

**Cabang Fitur:** feature-allow-public-access-to-legal-documents

## Dokumen hukum tersedia tanpa masuk

Setiap rute hukum tetap menggunakan penyusun halaman Cognis. Bagi pengunjung tanpa sesi login, flag penyusun menyembunyikan kontrol shell global yang bergantung pada akun sambil mempertahankan bingkai dokumen, konteks halaman terlokalisasi, dan bilah alat bagian. Setiap rute SPA hukum didaftarkan secara tegas dengan kemampuan rute host `public: true`, sehingga Cognis dapat menyajikan dan merutekannya secara anonim tanpa melemahkan rute yang dilindungi. Halaman masuk dan pendaftaran memuat plugin footer autentikasi khusus yang memeriksa setiap dokumen publik secara terpisah dan hanya menyumbangkan tautan rute hukum terlokalisasi ketika dokumen diterbitkan; satu pemeriksaan yang gagal tidak menghalangi tautan lainnya. Pengguna terautentikasi tetap memperoleh tampilan dokumen dengan shell lengkap dan perbandingan perubahan yang sudah ada.

## Status belum diterima terlihat merah

Status persetujuan yang belum diterima kembali memakai pil status nonaktif merah dari inti sehingga tetap terlihat berbeda dari status yang diterima.

## Footer autentikasi dan tata letak publik

Footer autentikasi mempertahankan tautan Lisensi milik host, menghapus tautan Changelog khusus pengguna terautentikasi, dan menampilkan ketiga tautan hukum. Halaman hukum publik kini mempertahankan tata letak dokumen tersusun alih-alih dirender dari tepi ke tepi.

## Pembersihan footer autentikasi

Plugin footer autentikasi kini menyimpan setiap disposer tautan milik modul. Teardown yang diekspor menghapus tautan tersebut dan memulihkan deskriptor Changelog inti sehingga tidak ada tautan usang setelah siklus penonaktifan, pencopotan, dan pengaktifan ulang.

## Commit

- [53ee39c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/53ee39c1c93dd3e7a75d08c08fa1117b79002240)
- [9498acb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/9498acb599c82fa207a9cee75ceaac031d1f992b)
- [c1b177e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/c1b177e9259d9ece1cbed1645db76d8d80d27d3e)
- [11033bb](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/11033bbe0ab028c2b32fca066e2a46719abf5738)
- [79912f9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/79912f9f68759309d0e0b71b4d53422cc93eab2f)
- [b8fcb15](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b8fcb1500ad700ed8aa6422148edf6539daee976)
- [f81a194](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f81a194a3d10e8663d31367aa1c9017094f476db)
- [0e7944f](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0e7944f94387695520604e30696097c06f192676)
- [1d1b88e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1d1b88ed34fb5e39e375b6fe1d48618b6e9b7e5a)
