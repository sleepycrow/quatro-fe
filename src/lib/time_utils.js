const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY



export function getDateText(date){
	date = (typeof(date) === 'string') ? new Date(date) : date

	var fmt = (elem) => elem.toString().padStart(2, '0')

	var day = fmt(date.getDate())
	var month = fmt(date.getMonth() + 1)
	var hours = fmt(date.getHours())
	var minutes = fmt(date.getMinutes())

	return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`
}


export function getFuzzyDate(date){
	date = (typeof(date) === 'string') ? new Date(date) : date
	let diff = Math.abs( Date.now() - date )
	let message = null
	let amount = null

	if(diff < MINUTE){
		message = 'fuzzy_dates.just_now'
	}else if(diff < HOUR){
		message = 'fuzzy_dates.minutes_ago'
		amount = Math.floor(diff / MINUTE)
	}else if(diff < DAY){
		message = 'fuzzy_dates.hours_ago'
		amount = Math.floor(diff / HOUR)
	}else if(diff < WEEK){
		message = 'fuzzy_dates.days_ago'
		amount = Math.floor(diff / DAY)
	}else if(diff < MONTH){
		message = 'fuzzy_dates.weeks_ago'
		amount = Math.floor(diff / WEEK)
	}else if(diff < YEAR){
		message = 'fuzzy_dates.months_ago'
		amount = Math.floor(diff / MONTH)
	}

	if(message !== null){
		if(amount === 1) message = message + '_singular'
		return [message, [amount]]
	}else{
		return null
	}
}