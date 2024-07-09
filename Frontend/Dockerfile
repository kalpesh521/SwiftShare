FROM node:alpine 

WORKDIR /swiftshare_frontend

COPY ./package.json /swiftshare_frontend

RUN npm install

COPY . /swiftshare_frontend

EXPOSE 3000

CMD ["npm","start"]   