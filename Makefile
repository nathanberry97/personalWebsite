.DEFAULT_GOAL := explain

.PHONY: explain
explain:
	@echo personalWebsite
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: setup
setup: ## Install pre-commit and enable hooks
	@pre-commit install

.PHONY: compile
compile: ## Compile blog posts into html
	@chmod +x scripts/createBlogPosts.sh
	@scripts/createBlogPosts.sh

.PHONY: build
build: ## Build backend for APOD html page
	@cd apod && go build -o bin/apod src/*.go

.PHONY: run
run: build ## Build and run backend for APOD html page
	@cd apod && ./bin/apod

.PHONY: test
test: ## Test backend for APOD html page
	@cd apod && go test src/*.go -v

.PHONY: clean
clean: ## Clean up build artifacts
	@rm -rf apod/bin
