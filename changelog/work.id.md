# Penyimpanan dan Tata Letak Dokumen Hukum Dipulihkan

**Cabang Fitur:** work

## Konten dokumen tersimpan dipulihkan

Memetakan kembali bidang `content` yang didokumentasikan dari penyimpanan versi inti menjadi Markdown agar dokumen yang baru diterbitkan dikembalikan dengan benar dan tindakan Simpan pada pelacak perubahan dapat diselesaikan dengan sukses.

## Tata letak editor Hukum disempurnakan

Menampilkan ketiga dokumen sebagai kartu ringkas yang terpisah, mengurangi tinggi penyusun yang berlebihan, dan memberi penyusun selebar penuh ukuran kisi bawaan yang lebih praktis.

## Kontrak integrasi host diperbaiki

Menggunakan klaim terautentikasi yang dikembalikan oleh `auth:requireAuth` untuk mengatribusikan penerbitan dokumen sehingga Simpan tidak lagi mengirim pengenal pelaku kosong. Judul Hukum kini merender tooltip Markdown bersama kontennya, tindakan dokumen berada tepat di sebelah judulnya, panah pengungkapan yang berlebihan dihapus, dan gaya status tersembunyi secara andal menutup editor serta mengganti panel Tulis atau Pratinjau.

## Rute dokumen konkret didaftarkan

Mendaftarkan satu rute PUT dan GET publik yang persis untuk setiap dokumen hukum tetap karena router modul eksternal Cognis mencocokkan jalur secara persis. Buang kini menutup editor yang belum diterbitkan dan mengembalikan tindakannya ke Tambah, sedangkan editor dan panel mode secara tegas memakai seluruh lebar yang tersedia tanpa pengubahan ukuran oleh peramban.

## Editor terbitan dan penyegaran persetujuan dipulihkan

Dokumen tersimpan kini dirender terbuka dengan Markdown yang dipertahankan dan tindakan Hapus saat Administrasi disegarkan. Sesi terautentikasi yang terlihat memeriksa ulang persetujuan setiap lima detik, menjalankan pemeriksaan secara berurutan untuk mencegah popup ganda, dan menghentikan timer penyegaran ketika halaman dibongkar atau endpoint modul menghilang.

## Commit

- [2375f2c](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2375f2cbe45c6ab21d7d93a70d94d2cc3c6e82a7)
- [e20d857](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/e20d857715e08f3656717ad55a5918fe236820ab)
- [3fcbc91](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3fcbc91f42e61309ef7bd56491ddcf4311f605fd)
- [cc4f1ba](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/cc4f1ba0582fd8d87b96c5e678e968467f86d988)
