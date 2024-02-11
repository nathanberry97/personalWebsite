.DEFAULT_GOAL := explain

.PHONY: explain
explain:
	@echo personalWebsite
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: setup
setup: ## Install pre-commit hooks and npm packages
	@pre-commit install
	@cd ./infra && npm ci

.PHONY: compile
compile: ## Compile blog posts into html
	@chmod +x scripts/createBlogPosts.sh
	@scripts/createBlogPosts.sh

.PHONY: build
build: ## Build backend for APOD html page
	@cd apod && go build -o bin/apod src/*.go
	@cd infra && npm run build

.PHONY: run
run: build ## Build and run backend for APOD html page
	@cd apod && ./bin/apod

.PHONY: test
test: ## Test backend for APOD html page and infra tests
	@cd apod && go test src/*.go -v
	@cd infra && npm test

.PHONY: clean
clean: ## Clean up build artifacts
	@rm -rf apod/bin
	@cd infra && npm run clean

.PHONY: checkov
checkov: ## Run checkov to check for security issues
	@cd infra && npx cdk synth > cloudformation.yaml
	@checkov -f infra/cloudformation.yaml
	@rm -rf infra/cloudformation.yaml
