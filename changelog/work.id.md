# Penyimpanan dan Tata Letak Dokumen Hukum Dipulihkan

**Cabang Fitur:** work

## Konten dokumen tersimpan dipulihkan

Memetakan bidang `markdown` yang dikembalikan penyimpanan versi inti ke respons dokumen modul agar dokumen yang baru diterbitkan dikembalikan dengan benar dan tindakan Simpan pada pelacak perubahan dapat diselesaikan dengan sukses.

## Tata letak editor Hukum disempurnakan

Menampilkan ketiga dokumen sebagai kartu ringkas yang terpisah, mengurangi tinggi penyusun yang berlebihan, dan memberi penyusun selebar penuh ukuran kisi bawaan yang lebih praktis.

## Kontrak integrasi host diperbaiki

Menggunakan klaim terautentikasi yang dikembalikan oleh `auth:requireAuth` untuk mengatribusikan penerbitan dokumen sehingga Simpan tidak lagi mengirim pengenal pelaku kosong. Judul Hukum kini merender tooltip Markdown bersama kontennya, tindakan dokumen berada tepat di sebelah judulnya, panah pengungkapan yang berlebihan dihapus, dan gaya status tersembunyi secara andal menutup editor serta mengganti panel Tulis atau Pratinjau.

## Rute dokumen konkret didaftarkan

Mendaftarkan satu rute PUT dan GET publik yang persis untuk setiap dokumen hukum tetap karena router modul eksternal Cognis mencocokkan jalur secara persis. Buang kini menutup editor yang belum diterbitkan dan mengembalikan tindakannya ke Tambah, sedangkan editor dan panel mode secara tegas memakai seluruh lebar yang tersedia tanpa pengubahan ukuran oleh peramban.

## Editor terbitan dan penyegaran persetujuan dipulihkan

Dokumen tersimpan kini dirender terbuka dengan Markdown yang dipertahankan dan tindakan Hapus saat Administrasi disegarkan. Sesi terautentikasi yang terlihat memeriksa ulang persetujuan setiap lima detik, menjalankan pemeriksaan secara berurutan untuk mencegah popup ganda, dan menghentikan timer penyegaran ketika halaman dibongkar atau endpoint modul menghilang.

## Bagian host yang dapat diciutkan diterapkan

Merender deskriptor dokumen hukum melalui penyusun bagian host yang dapat diciutkan dengan judul terlokalisasi yang disanitasi, kontrol Tambah/Hapus dan Tulis/Pratinjau sebaris, serta konten editor. Modul kini terhubung ke slot mengambang Administrasi host tanpa gagal saat bagian terlepas, menyediakan peringatan navigasi yang dilokalkan, dan menghancurkan pelacak perubahan saat dilepas.

## Status editor tersimpan dan tata letak penulisan diperbaiki

Membaca Markdown tersimpan dari bidang respons aktual penyimpanan versi sehingga editor yang disegarkan tidak pernah menampilkan `undefined`. Status Tambah/Hapus kini hanya bergantung pada keberadaan versi tersimpan. Tooltip Hukum dikelompokkan di dalam judulnya, dan tindakan netral Tulis/Pratinjau berbagi baris dengan lebar sama di bawah editor selebar penuh yang tidak dapat diubah ukurannya.

## Penegakan persetujuan per dokumen ditambahkan

Melacak pengakuan secara terpisah untuk setiap versi Ketentuan, Privasi, dan EULA yang diterbitkan. Permintaan persetujuan persisten kini hanya menampilkan kartu kotak centang untuk dokumen baru atau diperbarui, dengan pengiriman versi persis serta tindakan keluar dan pengaturan akun. Permukaan editor memiliki tinggi mode tetap, input selebar penuh yang tidak dapat diubah ukurannya, dan kontrol netral berpadding di bawahnya.

## Persetujuan wajib dan navigasi hukum diintegrasikan

Menggunakan satu popup persetujuan wajib, kotak centang bergaya inti, pil Baru/Pembaruan sebaris, tooltip penolakan dan flow keluar host, serta endpoint penghapusan siklus hidup akun terautentikasi. Rute dokumen publik benar-benar publik, merender Markdown dalam popup ukuran penuh, dan dokumen terbitan menyumbangkan tautan footer rata kanan melalui `ui:footerLinks`.

## Tampilan dan penyimpanan persetujuan distabilkan

Memuat stylesheet persetujuan bersama integrasi navbar terautentikasi agar penyegaran dan navigasi SPA dirender sama. Menjaga pil inti tetap ringkas, menempatkan tautan dokumen pada baris tersendiri, menyimpan set versi terbitan lengkap, dan memverifikasi status tersimpan sebelum menutup persetujuan.

## Halaman dokumen hukum publik disatukan

Menghapus popup yang berlebihan dari rute hukum publik dan merender setiap dokumen melalui penyusun halaman host. Halaman dengan shell penuh yang dihasilkan memakai pengguliran dokumen alami dan membangun navigasi samping dari judul bagian Markdown yang dirender.

## Kontrol dan penyimpanan persetujuan diperbaiki

Menggunakan gaya choice-checkbox dan state-pill Cognis yang dapat dipakai ulang, menjamin baris tautan dokumen terpisah, dan menunggu gaya tersebut sebelum membuka persetujuan. Persetujuan kini memakai kontrak database terstruktur INSERT dengan pembaruan konflik dan memverifikasi hasil tersimpan agar versi yang sudah diterima tidak diminta lagi saat navigasi.

## Laporan persetujuan dan shell halaman lengkap

Menambahkan tabel persetujuan pengguna yang dapat dicari dan dipaginasi sepuluh baris pada setiap dokumen hukum dengan filter Semua, Diterima, dan Belum diterima. Halaman publik kini mengikuti urutan inisialisasi halaman Jitsi untuk pemuatan dan sesi terautentikasi, sementara permukaan editor tetap mencegah perubahan ukuran dan lompatan tata letak.

## Commit

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
- [427af9d](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/427af9d50be3bde15cb3f2fe53f44e5a7b743965)
- [b9c93cc](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/b9c93cc2de5693f69cdf63bb0d1d9419ef5c7ceb)
- [1adbdf7](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/1adbdf77939aa53f70f2fef75b93bce9841bd746)
- [0c9207e](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/0c9207e9a3c872266558207cc5a8d61f4c63ca12)

- [f193e16](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f193e1610daf5abc76d07510115605d396edf5f2)

- [f500db9](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/f500db9c46919a4e9bf2911751340eb515b3213e)

- [2c96447](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2c9644756b1f693cd711695eb9cf1083fe5c36d9)
