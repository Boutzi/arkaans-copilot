FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ cairo-dev pango-dev libjpeg-turbo-dev giflib-dev librsvg-dev

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma/ ./prisma/
COPY src/ ./src/

RUN npx prisma generate
RUN npm run build

# ---

FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache cairo pango libjpeg-turbo giflib librsvg fontconfig

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/assets ./dist/src/assets
COPY prisma/ ./prisma/

CMD ["node", "dist/src/index.js"]
