FROM node:6-alpine

RUN apk add --no-cache \
		git \
	&& npm install -g grunt-cli bower http-server

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app

ENTRYPOINT ["http-server"]
