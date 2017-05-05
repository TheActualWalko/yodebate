#!/bin/bash
cd ./client;
./build.sh;
cd ..;
scp ./client/index.html root@sam-watkinson.com:/var/www/yodebate/public/index.html;
scp ./client/manifest.json root@sam-watkinson.com:/var/www/yodebate/public/manifest.json;
scp ./client/style.css root@sam-watkinson.com:/var/www/yodebate/public/style.css;
scp ./client/sam.png root@sam-watkinson.com:/var/www/yodebate/public/sam.png;
scp ./client/marc.png root@sam-watkinson.com:/var/www/yodebate/public/marc.png;
scp ./client/browserconfig.xml root@sam-watkinson.com:/var/www/yodebate/public/browserconfig.xml;
scp ./client/safari-pinned-tab.svg root@sam-watkinson.com:/var/www/yodebate/public/safari-pinned-tab.svg;
scp ./client/favicon.ico root@sam-watkinson.com:/var/www/yodebate/public/favicon.ico;
scp ./client/android-chrome-192x192.png root@sam-watkinson.com:/var/www/yodebate/public/android-chrome-192x192.png;
scp ./client/android-chrome-512x512.png root@sam-watkinson.com:/var/www/yodebate/public/android-chrome-512x512.png;
scp ./client/apple-touch-icon.png root@sam-watkinson.com:/var/www/yodebate/public/apple-touch-icon.png;
scp ./client/favicon-16x16.png root@sam-watkinson.com:/var/www/yodebate/public/favicon-16x16.png;
scp ./client/favicon-32x32.png root@sam-watkinson.com:/var/www/yodebate/public/favicon-32x32.png;
scp ./client/favicon.png root@sam-watkinson.com:/var/www/yodebate/public/favicon.png;
scp ./client/mstile-150x150.png root@sam-watkinson.com:/var/www/yodebate/public/mstile-150x150.png;
scp ./client/dist/bundle.js root@sam-watkinson.com:/var/www/yodebate/public/dist/bundle.js;
scp ./client/dist/vendor.bundle.js root@sam-watkinson.com:/var/www/yodebate/public/dist/vendor.bundle.js;

cd ./server;
./build.sh;
cd ..;
scp ./server/js/main.js root@sam-watkinson.com:/var/www/yodebate/server/js/main.js;
scp ./server/js/main.js.map root@sam-watkinson.com:/var/www/yodebate/server/js/main.js.map;
scp ./server/package.json root@sam-watkinson.com:/var/www/yodebate/server/;
