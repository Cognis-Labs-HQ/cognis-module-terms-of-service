# Modernisasi pengeditan dokumen hukum

**Cabang Fitur:** feature-update-legal-page-button-functionality

## Kontrol dokumen yang lebih ringkas

Memindahkan setiap tindakan buat ke samping judul dokumennya dan mengubahnya menjadi tindakan Hapus yang bersifat destruktif saat editor terbuka. Penghapusan editor kini memerlukan konfirmasi eksplisit.

## Utilitas pengeditan Cognis terintegrasi

Menggunakan pelacak perubahan Cognis untuk tindakan Simpan dan Buang, menerbitkan perubahan dari Simpan disertai toast keberhasilan, serta menjelaskan dukungan Markdown melalui tooltip informasi di samping judul Legal.

## Tata letak penulisan yang ditingkatkan

Menyediakan editor selebar penuh yang tidak dapat diubah ukurannya dengan kontrol Tulis dan Pratinjau berukuran sama yang tersambung di bawah area pengeditan.

## Galat pemasangan rute Administrasi dicegah

Membatasi pemasangan halaman langsung pada tiga rute dokumen hukum publik agar pemuatan kontribusi di `/administration` tidak memicu galat rute yang tidak didukung.

## Navigasi tetap tersedia selama modul dimulai ulang

Saat hook persetujuan yang telah dimuat menerima respons endpoint yang tidak ditemukan ketika modul diperbarui atau dimulai ulang, hook kini mencatat fallback siklus hidup, menghentikan pemeriksaan berikutnya, dan melanjutkan alih-alih menolak flow autentikasi serta memblokir navigasi.

## Commit

- [00eaced](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/00eaced82b2b476b53ddedb031a5d12214d69e61)
- [877d0ab](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/877d0abd97b345c5a95dbbff3c5ed12f90ee03f7)
- [2d2b595](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/2d2b59547b04d5f9a1f34483f3ef264749b31c81)
- [4432dc8](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/4432dc8ee1a2d7887b99b0eeee70c8c030d40926)
