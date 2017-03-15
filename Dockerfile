FROM node:6

RUN npm install -g grunt-cli

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

ENTRYPOINT ["grunt", "connect:server"]
