// sets interval to wait for selector to be ready before firing callback
// implementation copied from https://github.com/sindresorhus/anatine/blob/master/browser.js

(() => {
	window.waitFor = selector => {
		const $ = document.querySelector.bind(document);

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
	};
})();
