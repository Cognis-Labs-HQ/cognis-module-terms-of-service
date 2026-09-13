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

## Commit

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
- [5ffec53](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/5ffec53354d1e93bf49b3850c64a56b3ccb1cef9)
- [427af9d](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/427af9d50be3bde15cb3f2fe53f44e5a7b743965)
