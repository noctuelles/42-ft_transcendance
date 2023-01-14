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
