#!/bin/bash

# Upgrade Python to version 3.10
apt-get update
apt-get install -y python3.10

# Install dependencies listed in requirements.txt
pip install -r requirements.txt
