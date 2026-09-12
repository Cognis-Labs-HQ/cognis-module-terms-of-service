# Modul Ketentuan Layanan Cognis

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Menambahkan bagian **Legal** ke Administrasi Cognis untuk menerbitkan Ketentuan Layanan, Kebijakan Privasi, dan EULA pada `/terms-of-service`, `/privacy-policy`, dan `/eula`.

## Dukungan Cognis core yang diperlukan

Core harus mengekspos `ui:reuse` melalui `ctx`, komponen browser `markdown:composer` dengan `bind(options)` dan `render(element, markdown)`, serta `ctx.registerAdminSection(options)` yang terikat siklus hidup. Host memberikan klien router, i18n, toast, dialog kesalahan, fokus, dan reuse kepada `mount(root, host)`. Renderer dan pratinjau wajib memakai implementasi Markdown tersanitasi yang sama dengan penyusun pesan.

## Keamanan dan siklus hidup

Hanya administrator yang dapat mengelola dokumen. Pembaca publik hanya dapat mengambil tiga dokumen tetap. Konten tetap ada saat dinonaktifkan dan hanya dihapus saat pencopotan menggunakan `deleteContent`.
