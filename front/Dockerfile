FROM node:12.10.0-alpine

LABEL maintainer="Igor Guastalla de Lima (limguastallaigor@gmail.com)"

# Add git as the prebuild target requires it to parse version information
RUN apk add --update --no-cache \
  git

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

ENV HOST 0.0.0.0

EXPOSE 3000

CMD ["npm", "run", "start"]
