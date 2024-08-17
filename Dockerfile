# Usa una imagen oficial de Node.js como base
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos del proyecto al contenedor
COPY package*.json ./
COPY tsconfig.json ./
COPY ./src ./src

# Instala las dependencias
RUN npm install

# Compila TypeScript a JavaScript (si estás usando TypeScript)
RUN npm run build

# Expone el puerto necesario si es necesario (no suele ser necesario para un bot de Discord)
EXPOSE 8080/tcp

# Define el comando de inicio del contenedor
CMD [ "node", "dist/index.js" ]