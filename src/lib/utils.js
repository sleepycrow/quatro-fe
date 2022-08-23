/**
 * Contains various utility functions, mostly for processing text.
 */


/**
 * Converts special characters (characters with meaning in HTML) into harmless HTML entities
 * Shamelessly stolen wholesale from https://github.com/teppeis/htmlspecialchars/
 * @param {string} text
 * @returns {string}
 */ 
export function htmlSpecialChars(text){
	if(text == null) return null;

	return String(text).replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll('\'', '&#039;')
}


/**
 * Substitutes custom emoji shortcodes (:shortcode:) in text for the custom emoji themselves as <img> tags
 * @param {string} text
 * @param {Object[]} emoji - An array of mastodon-like "Emoji" objects (https://docs.joinmastodon.org/entities/emoji/)
 * @returns {string}
 */
export function htmlizeCustomEmoji(text, emoji){
	for(var i = 0; i < emoji.length; i++){
		text = text.replaceAll(
			`:${emoji[i].shortcode}:`,
			'<img class="emoji" src="'+emoji[i].url+'" alt=":'+emoji[i].shortcode+':" title=":'+emoji[i].shortcode+':">'
		)
	}

	return text
}


/**
 * Given a Mastodon API-style account object, returns a URL to their profile in Quatro-FE
 * @param {Object} account - A Mastodon API-style "account" object
 * @returns {string} A path to their profile
 */
export function getProfileUrl(account){
	return (account.acct.includes('@') ? `/users/${account.id}` : `/@${account.acct}`)
}


/**
 * Given a Mastodon API-style account object, returns whether the account has a display name
 * Necessary because when no display name is set, some servers put an empty string in it's
 * place, while some put the handle.
 * @param {Object} account 
 * @returns {boolean}
 */
export function hasDisplayName(account){
	return (account.display_name !== '' && account.display_name !== account.acct)
}


/**
 * Given a Mastodon API-style account object, returns an HTML string of the user's display name
 * @param {Object} account 
 * @returns {string} An HTML string with the user's display name
 */
export function getAccountDisplayName(account){
	// If no display name is set, use the account's @ as their display name
	if(hasDisplayName(account))
		return htmlizeCustomEmoji(htmlSpecialChars(account.display_name), account.emojis)
	else
		return `@${account.acct}`
}


/**
 * Given a set of values, returns a string containing all the valid classnames given to it, separated by a space.
 * @param  {...any} maybeClasses - Either a classname string or null
 * @returns A string with all the valid classnames
 */
export function classString(...maybeClasses){
	return maybeClasses.filter((val) => (typeof val === 'string' && val.length > 0)).join(' ')
}