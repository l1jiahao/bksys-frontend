FROM node:20.13.1 as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY ./ .
# RUN yarn run serve

# Stage 2: Production Stage
FROM node:20.13.1 as production-stage

WORKDIR /app

# Copy dependencies and build output from build-stage
COPY --from=build-stage /app /app

# Expose the port your application runs on
EXPOSE 8000

# Start the application
CMD ["yarn", "run", "serve"]
# RUN yarn build

# FROM nginx as production-stage
# RUN mkdir /app
# COPY --from=build-stage /app/dist /app
# COPY nginx.conf /etc/nginx/nginx.conf