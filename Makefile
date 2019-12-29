SHELL := /bin/bash
VERSION := $(shell cat VERSION)

DOCKER_IMAGE := udondan/jsii-publish
DOCKER_TAG := 0.5.0
DOCKER_WORKDIR := /workdir

PWD := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

build:
	npm run build

docker-build:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env VERSION=0.3.0 \
		--env BUILD=true \
		${DOCKER_IMAGE}:${DOCKER_TAG}

npm:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env NPM_TOKEN \
		${DOCKER_IMAGE}:${DOCKER_TAG}

pypi:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env PYPI_TOKEN \
		${DOCKER_IMAGE}:${DOCKER_TAG}

nuget:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env NUGET_TOKEN \
		${DOCKER_IMAGE}:${DOCKER_TAG}

maven:
	docker run -it \
		--workdir ${DOCKER_WORKDIR} \
		--volume ${PWD}:${DOCKER_WORKDIR} \
		--env GPG_PRIVATE_KEY \
		--env SONATYPE_NEXUS_USERNAME=udondan \
		--env SONATYPE_STAGING_PROFILE=com.udondan \
		--env SONATYPE_NEXUS_PASSWORD \
		${DOCKER_IMAGE}:${DOCKER_TAG}


tag:
	@git tag -a "v$(VERSION)" -m 'Creates tag "v$(VERSION)"'
	@git push --tags

release: tag
