FROM node:23-slim AS build
RUN apt-get update && apt-get install -y git
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN corepack enable
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm exec svelte-kit sync
RUN pnpm run build

FROM node:23-slim
COPY --from=build /app/build /app
COPY --from=build /app/node_modules /app/node_modules
COPY ./static /app/static
COPY ./drizzle /app/drizzle
WORKDIR /app
EXPOSE 3000
CMD [ "node", "." ]
