FROM node:14.15.4
WORKDIR /AnotaAI
ARG NODE_ENV
ENV NODE_ENV=production
ARG HOST         
ENV HOST=host.docker.internal
ARG PORT         
ENV PORT=7000
COPY package.json /AnotaAI
RUN npm instal
COPY . /AnotaAI
CMD ["npm", "run", "prod"]