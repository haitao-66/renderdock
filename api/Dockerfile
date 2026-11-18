FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm install && npx playwright install --with-deps chromium

COPY src ./src
COPY themes ./themes

ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright

EXPOSE 8787

CMD ["node", "src/server.js"]
