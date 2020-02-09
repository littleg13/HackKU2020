FROM node:13.2.0

WORKDIR /home/

COPY index.js package.json /home/
RUN npm install

EXPOSE 80

CMD ["node", "/home/index.js"]