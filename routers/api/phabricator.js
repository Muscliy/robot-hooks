const https = require('https');
const Router = require('koa-router');
const router = new Router();
const url = require('url')

const frontGroup = [
	"huli",
	"lzd",
	"zhujian",
	"zhoupeng",
	"fhc",
	"mq",
	"eskimous"
];

const serverGroup = [
	"jp",
	"baihe",
	"wuyilong",
	"liuzhebin",
	"qianiqnbo",
	"qianqinbo",
	"huangganzhou",
	"pangweichao",
	"caoyuandong",
]

function parsePhabMessageToMarkdown(msg) {
	const storyText = msg.storyText;
	const tips = storyText.split(':')[0];
	const message = storyText.split(':')[1];
	const user = tips.split(' ')[0];
	const id = tips.split(' ').pop();
	const markdownMsg = {
		msgtype: 'markdown'
	};
	if (storyText.indexOf('accepted') > 1) {
		markdownMsg.markdown = {
			title: tips,
			text: `${tips} please push as soon\n` + 
						`> [${id}](http://10.0.0.8:8080/${id}) : ${message} \n\n` +
						`![screenshot](https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3532635820,2403249062&fm=26&gp=0.jpg)`
		};
	} else if (storyText.indexOf('created')  > 1) {
		markdownMsg.markdown = {
			title: tips,
			text: `${tips} please review as soon\n` + 
						`> [${id}](http://10.0.0.8:8080/${id}) : ${message} \n\n` + 
						`![screenshot](http://pic1.win4000.com/wallpaper/5/4fcec0606aaeb.jpg)`
		};
		markdownMsg.at = {
			isAtAll: true
		}
	} else if (storyText.indexOf('requested changes')  > 1) {
		markdownMsg.markdown = {
			title: tips,
			text: `${tips} please modify as soon\n` + 
						`> [${id}](http://10.0.0.8:8080/${id}) : ${message} \n\n` + 
						`![screenshot](https://ws1.sinaimg.cn/large/006tNc79gy1fij0rfs116j30da0bvaav.jpg)`
		};
	} else if (storyText.indexOf('updated the diff')  > 1) {
		markdownMsg.markdown = {
			title: tips,
			text: `${tips} please review again as soon\n` + 
						`> [${id}](http://10.0.0.8:8080/${id}) : ${message} \n\n` + 
						`![screenshot](https://wx4.sinaimg.cn/mw690/005LNhfely1fm6257rn1uj30qn0yc461.jpg)`
		};
	} else if (storyText.indexOf('added inline comments')  > 1) {
		markdownMsg.markdown = {
			title: tips,
			text: `${tips} \n` + 
						`> [${id}](http://10.0.0.8:8080/${id}) : ${message} \n\n` + 
						`![screenshot](https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1503302981&di=ccb8f9b01b71bcfc5b40d24d683e8771&imgtype=jpg&er=1&src=http%3A%2F%2Fphotocdn.sohu.com%2F20160302%2Fmp61455613_1456908888653_10.jpeg)`
		};
	} else {
		markdownMsg.markdown = {
			title: '普通消息',
			text: storyText
		};
	}
	return markdownMsg;
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

router.post('/', async (ctx) => {
	console.log(ctx.request.body);
	var markdownMsg = parsePhabMessageToMarkdown(ctx.request.body)
	const msg = ctx.request.body;
	const storyText = msg.storyText;
	const user = storyText.split(' ')[0].toLowerCase();
	let options = null;
	if (frontGroup.indexOf(user) >= 0) {
		options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=69e648b07f4fd2373f6d0052dc36481ef401792c956ac1c061ba7128ffbb0ae3');
	} else if (serverGroup.indexOf(user) >= 0) {
		options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=2ed011be15f583cf2b2cbf89979951d748b50cca9d0b7d06cd369f77ca401da8');
	} else {
		options =  url.parse('https://oapi.dingtalk.com/robot/send?access_token=69e648b07f4fd2373f6d0052dc36481ef401792c956ac1c061ba7128ffbb0ae3');
	}
	
	doRequest(options, ctx, markdownMsg);
});




module.exports = router;

// { storyID: '316',
//   storyType: 'PhabricatorApplicationTransactionFeedStory',
//   storyData:
//    { objectPHID: 'PHID-DREV-nwelnua7uyzmqj765p7k',
//      transactionPHIDs:
//       { 'PHID-XACT-DREV-gckxvk5bfxtavsf': 'PHID-XACT-DREV-gckxvk5bfxtavsf',
//         'PHID-XACT-DREV-wi5wx4gkjaskj2f': 'PHID-XACT-DREV-wi5wx4gkjaskj2f' } },
//   storyAuthorPHID: 'PHID-USER-i56qunzi2avzqnpnrxs7',
//   storyText: 'huli requested changes to D80: Fix baidu map http to https.',
//   epoch: '1502532222' }
//   
//   
// { storyID: '314',
//   storyType: 'PhabricatorApplicationTransactionFeedStory',
//   storyData:
//    { objectPHID: 'PHID-DREV-z7xm5f3ff3pvp4ars23t',
//      transactionPHIDs:
//       { 'PHID-XACT-DREV-xf3j6sjce4yobie': 'PHID-XACT-DREV-xf3j6sjce4yobie',
//         'PHID-XACT-DREV-6yxkhm5eh7pycad': 'PHID-XACT-DREV-6yxkhm5eh7pycad' } },
//   storyAuthorPHID: 'PHID-USER-i56qunzi2avzqnpnrxs7',
//   storyText: 'huli accepted D85: Remove payType permission limit.',
//   epoch: '1502531664' }
//   
// { storyID: '317',
//   storyType: 'PhabricatorApplicationTransactionFeedStory',
//   storyData:
//    { objectPHID: 'PHID-DREV-dgwfdbhkw6oiju7wnea7',
//      transactionPHIDs: { 'PHID-XACT-DREV-oa5kww7pqkhggpq': 'PHID-XACT-DREV-oa5kww7pqkhggpq' } },
//   storyAuthorPHID: 'PHID-USER-i56qunzi2avzqnpnrxs7',
//   storyText: 'huli created D121: Add readme file.',
//   epoch: '1502532629' }
//   
