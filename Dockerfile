FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build && mkdir -p /app/data && chown -R node:node /app
USER node
ENV PORT=3001 NODE_ENV=production DEMO_MODE=true DB_PATH=/app/data/store.sqlite
EXPOSE 3001
CMD ["npm","start"]
