.DEFAULT_GOAL := explain

.PHONY: explain
explain:
	@echo personalWebsite
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: pre-commit
pre-commit: ## Install pre-commit hooks and npm packages
	@pre-commit install

.PHONY: setup
setup: clean ## Setup build dir and copy over assets
	@mkdir -p build/css build/blog
	@cp -r web/assets/js build/
	@cp -r web/assets/images build/

.PHONY: compile
compile: setup ## Compile blog posts into html
	@mkdir -p web/static/css web/static/blog
	@go run cmd/app/main.go

.PHONY: local
local: compile ## Run a local webserver to host website locally
	@docker build -t webserver_personal_website -f infra/docker/Dockerfile .
	@docker run --name personal_website -dit \
  	 -p 8080:80 \
  	 -v ${PWD}/build:/usr/local/apache2/htdocs/:Z \
  	 webserver_personal_website

.PHONY: clean
clean: ## Clean up build artifacts
	@rm -rf build || true
