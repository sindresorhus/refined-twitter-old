'use strict';
/* globals Mousetrap, scrollToTweet */
const $ = document.querySelector.bind(document);

// sets interval to wait for selector to be ready before firing callback
// implementation copied from https://github.com/sindresorhus/anatine/blob/master/browser.js
function waitFor(selector) {
	return new Promise(resolve => {
		const el = $(selector);

		// shortcut if the element already exists
		if (el) {
			resolve(el);
			return;
		}

		// interval to keep checking for it to come into the DOM
		const awaitElement = setInterval(() => {
			const el = $(selector);

			if (el) {
				resolve(el);
				clearInterval(awaitElement);
			}
		}, 50);
	});
}

function registerShortcuts(username) {
	Mousetrap.bind('n', () => {
		if (window.location.pathname.split('/')[1] === 'messages') {
			$('a[href$="/messages/compose"]').click();
		} else {
			$('a[href$="/compose/tweet"]').click();
		}

		return false;
	});

	Mousetrap.bind('g h', () => {
		$('a[href$="/home"]').click();
	});

	Mousetrap.bind('g n', () => {
		$('a[href$="/notifications"]').click();
	});

	Mousetrap.bind('g m', () => {
		$('a[href$="/messages"]').click();
	});

	Mousetrap.bind('/', () => {
		$('a[href$="/search"]').click();

		return false;
	});

	Mousetrap.bind('g p', () => {
		$('a[href$="/account"]').click();
		$(`a[href$="/${username}"]`).click();
	});

	Mousetrap.bind('g l', () => {
		$('a[href$="/account"]').click();
		$(`a[href$="/${username}"]`).click();
		$(`a[href$="/${username}/likes"]`).click();
	});

	Mousetrap.bind('d', () => {
		toggleDarkMode();
	});

	Mousetrap.bindGlobal('esc', () => {
		const btn = $('button._158OzO7l');

		if (btn) {
			btn.click();
		}
	});

	Mousetrap.bindGlobal('command+enter', () => {
		if (window.location.pathname === '/compose/tweet') {
			$('button._1LQ_VFHl._2cmVIBgK').click();
		}

		if (window.location.pathname.split('/')[1] === 'messages') {
			$('button[data-testid="dmComposerSendButton"]').click();
		}
	});

	// vim bindings
	const pageScrollPctHeight = 0.9;
	const fromScrollTop = n => document.body.scrollTop + n;
	const scrollToY = y => window.scrollTo(0, y);

	Mousetrap.bind('j', scrollToTweet);
	Mousetrap.bind('k', scrollToTweet);

	Mousetrap.bind('g g', () => {
		scrollToY(0);
	});

	Mousetrap.bind('ctrl+d', () => {
		scrollToY(fromScrollTop(window.innerHeight * pageScrollPctHeight));
	});

	Mousetrap.bind('ctrl+u', () => {
		scrollToY(fromScrollTop(window.innerHeight * -pageScrollPctHeight));
	});

	Mousetrap.bind('G', () => {
		scrollToY(document.body.scrollHeight);
	});
	// -- //
}

function getMode() {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({method: 'getMode'}, res => {
			// values are being passed back as strings, this converts to accurate boolean
			resolve(res.darkMode === 'true');
		});
	});
}

function setMode(newMode) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({method: 'setMode', darkMode: newMode}, res => {
			// values are being passed back as strings, this converts to accurate boolean
			resolve(res.darkMode === 'true');
		});
	});
}

function toggleDarkMode() {
	getMode().then(current => {
		setMode(!current);
	}).then(applyMode());
}

function applyMode(isDark) {
	document.documentElement.classList.toggle('dark-mode', isDark);
}

function init() {
	const state = JSON.parse($('.___iso-state___').dataset.state).initialState;
	const username = state.settings.data.screen_name;

	registerShortcuts(username);

	// apply dark mode with local storage value
	getMode().then(applyMode);
}

document.addEventListener('DOMContentLoaded', () => {
	// TODO: figure out a better way to detect when React is done
	setTimeout(init, 200);

	// change edit profile URL to point to the desktop URL
	waitFor('.wRxmsUlJ a[href*="/settings/profile"]').then(el => {
		el.href = el.href.replace('mobile.', '');
	});
});
