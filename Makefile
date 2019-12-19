DOCKER_IMAGE := udondan/jsii-publish
DOCKER_TAG := 0.3.0
DOCKER_WORKDIR := /workdir

PWD := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

docker-build:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env VERSION=0.2.0 \
		--env NPM_PUBLISH=true \
		--env NPM_TOKEN \
		${DOCKER_IMAGE}:${DOCKER_TAG}

build:
	@npm run build

package: build
	@npm run package
