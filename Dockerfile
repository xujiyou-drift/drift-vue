FROM nginx

RUN set -x \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash - \
    && apt-get install -y nodejs

COPY ./ /opt/drift-vue
COPY nginx.conf /etc/nginx/nginx.conf

RUN chmod +x /opt/drift-vue/start-build.sh
RUN /opt/drift-vue/start-build.sh




