#!/bin/bash

/opt/render/project/src/.venv/bin/python3.7 -m pip install --upgrade pip

# Upgrade Python to version 3.10
apt-get update
apt-get install -y python3.10

# Install dependencies listed in requirements.txt
pip install -r requirements.txt
