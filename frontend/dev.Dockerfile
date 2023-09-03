FROM node:18-alpine AS base

WORKDIR /app

ENV HOSTNAME "0.0.0.0"
ENV PORT 80

CMD ["sh", "-c", "npm ci && npm run dev"]
