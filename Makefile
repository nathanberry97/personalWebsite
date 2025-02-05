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
	@mkdir -p static/css static/blog
	@sass --no-source-map scss/index.scss static/css/style.css
	@chmod +x scripts/parseBlogPosts.sh
	@scripts/parseBlogPosts.sh
	@go run scripts/parseBlogFeed.go

.PHONY: local
local: compile ## Run a local webserver to host website locally
	@podman build -t webserver_personal_website .
	@podman run --name personal_website -dit \
  	 -p 8080:80 \
  	 -v ${PWD}/static:/usr/local/apache2/htdocs/:Z \
  	 webserver_personal_website

.PHONY: build
build: ## Build infra for AWS
	@cd infra && npm run build

.PHONY: test
test: ## Test infra for AWS
	@cd infra && npm test

.PHONY: clean
clean: ## Clean up build artifacts
	@rm static/index.html
	@rm static/index.xml
	@rm static/blog.html
	@rm static/blog/*
	@cd infra && npm run clean
	@rm static/css/style.css

.PHONY: cleanContainer
cleanContainer: ## Clean up container build artifacts
	@podman stop personal_website
	@podman rm personal_website
	@podman system prune -a -f

.PHONY: checkov
checkov: ## Run checkov to check for security issues
	@cd infra && npx cdk synth > cloudformation.yaml
	@checkov -f infra/cloudformation.yaml
	@rm -rf infra/cloudformation.yaml
