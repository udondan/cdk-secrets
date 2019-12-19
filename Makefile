DOCKER_IMAGE := udondan/jsii-publish
DOCKER_TAG := 0.2.0
DOCKER_WORKDIR := /workdir/app

PWD := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

docker-build:
	@docker run -it --workdir ${DOCKER_WORKDIR} --volume ${PWD}:${DOCKER_WORKDIR} ${DOCKER_IMAGE}:${DOCKER_TAG}

build:
	@npm run build

package: build
	@npm run package
