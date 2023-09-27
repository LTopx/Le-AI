FROM node:18-alpine

ARG NAME=Le-AI
ARG NPM=pnpm

WORKDIR /data/$NAME
COPY . /data/$NAME
RUN npm install -g $NPM
RUN $NPM run docker-build

CMD ["npm", "start"]
EXPOSE 3000

