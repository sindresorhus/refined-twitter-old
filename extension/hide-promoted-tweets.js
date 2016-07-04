// implementation copied from https://github.com/sindresorhus/anatine/
(() => {
	'use strict';

	window.hidePromotedTweets = elementReady => {
		const seekAndDestroy = () => elementReady('.vjrx_CgX').then(el => {
			el.closest('div[class*="_222QxFjc"][role="row"]').style.display = 'none';
		});

		elementReady('._1nQuzuNK._3tixQkQf > ._3tixQkQf').then(tweetContainer => {
			// hide any immediately seen ads
			seekAndDestroy();

			// watch tweetContainer to hide new ads that get added
			new MutationObserver(() => {
				seekAndDestroy();
			}).observe(tweetContainer, {
				attributes: true,
				childList: true
			});
		});
	};

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = window.hidePromotedTweets;
	}
})();
