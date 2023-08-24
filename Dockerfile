FROM node:14

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g nodemon
RUN npm i mongoose
RUN npm install redis
RUN npm i async
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm install --no-optional && npm cache clean --force

RUN export NODE_OPTIONS=--max-old-space-size=3072
RUN export UV_THREADPOOL_SIZE=3072

EXPOSE 3000
CMD [ "npm", "start", "--max_old_space_size=3072"] 