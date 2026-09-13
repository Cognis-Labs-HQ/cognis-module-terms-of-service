# Standar Modul Ketentuan Layanan

Dokumen ini menetapkan arsitektur yang didukung untuk modul eksternal Ketentuan Layanan Cognis.

## Kontrak Publik

Modul mendaftarkan rute SPA publik `/terms-of-service`, `/privacy-policy`, dan `/eula`. Entri browser-nya hanya dipasang secara langsung pada jalur publik tersebut, sementara Administrasi menerima satu bagian Legal yang dilokalkan melalui `registerAdminSection`; rute API terautentikasi meminta peran dengan hak paling rendah yang sesuai.

Konten hukum yang diterbitkan berupa Markdown yang dirender Cognis melalui `ui:reuse`. Setiap penyimpanan menambahkan versi tetap melalui `docs:versionStore`. Modul tidak pernah mengimpor internal Cognis atau driver basis data tertentu.

Editor dokumen hukum memakai penyusun bagian yang dapat diciutkan milik host untuk satu kelompok deskriptor dokumen selebar penuh. Judul terlokalisasi berupa teks biasa, sedangkan kontrol Tambah/Hapus dan Tulis/Pratinjau yang disanitasi serta konten editor memakai bidang HTML tepercaya penyusun. Hanya versi dokumen tersimpan yang menentukan status Tambah atau Hapus, terlepas dari status bagian. Tulis dan Pratinjau memakai tombol baris tindakan host netral di bawah editor selebar penuh yang tidak dapat diubah ukurannya, dan modul memakai utilitas tooltip informasi serta pelacak perubahan mengambang Cognis. Penambahan editor menampilkan kotak penulisan Markdown dengan padding yang tidak dapat diubah ukurannya serta tombol Tulis dan Pratinjau bergaya penyusun Pesan; tindakan Simpan pada pelacak perubahan menerbitkan pembaruan melalui satu rute API persis untuk setiap dokumen tetap dan melaporkan keberhasilan melalui toast host. Editor yang telah diterbitkan terbuka kembali dengan Markdown tersimpan setelah halaman disegarkan. Buang memulihkan konten yang telah diterbitkan, atau menutup editor baru yang belum disimpan dan mengembalikan tindakannya ke Tambah; penghapusan editor memerlukan konfirmasi.

## Persetujuan dan Siklus Hidup

Modul mencatat versi Ketentuan dan Privasi persis yang disetujui setiap akun. Pendaftaran wajib meminta persetujuan tegas. Flow sesi terautentikasi dan pemeriksaan penyegaran latar depan setiap lima detik segera memblokir akun yang persetujuannya tidak mutakhir; penerimaan mencatat kedua versi dan penolakan mengeluarkan akun. Halaman hukum publik tetap tersedia selama penegakan. Status persetujuan dievaluasi secara terpisah untuk setiap versi Ketentuan, Privasi, dan EULA yang diterbitkan; popup persisten hanya mencantumkan dokumen yang belum diakui sebagai kartu kotak centang dan mengirimkan versi persisnya.

Pendaftaran berskop dihapus saat modul dinonaktifkan. Jika hook browser yang sudah dimuat mendapati endpoint persetujuan modul telah dihapus selama pembaruan atau mulai ulang, hook tersebut mencatat endpoint yang tidak tersedia, menghentikan permintaan persetujuan berikutnya, dan melanjutkan tanpa memblokir navigasi. Dokumen dan persetujuan bertahan setelah penonaktifan dan mulai ulang; pencopotan hanya menghapusnya saat `deleteContent` bernilai benar. Sumber daya browser memakai `cognis.uiCtx` serta kontrak host untuk umpan balik, navigasi, API, popup, i18n, dan entri halaman.

## Kualitas Repositori

Metadata manifest, paket, lockfile, dan rute pada root selalu tersinkron. Kode server berada di `api/`, kode browser di `ui/`, perintah operasional di `cli/`, dokumentasi lokal di `docs/`, metadata rilis di `changelog/`, dan karya visual di `assets/`. Pengujian memakai capability palsu lokal dan mencakup rute, persistensi, flow, siklus hidup, lokalisasi, dan pengemasan.
