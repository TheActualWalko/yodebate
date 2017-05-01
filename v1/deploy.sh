#!/bin/bash
cd ./client;
./build.sh;
cd ..;
scp ./client/index.html root@sam-watkinson.com:/var/www/yodebate/index.html;
scp ./client/style.css root@sam-watkinson.com:/var/www/yodebate/style.css;
scp ./client/sam.png root@sam-watkinson.com:/var/www/yodebate/sam.png;
scp ./client/marc.png root@sam-watkinson.com:/var/www/yodebate/marc.png;
scp ./client/dist/bundle.js root@sam-watkinson.com:/var/www/yodebate/dist/bundle.js;
scp ./client/dist/vendor.bundle.js root@sam-watkinson.com:/var/www/yodebate/dist/vendor.bundle.js;

scp ./server/js/main.js root@sam-watkinson.com:/var/www/yodebate-server/js/main.js;
scp ./server/js/main.js.map root@sam-watkinson.com:/var/www/yodebate-server/js/main.js.map;
scp ./server/package.json root@sam-watkinson.com:/var/www/yodebate-server/;
