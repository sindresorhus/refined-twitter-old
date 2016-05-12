'use strict';

const blacklist = [
	/twitter.com\/(intent|share|oauth)/,
	/twitter.com\/i\/redirect\?url=/ // redirect URLs
];

chrome.webRequest.onBeforeRequest.addListener(details => {
	if (details.method !== 'GET') {
		return;
	}

	const url = details.url;

	if (blacklist.some(x => x.test(url))) {
		return;
	}

	return {
		redirectUrl: url.replace(/^https:\/\/twitter/, 'https://mobile.twitter')
	};
}, {
	urls: [
		'https://twitter.com/*'
	],
	types: [
		'main_frame'
	]
}, [
	'blocking'
]);
