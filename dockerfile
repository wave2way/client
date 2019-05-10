# build environment
FROM node:9.6.1 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install --silent
COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:1.15.0-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
RUN mkdir /etc/nginx/logs/
RUN touch /etc/nginx/logs/error.log
RUN touch /etc/nginx/logs/access.log

EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]