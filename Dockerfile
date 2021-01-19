FROM node:14 AS builder

WORKDIR /usr/app_builder

COPY package*.json ./

COPY . .

RUN npm i

RUN npm run build

ENV NODE_ENV=production

CMD [ "npm", "run", "start:prod" ]