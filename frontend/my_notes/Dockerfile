# --- STAGE 1: Build ---
# Tahap ini bertugas untuk membangun aplikasi Vue menjadi file statis
FROM oven/bun:1.0 AS build

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile
COPY . .

# Build-time argument untuk API URL
# Nilai ini akan di-pass dari docker-compose.yml
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Jalankan proses build
RUN bun run build


# --- STAGE 2: Serve ---
# Tahap ini hanya bertugas untuk menyajikan hasil build dari tahap sebelumnya
# Kita menggunakan image Nginx yang sangat kecil dan efisien
FROM nginx:stable-alpine

# Copy hasil build dari stage 'build' ke direktori default Nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/

# Ekspos port 80 (port default Nginx)
EXPOSE 80

# Perintah default Nginx untuk menjalankan server
CMD ["nginx", "-g", "daemon off;"]