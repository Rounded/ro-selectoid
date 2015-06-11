all: build

deps:
	npm install

tsd:
	tsd update -so

build: deps tsd
	node_modules/.bin/gulp
