.DEFAULT_GOAL := explain

.PHONY: explain
explain:
	@echo personalWebsite
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: setup
setup: ## Install pre-commit hooks and npm packages
	@pre-commit install

.PHONY: compile
compile: ## Compile blog posts into html
	@mkdir -p web/static/css web/static/blog
	@sass --no-source-map web/scss/style.scss web/static/css/style.css
	@go run cmd/app/main.go

.PHONY: local
local: compile ## Run a local webserver to host website locally
	@docker build -t webserver_personal_website -f infra/docker/Dockerfile .
	@docker run --name personal_website -dit \
  	 -p 8080:80 \
  	 -v ${PWD}/web/static:/usr/local/apache2/htdocs/:Z \
  	 webserver_personal_website

.PHONY: clean
clean: ## Clean up build artifacts
	@rm web/static/home
	@rm web/static/feed.xml
	@rm web/static/blog
	@rm web/static/blog/*
	@rm web/static/css/style.css

.PHONY: cleanContainer
cleanContainer: ## Clean up container build artifacts
	@docker stop personal_website
	@docker rm personal_website
