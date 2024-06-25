FROM node:20.13.1 as build-stage

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY ./ .

# 构建应用程序
RUN yarn build

FROM nginx as production-stage

# 设置构建时的环境变量
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf