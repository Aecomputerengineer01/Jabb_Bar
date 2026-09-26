FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma engine compatibility on alpine
RUN apk add --no-cache openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

EXPOSE 5000

# Start Express server (runs prisma db push and seed on startup if database is fresh)
CMD ["sh", "-c", "npx prisma db push && node prisma/seed.js && node server.js"]
