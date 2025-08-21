FROM node:20

# Diretório de trabalho no container
WORKDIR /usr/src/app

# Copia package.json e yarn.lock antes (aproveita cache do Docker)
COPY package*.json yarn.lock ./

# Instala TODAS as dependências (incluindo dev)
RUN yarn install

# Copia o restante do código
COPY . .

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando padrão (hot reload com nodemon ou similar)
CMD ["yarn", "dev"]
