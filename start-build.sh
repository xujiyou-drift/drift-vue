#!/usr/bin/env bash

cd /opt/drift-vue/
npm run build
nginx -g 'daemon off;'
