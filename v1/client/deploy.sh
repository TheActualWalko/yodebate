#!/bin/bash
scp ./index.html root@sam-watkinson.com:/var/www/yodebate/;
scp ./style.css root@sam-watkinson.com:/var/www/yodebate/;
scp ./dist/bundle.js root@sam-watkinson.com:/var/www/yodebate/dist/bundle.js;
scp ./dist/vendor.bundle.js root@sam-watkinson.com:/var/www/yodebate/dist/vendor.bundle.js;