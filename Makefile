jsdoc2md = ./node_modules/.bin/jsdoc2md

docs:
	@ mkdir -p docs/api
	@ ${jsdoc2md} lib/api/axiosWrapper.js > docs/api/axiosWrapper.md
	@ ${jsdoc2md} lib/api/sagaApi.js > docs/api/sagaApi.md
	@ ${jsdoc2md} lib/api/index.js > docs/api.md
	@ ${jsdoc2md} lib/sagaHelpers.js > docs/sagaHelpers.md
	@ ${jsdoc2md} lib/reducerHelpers.js > docs/reducerHelpers.md
	@ ${jsdoc2md} lib/api/index.js > docs/api.md
	@ ${jsdoc2md} ./index.js > docs/crudSlice.md
