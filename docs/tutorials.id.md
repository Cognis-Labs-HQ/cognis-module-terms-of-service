# Tutorial terpandu

Modul ini mengikat panduan pengantarnya pada halamannya melalui `ui:tutorials`. Kunjungan pertama yang diizinkan memulainya otomatis; SVG tanda tanya di samping judul halaman memutar ulang panduan. Host harus menyediakan kontrak tutorial terikat halaman versi satu.

## Contoh Penggunaan

Alur memperkenalkan dokumen hukum dan navigasinya tanpa memberikan atau mengubah persetujuan. Sesi online terautentikasi diperlukan.

## Spesifikasi Teknis

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Panduan hukum cocok dengan halaman Ketentuan Layanan, Kebijakan Privasi, dan EULA, serta tetap pada dokumen yang dibuka pengguna.

Panduan publik menjelaskan judul bagian dalam dokumen saat ini dan melewati navigasi jika tidak ada judul bagian. Panduan administrator membuka editor untuk satu dokumen yang tetap, memerlukan perubahan nyata sebelum cabang Pratinjau, dan menjelaskan penerbitan hanya setelah pratinjau draf terlihat. Berikutnya melewati cabang pengeditan yang belum dijalankan, laporan persetujuan yang tidak tersedia dikecualikan, dan konten tidak diterbitkan atau dibuang secara otomatis. Kunci penyimpanan `module.terms-of-service.offline` tetap dipertahankan agar snapshot yang dikonfirmasi server terus mengizinkan akses luring setelah pembaruan.

Host bersama menyediakan aksi mengambang melalui antreannya. Kunjungan awal menawarkan Berikutnya/Selesai tanpa Batal atau Lewati; pemutaran ulang menawarkan Lewati sebelum tahap terlihat terakhir. Mulai Ulang Tutorial muncul setelah tahap terlihat pertama. Penyelesaian tetap berlaku setelah pembaruan konten. Flag highlightNext hanya mengaktifkan animasi berdenyut untuk penjelasan; pengurangan gerakan menonaktifkannya. Setiap tahap menyorot kontrol nyata berbeda sesuai urutan UI. Panduan tetap terikat ke tampilan aktif, menangani keadaan kosong dan opsional, serta membersihkan sumber daya saat navigasi atau pelepasan pemilik.
