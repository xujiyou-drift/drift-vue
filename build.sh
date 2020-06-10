#!/usr/bin/env bash

docker build -t registry.prod.bbdops.com/common/drift-vue:v0.0.6  ./
docker push registry.prod.bbdops.com/common/drift-vue:v0.0.6
