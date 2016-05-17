'use strict';

const blacklist = [
	/^(intent|share|oauth)/,
	/^i\/redirect\?url=/, // redirect URLs
	/\?onepasswdfill=/ // 1Password extension
];

chrome.webRequest.onBeforeRequest.addListener(details => {
	if (details.method !== 'GET') {
		return;
	}

	const url = new URL(details.url);
	const pathAndQuery = url.pathname.slice(1) + url.search;

	if (blacklist.some(x => x.test(pathAndQuery))) {
		return;
	}

	url.hostname = 'mobile.twitter.com';

	return {
		redirectUrl: url.href
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
