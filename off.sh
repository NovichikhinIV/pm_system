#!/bin/bash
# sudo chmod a+x off.sh

cd ./main
sudo docker compose stop
cd ..

cd ./frontend
pm2 delete frontend  
cd ..


echo "main finished"