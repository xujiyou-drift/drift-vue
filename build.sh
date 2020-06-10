#!/usr/bin/env bash

npm run build

docker build -t registry.prod.bbdops.com/common/drift-vue:v0.0.2  ./
docker push registry.prod.bbdops.com/common/drift-vue:v0.0.2
