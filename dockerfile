FROM node:9.6.1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install serve
RUN serve -s build
EXPOSE 3000
CMD [ "serve", "-s", "build", "-l", "3000"]