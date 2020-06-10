#!/usr/bin/env bash

docker build -t registry.prod.bbdops.com/common/drift-vue:v0.0.4  ./
docker push registry.prod.bbdops.com/common/drift-vue:v0.0.4
