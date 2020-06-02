FROM node as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --silent
COPY ./ ./
RUN npm run build

FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
