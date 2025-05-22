# 1st - install pnpm
FROM node:20.18 AS base

RUN npm install -g pnpm

# 2nd - copy package.json, pnpm-lock.yaml & install dependencies
FROM base AS dependencies

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

# 3rd - use dependencies to build app
FROM base AS build

WORKDIR /usr/src/app

COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

RUN pnpm run build
RUN pnpm prune --prod

# 4th - Exec app
FROM node:20-alpine3.21 AS deploy

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /usr/src/app/entrypoint.sh ./entrypoint.sh

RUN chmod +x ./entrypoint.sh

EXPOSE 3333

ENTRYPOINT [ "./entrypoint.sh" ]

# CMD [ "npm", "run", "start" ]