FROM node:12.14

ENV LOCAL_DB_HOST=192.168.0.15

WORKDIR /usr/src/app

RUN adduser --disabled-login admin

RUN chown -R admin:admin /usr/src/app
RUN chmod 755 /usr/src/app

COPY . .
RUN npm install

USER admin

CMD [ "npm", "start" ]
