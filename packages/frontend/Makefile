.PHONY: openapi
openapi:
	npx openapi-typescript-codegen --input ../scheme/openapi.yaml --output ./src/api/generated --client axios

.PHONY: install
install:
	npm install

.PHONY: dev
dev:
	npm run dev

.PHONY: build
build:
	npm run build

.PHONY: down
down:
	docker-compose down 