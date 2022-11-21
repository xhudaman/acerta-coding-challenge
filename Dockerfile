FROM node:lts-alpine as base

RUN npm i -g pnpm

FROM base as build

ENV REACT_APP_API_URL=http://localhost:3001

WORKDIR /src

COPY ./web .

RUN pnpm install --frozen-lockfile

RUN pnpm build

FROM base as web

RUN npm add -g serve

COPY --from=build /src/build ./build

EXPOSE 3000

USER node

CMD ["serve", "-s", "build"]

FROM base as api

WORKDIR /src

COPY ./web/db.json ./web/package.json ./web/pnpm-lock.yaml ./

EXPOSE 3001

RUN pnpm install --frozen-lockfile

USER node

CMD ["pnpm", "start:server"]