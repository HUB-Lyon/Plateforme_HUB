FROM node:20

WORKDIR /app/frontend

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]