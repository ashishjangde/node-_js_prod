
FROM oven/bun:canary-alpine as builder


WORKDIR /app


COPY package.json bun.lockb ./


RUN bun install --frozen-lockfile


COPY dist ./dist


EXPOSE 3000


USER bun

CMD ["bun", "start"]
