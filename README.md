# try-repo-memleak

## install

- install pm2 ```npm install pm2 -g```
- npm install ```npm install```
- configure enviremont variables 
    - edit file default.env and fill in the values and rename it to .env
- install ab (from apache)
    - on [window](http://stackoverflow.com/questions/7327099/how-to-install-apache-bench-on-windows-7)
    - on [linux ubuntu](http://www.sotechdesign.com.au/how-to-install-just-ab-apachebench-on-debian-or-ubuntu/)

webserver runs on port 8001

## diagnosing memleak

- run pm2 monit
- run pm2 server.js
- run bash ./tests/stress_test.sh inside the pref folder