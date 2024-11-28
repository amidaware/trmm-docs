#!/bin/bash


GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

PYTHON_VER="3.10.2"

print_green 'Installing Python 3.10.2'

sudo apt install -y build-essential zlib1g-dev libncurses5-dev libgdbm-dev libnss3-dev libssl-dev libreadline-dev libffi-dev libsqlite3-dev libbz2-dev
numprocs=$(nproc)
cd ~
wget https://www.python.org/ftp/python/${PYTHON_VER}/Python-${PYTHON_VER}.tgz
tar -xf Python-${PYTHON_VER}.tgz
cd Python-${PYTHON_VER}
./configure --enable-optimizations
make -j $numprocs
sudo make altinstall
cd ~
sudo rm -rf Python-${PYTHON_VER} Python-${PYTHON_VER}.tgz
