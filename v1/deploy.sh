#!/bin/bash
cd ./client;
./build.sh;
cd ..;
scp ./client/index.html root@sam-watkinson.com:/var/www/yodebate/public/index.html;
scp ./client/style.css root@sam-watkinson.com:/var/www/yodebate/public/style.css;
scp ./client/sam.png root@sam-watkinson.com:/var/www/yodebate/public/sam.png;
scp ./client/marc.png root@sam-watkinson.com:/var/www/yodebate/public/marc.png;
scp ./client/dist/bundle.js root@sam-watkinson.com:/var/www/yodebate/public/dist/bundle.js;
scp ./client/dist/vendor.bundle.js root@sam-watkinson.com:/var/www/yodebate/public/dist/vendor.bundle.js;

cd ./server;
./build.sh;
cd ..;
scp ./server/js/main.js root@sam-watkinson.com:/var/www/yodebate/server/js/main.js;
scp ./server/js/main.js.map root@sam-watkinson.com:/var/www/yodebate/server/js/main.js.map;
scp ./server/package.json root@sam-watkinson.com:/var/www/yodebate/server/;
