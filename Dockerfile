FROM node:10.16-stretch

COPY /dist /opt/app
COPY /node_modules /opt/app/node_modules
WORKDIR /opt/app

ENV NODE_ENV=production
RUN yarn global add node-wait-for-it

CMD ["node", "main.js"]
