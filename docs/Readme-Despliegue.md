# Project Hub Setup

## Initial Setup

### 1. Initialize Docker Swarm

```sh
docker swarm init
docker network create --driver overlay --attachable project_hub_overlay
```

## Database Setup

```sh
docker build -t project_hub_db . -f ./Dockerfile.db
docker run --name project_hub_db --env-file ./.env.db --network project_hub_overlay -p 2500:5432 -d project_hub_db
```

## RabbitMQ Setup

```sh
docker build -t project_hub_broker . -f ./Dockerfile.rabbitmq
docker run --name project_hub_broker --env-file ./.env.rabbitmq --hostname project_hub_broker --network project_hub_overlay -p 2550:5672 -p 2560:15672 -p 61613:61613 -p 15674:15674 -d project_hub_broker -rm


// clustering connection
docker build -t project_hub_broker . -f ./Dockerfile.rabbitmq
docker run --name project_hub_broker_1 --hostname project_hub_broker_1 --env-file ./.env.rabbitmq --network project_hub_overlay -p 2552:5672 -p 2562:15672 -p 61615:61613 -p "15676:15674" -d project_hub_broker

docker exec -it project_hub_broker_1 rabbitmqctl stop_app
docker exec -it project_hub_broker_1 rabbitmqctl reset
docker exec -it project_hub_broker_1 rabbitmqctl join_cluster rabbit@project_hub_broker
docker exec -it project_hub_broker_1 rabbitmqctl start_app
```

En caso de que se encuentre con errores por el usuario por defecto de RabbitMQ, intente:  
1.Reiniciar ambos contenedores del broker a la misma vez  
2.Agregar manualmente el usuario, para esto, entre en el contenedor project_hub_broker, exec, e introduzca los siguientes comandos:

```sh
rabbitmqctl add_user admin admin123
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

## Api Setup

```sh
docker build -t project_hub_api_image -f ./Dockerfile.api.dev .
docker run -d --name project_hub_api --hostname project_hub_api --env-file ./.env.api --network project_hub_overlay -p 8000:8000 -v .:/app -d project_hub_api_image
docker run -d --name project_hub_api_1 --hostname project_hub_api_1 --env-file ./.env.api --network project_hub_overlay -p 8001:8000 -v .:/app -d project_hub_api_image
```

## Frontend

```sh
// Build produccion
docker build -t project_hub_frontend . -f ./Dockerfile.frontend.prod
docker run -d -p 8080:80 --network project_hub_overlay --name project_hub_frontend project_hub_frontend
```

Asegurese que en opciones de desarrollo de su pagina, en la sección network se encuentre activado _ Disable cache _

## Server

```sh
docker build -t server_project_hub . -f ./Dockerfile.nginx.prod
docker run -d -p 8010:8000 -p 8020:8500 --hostname server_project_hub --network project_hub_overlay --name server_project_hub server_project_hub
```

## Develop environment

```sh
docker swarm init
docker network create --driver overlay --attachable project_hub_overlay
docker-compose -f Docker-compose.dev.yml up -d
```
