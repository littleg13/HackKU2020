FROM nginx

EXPOSE 80

RUN apt update -y
RUN apt install nginx-full -y
RUN apt install php php-fpm php-mysql -y

WORKDIR /var/www/html
COPY . /var/www/html
RUN rm /etc/nginx/sites-enabled/default
COPY ./default /etc/nginx/sites-enabled/
# RUN echo 'service nginx start' >> ~/.bashrc

# CMD ["source ~/.bashrc"]
# CMD ["service", "nginx", "start"]
CMD ["service", "php7.3-fpm", "start"]
CMD ["nginx", "-g", "daemon off;"]