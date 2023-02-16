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

# Generate prisma client code
RUN npm run prisma:generate

CMD [ "npm", "run", "start:dev" ]

FROM node:latest AS production

# Create app directory and set it as our working directory for subsequent operation
WORKDIR /usr/src/app

# Copy application dependency to the container image.
COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=dev /usr/src/app/node_modules ./node_modules

# Copy the app source into the image
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory.
# Passing in --only=production ensures that only the production dependencies are installed.
# This ensures that the node_modules directory is as optimized as possible.
RUN npm ci --only=production && npm cache clean --force

# Start the server using the production build
CMD [ "npm", "run", "start:prod" ]
