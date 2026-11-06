# Tutorial terpandu

Modul ini mengikat panduan pengantarnya pada halamannya melalui `ui:tutorials`. Kunjungan pertama yang diizinkan memulainya otomatis; SVG tanda tanya di samping judul halaman memutar ulang panduan. Host harus menyediakan kontrak tutorial terikat halaman versi satu.

## Contoh Penggunaan

Alur memperkenalkan dokumen hukum dan navigasinya tanpa memberikan atau mengubah persetujuan. Sesi online terautentikasi diperlukan.

## Spesifikasi Teknis

Host mengelola petunjuk, panah, sorotan, aksesibilitas, dan menu aksi mengambang bersama. Sesi pertama selalu menyediakan Berikutnya, tanpa Batal atau Lewati. Pemutaran ulang menyediakan Batal dengan `btn-cancel`. Penyelesaian disimpan di browser per akun. Navigasi, hilangnya akses, atau pelepasan penyedia mengakhiri sesi; pemasangan gagal membatalkan registrasi.

Panduan hanya memberi informasi dan tidak menjalankan aksi berizin khusus. Target yang hilang dapat dilewati dengan Berikutnya pada sesi pertama, atau dicoba lagi maupun dibatalkan saat pemutaran ulang.

Pengujian penyedia memeriksa kontrak publik, keempat terjemahan, aturan ketersediaan, pembersihan saat gagal, dan penolakan versi host yang tidak didukung.

Panduan hukum cocok dengan halaman Ketentuan Layanan, Kebijakan Privasi, dan EULA, serta tetap pada dokumen yang dibuka pengguna.

Panduan administrator menjelaskan penerbitan berversi dan laporan persetujuan di bagian Hukum yang terlihat. Panduan ini memerlukan akses administrator dan tidak menyimpan perubahan atau memberikan persetujuan.

Setiap langkah tutorial kini menetapkan `highlightNext` secara eksplisit: penjelasan yang memerlukan Berikutnya atau Selesai mengaktifkannya, sedangkan latihan berbasis interaksi atau penantian menonaktifkannya. Pengurangan gerakan mempertahankan garis tepi statis.

Panduan dokumen menyoroti judul dokumen, sedangkan panduan persetujuan menyoroti kolom pencarian laporan persetujuan dokumen terbit yang tersedia. Target pertama yang dapat digunakan dipilih dalam bagian tutorial; langkah dilewati jika tidak ada kontrol yang cocok.
