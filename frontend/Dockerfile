FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN sed -i 's|http://localhost:4000/graphql|http://backend:4000/graphql|g' src/environments/environment.prod.ts

RUN npm run build --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/frontend /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]