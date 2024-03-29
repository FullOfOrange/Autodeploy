centosInstall(){
	echo "Install nginx"
	cp ./nginx.repo /etc/yum.repos.d/

	yum install -y nginx

	firewall-cmd --permanent --zone=public --add-service=http
	firewall-cmd --permanent --zone=public --add-service=https
	firewall-cmd --reload

	cp ./nginx.conf /etc/nginx/

	systemctl start nginx
	systemctl enable nginx

	echo "Install nodejs 10.x"

	curl -sL https://rpm.nodesource.com/setup_10.x | bash -

	yum clean all && sudo yum makecache fast
	yum install -y gcc-c++ make
	yum install -y nodejs

	node -v

	echo "Install Docker"

	yum install -y yum-utils \
	  device-mapper-persistent-data \
  	lvm2

	yum-config-manager \
	  --add-repo \
	  https://download.docker.com/linux/centos/docker-ce.repo

	yum install -y docker-ce docker-ce-cli containerd.io

	systemctl start docker

}

ubuntuInstall(){
	echo "Not available"
}

OS=$(awk -F= '/^NAME/{print $2}' /etc/os-release)
NAME="\"CentOS Linux\""
echo $NAME

if [ "$OS" = "$NAME" ]; then
        echo "CENTOS"
	centosInstall
else
        echo "Ubuntu"
	ubuntuInstall
fi
