######################
# Build for Local dev#
######################

FROM node:latest AS dev

# Create app directory and set it as our working directory for subsequent operation
WORKDIR /usr/src/app

# Copy application dependency to the container image.
COPY --chown=node:node package*.json ./

# Install with 'npm ci' (see: https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)
RUN npm ci

# Copy the app source into the image
COPY --chown=node:node . .

FROM node:latest AS build

WORKDIR /usr/src/app

COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

FROM nginx:latest AS production

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
