FROM node:alpine3.14

WORKDIR /usr/src/app

COPY src/package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD [ "node", "src/index.js" ]