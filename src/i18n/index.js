import { createI18n as _createI18n } from 'vue-i18n'
import * as enLocale from './locales/en.json' // we want the default locale preloaded

const loaders = {
	'en': () => enLocale,
	'pl': () => import('./locales/pl.json')
}

export function createI18n() {
	return _createI18n({
		locale: 'en',
		fallbackLocale: 'en',
		messages: { en: enLocale },
		legacy: false
	})
}

export async function setLanguage(i18n, locale){
	i18n.global.locale.value = locale

	if(loaders.hasOwnProperty(locale)){
		const messages = await loaders[locale]()
		i18n.global.setLocaleMessage(locale, messages)
	}
}