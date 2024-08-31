# front/Dockerfile
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port your application runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
