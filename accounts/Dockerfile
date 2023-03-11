FROM node:18-alpine

RUN mkdir /home/accounts
WORKDIR /home/accounts

CMD rm -rf /node_modules/bcrypt && yarn install --check-files && yarn start
