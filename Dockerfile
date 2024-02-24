FROM node:slim

WORKDIR /qp-app

COPY . /qp-app

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
