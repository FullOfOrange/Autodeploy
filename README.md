# Autodeploy
git hook을 이용한 각종 클라우드 자동 배포 스크립트를 제작하는 것이 목표입니다.

## 작동 방식

#### nginx config

```nginx
events { }
http {
        server {
                listen 80;

                location / {
                        proxy_pass http://$server_addr:3000;
                }
                location /deployment {
                        proxy_pass http://$server_addr:20000/;
                }
        }
}
```

- '/'  3000번 포트로 열려있는 프로젝트로 이동시킨다. 실질적인 APP 서버 역할
- '/deployment' 는 20000 포트를 이용하며, github에서 보내는 Webhooks를 받아오는 역할,  APP 서버에서는 deployment 라우터를 사용할 수 없다. 필요하다면 이 라우터를 변경하면 된다.

 nginx.conf 파일이며 추가적인 location 설정을 하면 된다.

#### nodejs Deployment server



