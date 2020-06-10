FROM nginx

COPY dist /opt/drift-vue/dist

COPY nginx.conf /etc/nginx/nginx.conf
