#!/usr/bin/env bash

docker build -t registry.prod.bbdops.com/common/drift-vue:v0.0.7  ./
docker push registry.prod.bbdops.com/common/drift-vue:v0.0.7
