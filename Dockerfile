FROM node:18-alpine

ARG TAG=v0.9.1

WORKDIR /data
RUN apk add --no-cache git
RUN git clone https://github.com/LTopx/Le-AI.git
WORKDIR /data/Le-AI
RUN git fetch --tags && git checkout $TAG
RUN rm -rf .git && npm install -g pnpm && pnpm run docker-build

CMD ["pnpm", "start"]
EXPOSE 3000

