IMAGE_NAME := cdk-secrets-builder
PWD := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

docker-build:
	@docker build . -t ${IMAGE_NAME}
	@docker run -it --volume ${PWD}:/workdir/app ${IMAGE_NAME}

build:
	@npm run build

package: build
	@npm run package
