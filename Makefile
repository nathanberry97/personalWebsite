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
build: ## Build infra for AWS
	@cd infra && npm run build

.PHONY: test
test: ## Test infra for AWS
	@cd infra && npm test

.PHONY: clean
clean: ## Clean up build artifacts
	@cd infra && npm run clean

.PHONY: checkov
checkov: ## Run checkov to check for security issues
	@cd infra && npx cdk synth > cloudformation.yaml
	@checkov -f infra/cloudformation.yaml
	@rm -rf infra/cloudformation.yaml
