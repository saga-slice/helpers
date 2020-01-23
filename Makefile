jsdoc2md = ./node_modules/.bin/jsdoc2md

docs:
	@ mkdir -p docs/api
	@ ${jsdoc2md} lib/api/axiosWrapper.js > docs/api/axiosWrapper.md
	@ ${jsdoc2md} lib/api/sagaApi.js > docs/api/sagaApi.md
	@ ${jsdoc2md} lib/api/index.js > docs/api.md
	@ ${jsdoc2md} lib/sagaHelpers.js > docs/sagaHelpers.md
	@ ${jsdoc2md} lib/reducerHelpers.js > docs/reducerHelpers.md
	@ ${jsdoc2md} lib/api/index.js > docs/api.md
	@ ${jsdoc2md} index.js > docs/crudSlice.md

build:
	@ npm run ts
	@ npm run build
	@ mv tmp/lib/*.ts dist
	@ rm -rf tmp

test:
	@ npm run lint
	@ npm run test

deploy:
	@ make docs;
	@ read -p 'Commit Message: ' commitMessage; \
		git add .; \
		git commit -am "$$commitMessage";
	@ npm run test;
	@ npm run release;
	@ npm publish;
	@ git push origin master --no-verify;
