FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copia todo o código do backend para dentro do container
COPY . .

# Expõe a porta que a API usa
EXPOSE 4000

# Comando para iniciar a API
CMD ["node", "src/index.js"]