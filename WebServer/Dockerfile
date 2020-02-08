FROM nginx

WORKDIR /usr/share/nginx/html

COPY . /usr/share/nginx/html

EXPOSE 80
EXPOSE 53134

RUN apt update -y
RUN apt install nodejs -y
RUN echo 'service nginx start' >> ~/.bashrc

CMD ["source ~/.bashrc"]
CMD ["node", "/usr/share/nginx/html/OAuth2/index.js"]