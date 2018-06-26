const Router = require('koa-router');

const api_gogs = require('./gogs');
const api_phab = require('./phabricator');

const router = new Router();

module.exports = (app) => {
	router.use('/api/webhook/gogs', api_gogs.routes());
	router.use('/api/webhook/phabricator', api_phab.routes());
	app.use(router.routes());
} 