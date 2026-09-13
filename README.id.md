# Modul Ketentuan Layanan Cognis

[English](README.en.md) · [Deutsch](README.de.md) · **Bahasa Indonesia** · [日本語](README.ja.md)

Menambahkan bagian **Legal** ke Administrasi Cognis untuk menerbitkan Ketentuan Layanan, Kebijakan Privasi, dan EULA pada `/terms-of-service`, `/privacy-policy`, dan `/eula`.

## Dukungan Cognis core yang diperlukan

Kontrak browser yang ada sudah cukup untuk Markdown, umpan balik, navigasi, dan Administrasi. Core juga harus mengekspos penyimpanan append-only milik arsip Dokumentasi dan Changelog sebagai kapabilitas `docs:versionStore`, dengan `createStore({ namespace, database, documents })` serta operasi `ensureSchema()`, `getLatest(slug)`, `publish({ slug, content, actorId })`, dan `deleteAll()`. `publish` selalu membuat versi tetap dengan pengenal kriptografis. Core juga harus menyediakan flow `construct-registration-ui` dengan tahap `compose-form`, memuat integrasi pada `/register`, memvalidasi bidangnya, lalu menjalankan `completeRegistration({ apiFetch })` setelah sesi terautentikasi tersedia. Penegakan bagi akun lama memakai kontrak `authenticate-session`, popup, logout, router, dan `uiCtx` yang sudah ada.

## Keamanan dan siklus hidup

Hanya administrator yang dapat mengelola dokumen. Pembaca publik hanya dapat mengambil tiga dokumen tetap. Konten tetap ada saat dinonaktifkan dan hanya dihapus saat pencopotan menggunakan `deleteContent`.
