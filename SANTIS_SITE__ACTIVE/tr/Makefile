# SANTIS Project Makefile

.PHONY: all help install start format test clean

all: help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install    Install project dependencies (npm)"
	@echo "  start      Start local development server"
	@echo "  format     Format code using Prettier"
	@echo "  test       Run sample tests"
	@echo "  clean      Remove node_modules"

install:
	npm install

start:
	npm start

format:
	npm run format

test:
	node tests/sample.test.js

clean:
	rm -rf node_modules