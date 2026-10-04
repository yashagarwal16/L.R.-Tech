FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_CONTACT_EMAIL
ARG VITE_CONTACT_PHONE
ARG VITE_VAPI_INBOUND_NUMBER
ARG VITE_WHATSAPP_NUMBER
ARG VITE_TOP_BANNER_TEXT
ARG VITE_OFFER_ENABLED
ARG VITE_OFFER_TITLE
ARG VITE_OFFER_DESCRIPTION
ARG VITE_OFFER_CODE
ARG VITE_LEAD_FORM_ENDPOINT
ARG VITE_CHATBOT_API_ENDPOINT
ARG VITE_FEEDBACK_API_ENDPOINT
RUN npm run build

FROM node:22-alpine AS production

ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --chown=node:node . .

USER node
EXPOSE 8080

CMD ["npm", "start"]
