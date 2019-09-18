echo "Install nginx"
sudo cp ./nginx.repo /etc/yum.repos.d/

sudo yum install -y nginx

sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

sudo  cp ./nginx.conf /etc/nginx/

systemctl start nginx
systemctl enable nginx

echo "Install nodejs 10.x"

curl -sL https://rpm.nodesource.com/setup_10.x | bash -

sudo yum clean all && sudo yum makecache fast
sudo yum install -y gcc-c++ make
sudo yum install -y nodejs

node -v

echo "Install Docker"

sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

sudo yum install docker-ce docker-ce-cli containerd.io

sudo systemctl start docker
