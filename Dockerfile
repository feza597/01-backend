# Use official Node.js image as base
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .
# Accept build args
ARG MONGO_URI
ARG PORT

# Set them as env inside the container
ENV MONGO_URI=$MONGO_URI
ENV PORT=$PORT

EXPOSE $PORT
# Expose the app port (change if not 3000)


# Start the application
CMD [ "node", "index.js" ]
