'use strict';

const blacklist = [
	/twitter.com\/(intent|share)/, // intent URLs
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

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	// xo wants this to be `const`, but that breaks in Firefox.
	// See https://bugzilla.mozilla.org/show_bug.cgi?id=1269863
	for (let header of details.requestHeaders) {
		if (header.name === 'User-Agent') {
			if (header.value.includes('Firefox') || header.value.includes('Edge')) {
				header.value = 'Chrome/50';
			}
		}
	}

	return {
		requestHeaders: details.requestHeaders
	};
}, {
	urls: [
		'https://mobile.twitter.com/*'
	],
	types: [
		'main_frame'
	]
}, [
	'blocking',
	'requestHeaders'
]);
