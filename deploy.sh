sudo forever stop server.js
sudo forever -c "npm deploy" -l /var/logs/gswfp.log /var/www/salesforce/salesdream/
