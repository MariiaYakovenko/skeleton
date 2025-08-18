# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# копируем исходники (сюда попадут и src/migrations)
COPY . .

RUN npm run build

# ---------- runtime ----------
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# prod-зависимости (убедись, что dotenv и pg в dependencies)
COPY package*.json ./
RUN npm ci --omit=dev

# билд и миграции
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/migrations ./migrations

EXPOSE 8080
CMD ["sh", "-c", "node dist/scripts/migrate.js && node dist/main.js"]
