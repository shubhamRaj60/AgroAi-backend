# Use official Node image with Debian (to support apt)
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy Node.js dependency files first
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install Python and pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip build-essential && \
    pip3 install --upgrade pip

# Copy Python requirements and install them
COPY requirements.txt .
RUN pip3 install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port (Render uses PORT internally)
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]

