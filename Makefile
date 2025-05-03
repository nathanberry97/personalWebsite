.DEFAULT_GOAL := explain

.PHONY: explain
explain:
	@echo personalWebsite
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage: \033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

.PHONY: pre-commit
pre-commit: ## Install pre-commit hooks
	@pre-commit install

.PHONY: test
test: ## Unit test go code
	@go test -v -parallel 4 ./internal/...

.PHONY: setup
setup: clean ## Setup build dir and copy over assets
	@mkdir -p build/css build/blog
	@cp -r web/assets/js build/
	@cp -r web/assets/images build/

.PHONY: compile
compile: setup ## Compile blog posts into HTML
	@go run cmd/app/main.go

.PHONY: local
local: compile ## Run a local web server to host website locally
	@podman build -t webserver_personal_website -f infra/container/Containerfile
	@podman run --name personal_website -dit \
  	 -p 8080:80 \
  	 -v ${PWD}/build:/usr/local/apache2/htdocs/:Z \
	 --replace \
  	 webserver_personal_website \

.PHONY: clean
clean: ## Clean up build artifacts
	@rm -rf build/* || true

.PHONY: installCDK
installCDK: ## Install AWS CDK dependencies
	@cd ./infra/cdk && npm ci

.PHONY: buildCDK
buildCDK: ## Build AWS infrastructure
	@cd infra/cdk && npm run build

.PHONY: testCDK
testCDK: buildCDK ## Test AWS infrastructure
	@cd infra/cdk && npm test

.PHONY: diffCDK
diffCDK: ## Differences of deployed and the local infrastructure
	@cd infra/cdk && npm run cdk diff

.PHONY: deployCDK
deployCDK: ## Deploy AWS infrastructure
	@cd ./infra/cdk && npx cdk deploy --all --require-approval never

.PHONY: cleanCDK
cleanCDK: ## Clean AWS infrastructure
	@cd infra/cdk && npm run clean
	@cd infra/cdk && rm -rf cdk.out/

.PHONY: checkovCDK
checkovCDK: ## Run Checkov for security analysis of IaC
	@cd infra/cdk && npm run cdk synth
	@checkov -f infra/cdk/cdk.out/PersonalWebsiteCertStack.assets.json
	@checkov -f infra/cdk/cdk.out/PersonalWebsiteInfraStack.template.json
