FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app files
COPY . .

# Expose NestJS default port
EXPOSE 3000

# Run app in dev mode
CMD [ "npm", "run", "start:dev" ]
