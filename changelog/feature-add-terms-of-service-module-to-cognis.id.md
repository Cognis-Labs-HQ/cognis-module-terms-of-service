# Modul Ketentuan Layanan

**Cabang fitur:** `feature-add-terms-of-service-module-to-cognis`

## Administrasi dokumen hukum

Menambahkan bagian Legal di Administrasi untuk menyusun dan menerbitkan Ketentuan Layanan, Kebijakan Privasi, dan EULA melalui kontrak penyusun Markdown Cognis.

## Halaman hukum publik

Menerbitkan tiga rute publik tetap dengan rendering Markdown tersanitasi, penyimpanan persisten milik modul, otorisasi, pelokalan, dan pembersihan siklus hidup.

## Kontrak reuse browser yang tersedia

Menggunakan `cognis.uiCtx` dan `ui:reuse.importModule()` seperti modul di sekitarnya, mengimpor renderer Markdown core yang sudah ada secara langsung, dan menerapkan ekspor sub-composer Administrasi yang mapan tanpa memerlukan kapabilitas core baru.

## Versi hukum tetap dan persetujuan wajib

Setiap penerbitan membuat versi tetap melalui kapabilitas versi dokumen core. Pendaftaran mencatat persetujuan tegas terhadap Ketentuan dan Kebijakan Privasi terkini, sedangkan akun lama menerima permintaan persetujuan yang tidak dapat dilewati setiap kali salah satu dokumen berubah; penolakan mengeluarkan akun.

## Struktur modul eksternal dan panduan kontributor

Menyelaraskan repositori dengan konvensi modul Jitsi Meet dan Nextcloud Whiteboard yang dipelihara: direktori changelog bersama di root, instruksi AI khusus modul yang tersinkron, integrasi CLI yang dipulihkan, standar keadaan terkini yang ringkas, serta pengujian mandiri untuk kontrak dokumentasi dan struktur.

## Commit

- [d0e4701](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/d0e4701b5dc43aa21efb59bcffcbc45f4504ec65) — Mengimplementasikan modul penerbitan dokumen hukum.
- [3f00993](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/3f00993d648f17ac8b1fb0953747d9e36e684496) — Menggunakan kontrak reuse UI host yang sudah tersedia.
- [27b6605](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/27b66054102cba443e7b9d74213da0099697f695) — Menambahkan versi tetap dan penegakan persetujuan hukum per akun.
- [361dac2](https://github.com/Cognis-Labs-HQ/cognis-module-terms-of-service/commit/361dac2396c03224fc407f79d400bb6c163c61ec) — Menyelaraskan struktur modul eksternal dan panduan kontributor.
