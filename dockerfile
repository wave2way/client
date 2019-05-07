FROM node:node:9.6.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

RUN npm install create-react-app
# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start"]