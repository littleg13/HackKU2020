FROM nginx

WORKDIR /usr/share/nginx/html

COPY . /usr/share/nginx/html
RUN rm /usr/nginx/conf.d/default.conf
COPY default.conf /usr/nginx/conf.d/

EXPOSE 80

RUN apt update -y
RUN apt install php-fpm php-mysql
RUN echo 'service nginx start' >> ~/.bashrc

CMD ["source ~/.bashrc"]