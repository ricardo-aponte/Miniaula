FROM node:20-alpine

WORKDIR /app

# Instalamos dependencias primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código de la API
COPY . .

EXPOSE 3000

# Corre las migraciones automáticamente al arrancar el contenedor y luego inicia la API
CMD ["sh", "-c", "npm run db:migrate && npm start"]