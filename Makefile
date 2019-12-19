DOCKER_IMAGE := udondan/jsii-publish
DOCKER_TAG := 0.5.0
DOCKER_WORKDIR := /workdir

PWD := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

docker-build:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env VERSION=0.3.0 \
		--env BUILD=true \
		--env NPM_TOKEN \
		--env PYPI_TOKEN \
		--env NUGET_TOKEN \
		${DOCKER_IMAGE}:${DOCKER_TAG}

build:
	@npm run build

package: build
	@npm run package
