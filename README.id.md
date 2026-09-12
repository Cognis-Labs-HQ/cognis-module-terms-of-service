# Modul Ketentuan Layanan Cognis

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Menambahkan bagian **Legal** ke Administrasi Cognis untuk menerbitkan Ketentuan Layanan, Kebijakan Privasi, dan EULA pada `/terms-of-service`, `/privacy-policy`, dan `/eula`.

## Dukungan Cognis core

Tidak diperlukan perubahan core tambahan untuk Markdown atau pendaftaran Administrasi. Seperti modul di sekitarnya, kode browser membaca `globalThis[Symbol.for("cognis.uiCtx")]`, memperoleh `ui:reuse` melalui `uiCtx.capabilities.get("ui:reuse")`, lalu mengimpor `markdown-renderer.js`. Kontrol Tulis dan Pratinjau milik modul memakai implementasi `renderMarkdown()` tersanitasi yang sudah tersedia. Toast dan dialog kesalahan diperoleh dari kapabilitas `uiCtx` yang ada. Ekspor `createAdminSection({ i18n, apiFetch })` menyediakan kontrak sub-composer Administrasi yang sudah ada.

## Keamanan dan siklus hidup

Hanya administrator yang dapat mengelola dokumen. Pembaca publik hanya dapat mengambil tiga dokumen tetap. Konten tetap ada saat dinonaktifkan dan hanya dihapus saat pencopotan menggunakan `deleteContent`.
