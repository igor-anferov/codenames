FROM node:18 AS build
WORKDIR /usr/src

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build && npm run compress

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=build /usr/src/build ./
COPY nginx.conf /etc/nginx/nginx.conf
