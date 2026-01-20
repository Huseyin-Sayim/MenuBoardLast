# 1. Aşama: Uygulamayı hafif bir Node imajıyla ayağa kaldıralım
FROM node:20-alpine AS base

# 2. Aşama: Bağımlılıkları yükle
WORKDIR /app
COPY package*.json ./
RUN npm install

# 3. Aşama: Kodları kopyala ve Build al
COPY . .
# Prisma kullanıyorsun, o yüzden şemayı generate etmemiz şart
RUN npx prisma generate
RUN npm run build

# 4. Aşama: Çalıştırma
EXPOSE 3000
CMD ["npm", "start"]