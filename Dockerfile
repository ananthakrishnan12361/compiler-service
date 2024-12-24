
FROM node:16-alpine

# Install required compilers and interpreters
RUN apk add --no-cache \
    gcc \
    g++ \
    openjdk11 \
    python3 \
    ruby \
    bash

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chmod +x ./src/scripts/*.sh

EXPOSE 3000

CMD ["npm", "start"]
