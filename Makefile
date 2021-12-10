CURRENT_DIR=$(shell pwd)

CURRENT_DIR=$(shell pwd)
APP_CMD_DIR=${CURRENT_DIR}/cmd
REGISTRY=hub.docker.io
TAG=latest
ENV_TAG=latest
APP=interrail_frontend
PROJECT_NAME=dellicon


clear:
	rm -rf ${CURRENT_DIR}/bin/*

network:
	docker network create --driver=bridge ${NETWORK_NAME}

mark-as-production-image:
	docker tag ${APP}:${TAG} ${APP}:production
	docker push ${APP}:production

build-image:
	docker build --rm -t ${PROJECT_NAME}/${APP}:${TAG} .
	docker tag ${PROJECT_NAME}/${APP}:${TAG} ${PROJECT_NAME}/${APP}:${ENV_TAG}

push-image:
	docker push ${PROJECT_NAME}/${APP}:${TAG}
	docker push ${PROJECT_NAME}/${APP}:${ENV_TAG}

.PHONY: proto
