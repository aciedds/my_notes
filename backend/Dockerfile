# Gunakan official Bun image sebagai dasar
FROM oven/bun:1.0 AS base

# Tentukan direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# --- DEPENDENCIES STAGE ---
# Copy file package.json dan bun.lockb terlebih dahulu
# Ini memanfaatkan Docker layer caching. Jika file ini tidak berubah,
# Docker tidak akan menginstall ulang dependensi.
COPY package.json bun.lockb* ./

# Install semua dependensi
# --frozen-lockfile memastikan instalasi sesuai persis dengan lockfile
RUN bun install --frozen-lockfile


# --- BUILD & RUN STAGE ---
# Copy sisa source code aplikasi
COPY . .

# Build TypeScript menjadi JavaScript (jika ada build step)
# Asumsikan ada skrip "build" di package.json: "build": "tsc"
RUN bun run build

# Port yang akan diekspos oleh aplikasi
EXPOSE 3000

# Perintah untuk menjalankan aplikasi setelah kontainer启动
# Kita menjalankan file hasil build dari folder /dist
CMD [ "bun", "dist/server.js" ]