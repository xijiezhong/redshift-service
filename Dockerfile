FROM node:8-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY . /app

RUN npm install

CMD ["node", "index"]