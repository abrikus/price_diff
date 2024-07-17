FROM node:20.15.1-alpine3.20

WORKDIR /usr/server

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 1337

CMD npm run dev