import { defineStore } from "pinia"
import { groupThreads } from '@/lib/timeline_utils'
import { isEqual, cloneDeep, assignIn } from 'lodash'
import { useStatusesStore } from "./statuses"


/**
 * okay, so, say that we click a status on the timeline, read through it's thread and
 * then decide to go back to the timeline. unless we back up the timeline somehow,
 * we'll have to load it again, and it's possible that by the time we're done the
 * status we just clicked will have been drowned in new statuses by then and we'll
 * have just lost our place.
 * 
 * holy fuck that's shit ux
 * 
 * to prevent this kinda stuff we need to back up our timelines somewhere. this is the
 * place. we'll keep the last known states for most recently accessed timelines by type.
 * 
 * if this is nonsense garbage blah blah just read source and it should make some sense!!
 */


// tlInfo describes a timeline, for fetching
function generateTlInfo(params = {}){
	return Object.assign({
		type: 'public',
		userId: null,
		hashtag: null,
		listId: null,
		params: {}
	}, cloneDeep(params))
}

// tlState describes a timeline's state -- the statuses we'd fetched, whether
// or not it's loading, etc...
function generateTlState(){
	return Object.assign({
		loading: false,
		staleBy: 0,
		statuses: [],
		grouped: [],
		next: {}, // The query params for the next page. These are obtained automatically from the HTTP "Link" header in API responses, not written by hand!
		prev: {} // As above.
	}, {})
}


export const useTimelinesStore = defineStore('timelines', {
	state: () => ({
		// Store the last known states for the timelines, for future reference
		info: {},
		state: {}
	}),

	actions: {

		prepareTimeline(tlId, info = null, forceReinit = false){
			var reinitNeeded = forceReinit

			// If a timeline by the given ID already exists, compare the params for
			// the two to see if we even need to (re)initialize anything.
			if(this.info.hasOwnProperty(tlId) && info !== null){
				var template = generateTlInfo(info)
				reinitNeeded = !isEqual(this.info[tlId], template)
			}else{
				reinitNeeded = true
			}

			// If the requested timeline isn't the same as the timeline that has been
			// saved, reinit.
			if(reinitNeeded){
				this.info[tlId] = generateTlInfo(info)
				this.state[tlId] = generateTlState()
			}
		},

		clearTimeline(tlId){
			assignIn(this.state[tlId], generateTlState()) // Just overwriting the object breaks reactivity, hence this.
		},

		addStatuses(tlId, statuses, mode = 'append'){
			if(!Array.isArray(statuses) || !this.state.hasOwnProperty(tlId)) // sanity check
				return false
			
			useStatusesStore().importStatuses(statuses)
			var statusIds = statuses.map(statuses => statuses.id)
			var groupedStatusIds = groupThreads(statuses)
			
			var tl = this.state[tlId]
			switch(mode){
			case 'prepend':
				tl.statuses = statusIds.concat(tl.statuses)
				tl.grouped = groupedStatusIds.concat(tl.grouped)
				break
				
			case 'append':
			default:
				tl.statuses = tl.statuses.concat(statusIds)
				tl.grouped = tl.grouped.concat(groupedStatusIds)
				break
			}
		},

	}
})