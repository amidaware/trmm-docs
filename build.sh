#!/usr/bin/env bash

set -o errexit
set -o pipefail

docker build --pull --no-cache -t trmm-docs .
docker run -d -it --name "trmm-docs" -p 8005:8005 -v"$(pwd)":/trmm-docs --rm trmm-docs