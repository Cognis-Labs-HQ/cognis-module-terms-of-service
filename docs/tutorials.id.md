# Tutorial terpandu

Modul ini mengikat panduan pengantarnya pada halamannya melalui `ui:tutorials`. Kunjungan pertama yang diizinkan memulainya otomatis; SVG tanda tanya di samping judul halaman memutar ulang panduan. Host harus menyediakan kontrak tutorial terikat halaman versi satu.

## Contoh Penggunaan

Alur memperkenalkan dokumen hukum dan navigasinya tanpa memberikan atau mengubah persetujuan. Sesi online terautentikasi diperlukan.

## Spesifikasi Teknis

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Panduan hukum cocok dengan halaman Ketentuan Layanan, Kebijakan Privasi, dan EULA, serta tetap pada dokumen yang dibuka pengguna.

Host bersama menyediakan aksi mengambang melalui antreannya. Kunjungan awal menawarkan Berikutnya/Selesai tanpa Batal atau Lewati; pemutaran ulang menawarkan Lewati sebelum tahap terlihat terakhir. Mulai Ulang Tutorial muncul setelah tahap terlihat pertama. Penyelesaian tetap berlaku setelah pembaruan konten. Flag highlightNext hanya mengaktifkan animasi berdenyut untuk penjelasan; pengurangan gerakan menonaktifkannya. Setiap tahap menyorot kontrol nyata berbeda sesuai urutan UI. Panduan tetap terikat ke tampilan aktif, menangani keadaan kosong dan opsional, serta membersihkan sumber daya saat navigasi atau pelepasan pemilik.

Mulai dari satu dokumen hukum. Untuk dokumen baru, klik Tambah; untuk dokumen terbit, gunakan editornya. Tulis atau revisi Markdown, lalu klik Pratinjau untuk memeriksa tampilan pembaca. Tidak ada aksi tutorial yang menerbitkan draf. Simpan dan Buang tersedia melalui menu perubahan yang mengantre setelah panduan selesai. Cabang persetujuan memilih dokumen terbit secara terpisah dari draf, membuka pelacaknya, dan menjelaskan pencarian akun, filter Disetujui/Tertunda/Semua serta kolom versi yang disetujui dan terbaru. Hasil kosong dan instalasi tanpa dokumen terbit tidak membuat catatan persetujuan.
