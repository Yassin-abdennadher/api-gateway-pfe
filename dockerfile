FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY . .

# Compile TypeScript
RUN npm run build

EXPOSE 8000

CMD ["node", "dist/index.js"]