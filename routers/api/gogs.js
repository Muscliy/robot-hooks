const https = require('https');
const Router = require('koa-router');
const router = new Router();
const url = require('url');

function parseGogsMessageToMarkdown(msg) {
	const commits = msg.commits;
	const pusherName = msg.pusher.full_name || msg.pusher.username;
	const repositoryName = msg.repository.name;
	const branch = msg.ref.split('/').pop();

	const title = `${pusherName} pushed to branch <mark>${branch}</mark> at repository **${repositoryName}**\n`;

	let text = title;

	commits.map((commit) => {
		const commitId = commit.id.substring(0, 6);
		const commitUrl = commit.url;
		const commitMessage = commits.length > 1 ? commit.message.toString("utf8").split('\n')[0] : commit.message.toString("utf8");
		const commitString = `> [${commitId}](${commitUrl}) : ${commitMessage}\n`;
		text += commitString;
	});

	if (text.indexOf('Reviewed By:') < 0) {
		text += `![screenshot](https://ws2.sinaimg.cn/large/006tNc79gy1fov00t4fl4j30m40gw0v4.jpg)`;
	} else {
		text += `![screenshot](https://ws4.sinaimg.cn/large/006tKfTcgy1fp4fc64mihj30et08ct98.jpg)`;
	}

	const markdownMessage = {
		msgtype: 'markdown',
		markdown: {
			title: title,
			text: text
		}
	}
	return markdownMessage;
}

function doRequest(options, ctx, markdownMsg) {
	options.method = 'POST';
	options.headers = {
		'Content-Type': 'application/json; charset=utf-8',
	}
	const req = https.request(options, (res) => {
		console.log(`STATUS: ${res.statusCode}`);
	  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  res.setEncoding('utf8');
	  res.on('data', (chunk) => {
	    console.log(`BODY: ${chunk}`);
	  });
	  res.on('end', () => {
	    console.log('No more data in response.');
	  });
	});

	req.on('error', (e) => {
	  console.error(`problem with request: ${e.message}`);
	});
	const postData = JSON.stringify(markdownMsg);
	console.log('post:', postData);
	req.write(postData);
	req.end();
	ctx.body = {
	  	success: 'ok',
	};
}

router.post('/web', async (ctx) => {
	var markdownMsg = parseGogsMessageToMarkdown(ctx.request.body)
	const options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=d1c3dfc442677a1e684d0e55f853cedd170a32e3145c65a1f4712445c496e1cb');
	doRequest(options, ctx, markdownMsg);
});

router.post('/ios', async (ctx) => {
	var markdownMsg = parseGogsMessageToMarkdown(ctx.request.body)
	const options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=df0e69e9a4c64be403f703291bd433b159f8d4a028013c54dcb92f217eef0249');
	doRequest(options, ctx, markdownMsg);
});

router.post('/android', async (ctx) => {
	var markdownMsg = parseGogsMessageToMarkdown(ctx.request.body)
	const options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=c786189985204a3b89b2368897338de558e226785bd2b8428a6c24922a4ded76');
	doRequest(options, ctx, markdownMsg);
});

router.post('/server', async (ctx) => {
	var markdownMsg = parseGogsMessageToMarkdown(ctx.request.body)
	const options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=3932e776312e75cec4a175a157099d89faa4807c70d71925f289c319a04fea09');
	doRequest(options, ctx, markdownMsg);
});


router.post('/data', async (ctx) => {
	var markdownMsg = parseGogsMessageToMarkdown(ctx.request.body)
	const options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=708c023446c34ebc1e3b7f73fb682a940a241f1a4fcf0e10b4ecd65b3ffe1226');
	doRequest(options, ctx, markdownMsg);
});


router.post('/test', async (ctx) => {
	console.log(ctx.request.body);
	var markdownMsg = parseGogsMessageToMarkdown(ctx.request.body)
	const options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=f3627ff53c03d2e98db512b7514b080e45792716ae3c4cfed0064e400ba9f53a');
	doRequest(options, ctx, markdownMsg);
});


module.exports = router;
