#!make
include ../../.env

.PHONY: run build stop kill clean-all
.DEFAULT_GOAL := run

UNAME := $(shell uname -a)
IS_WIN := $(findstring Microsoft, $(UNAME))
IS_OSX := $(findstring Darwin, $(UNAME))

FILTER := grep inet | grep -E '172'
REPLACE_TEMPLATE := sed _ARG_ 's/^([^0-9\.]*)([0-9\.]+)(.*)/\2/'

# remove addrs: prefix on win-linux
ifdef IS_WIN
	FILTER +=  | sed --regexp-extended 's/addr://'
endif

# osx sed doesn't have long arg --regexp-extended but has -E
ifdef IS_OSX
	REPLACE = $(subst _ARG_, -E, $(REPLACE_TEMPLATE))
else
	REPLACE = $(subst _ARG_, --regexp-extended, $(REPLACE_TEMPLATE))
endif

COMPOSE_FILES := -f docker-compose.yml

run:
	docker-compose -p $(PROJECT_NAME) $(COMPOSE_FILES) up -d

build:
	docker-compose -p $(PROJECT_NAME) $(COMPOSE_FILES) build

stop:
	docker-compose -p $(PROJECT_NAME) $(COMPOSE_FILES) stop

restart:
	docker-compose -p $(PROJECT_NAME) $(COMPOSE_FILES) restart

kill:
	docker-compose -p $(PROJECT_NAME) $(COMPOSE_FILES) kill

clean-all:
	docker-compose -p $(PROJECT_NAME) $(COMPOSE_FILES) down --rmi all --remove-orphans --volumes
