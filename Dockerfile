# FROM node:16.4.1 as builder
# RUN apt update && apt-get install -y yarn

# RUN mkdir app
# WORKDIR app


# COPY package*.json ./
# RUN yarn install  --network-timeout 1000000000

# COPY . ./
# RUN yarn install  --network-timeout 1000000000
# RUN yarn build


# FROM node:16.4.1
# RUN mkdir app
# WORKDIR app

# COPY --from=builder /app/ /app/
# ENV NODE_ENV=production
# ENV HOST=0.0.0.0

# EXPOSE 8081
# ENTRYPOINT ["npm", "start"]

FROM node:16.4.1
RUN apt update && apt-get install -y yarn
RUN mkdir app
WORKDIR app


COPY package*.json ./
RUN yarn install

COPY . ./
RUN yarn run build


ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 8080
ENTRYPOINT ["yarn", "start"]

