
build:
	@component build --dev

rebuild:
	@make clean
	@make components
	@make build

components:
	@component install --dev

all:
	@cake build
	@make rebuild

clean:
	rm -fr build components

.PHONY: clean build
