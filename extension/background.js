'use strict';

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	if (details.method !== 'GET') {
		return;
	}

	return {
		redirectUrl: details.url.replace(/^https:\/\/twitter/, 'https://mobile.twitter')
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
