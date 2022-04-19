FROM nginx

#configuration
copy ./nginx-conf/nginx.conf /etc/nginx/nginx.conf

#content, comment out the ones you dont need!
#copy ./*.html /usr/share/nginx/html/
#copy ./*.css /usr/share/nginx/html/
#copy ./*.png /usr/share/nginx/html/
#copy ./*.js /usr/share/nginx/html/

# npm Modul depencencies. 
cmd apt update ;apt install -y npm; cd /var/typescript/; npm i; npm run watch
CMD ["nginx", "-g", "daemon off;"]