# pull the base image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

# Resolve conflict with libraries compatibility
RUN npm install --legacy-peer-deps

# Bundle app source
# TODO: should we only copy a whitelist or use docker ignore for blacklist?
COPY . .


RUN npm run build
RUN cd dist
# EXPOSE 8080

CMD ["node","./dist/main.js"]
