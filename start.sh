#!/bin/bash
# sudo chmod a+x start.sh

cd ./main
sudo docker compose up -d
cd ..

cd ./frontend
pm2 --name frontend start npm -- start
cd ..


echo "main started"

