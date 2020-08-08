FROM node:14.7.0-alpine3.12
COPY "package.json" "/usr/app/package.json"
COPY "package-lock.json" "/usr/app/package-lock.json"
WORKDIR "/usr/app"
RUN "npm" "i"
COPY "server.js" "/usr/app/server.js"
EXPOSE 8070
CMD [ "npm", "start" ]