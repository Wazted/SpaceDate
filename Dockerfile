FROM node:lts as dependencies
WORKDIR /spacedate
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:lts as builder
WORKDIR /spacedate
COPY . .
COPY --from=dependencies /spacedate/node_modules ./node_modules
RUN yarn build

FROM node:lts as runner
WORKDIR /spacedate
ENV NODE_ENV production

COPY --from=builder /spacedate/next.config.js ./
COPY --from=builder /spacedate/public ./public
COPY --from=builder /spacedate/.next ./.next
COPY --from=builder /spacedate/node_modules ./node_modules
COPY --from=builder /spacedate/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]