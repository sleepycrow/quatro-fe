import { defineStore } from "pinia"
import { assignIn, clone, some } from 'lodash'
import { interactWithStatus, toggleReactionToStatus } from "../lib/api"
import { useTimelinesStore } from "./timelines"
import { useAuthStore } from "./auth"


export const useStatusesStore = defineStore('statuses', {
	state: () => ({
		statuses: {}
	}),

	actions: {
		/* Status storage
		 ***********/
		importStatuses(statuses = []){
			statuses = clone(statuses)
			
			for(let status of statuses){
				if(typeof status !== 'object')
					continue
				
				status.deleted = false

				if(status.reblog != null && typeof status.reblog === 'object')
					statuses.push(status.reblog)
				
				if(this.statuses[status.id])
					assignIn(this.statuses[status.id], status)
				else
					this.statuses[status.id] = status
			}
		},

		getStatus(id = ''){
			if(!this.statuses.hasOwnProperty(id) || this.statuses[id].deleted)
				return null
			
			return this.statuses[id]
		},


		/* Status interaction
		 *************/

		async interactWithStatus(id = '', interactionType){
			try{
				console.log('attemting '+interactionType)
				let resp = await interactWithStatus(id, interactionType)
				console.log('successfully did '+interactionType+' interaction on status '+id, resp)

				if(this.statuses.hasOwnProperty(id))
					this.importStatuses([resp.data])
				
				if(interactionEffects.hasOwnProperty(interactionType))
					interactionEffects[interactionType].call(this, resp.data)
			}catch(e){
				console.error(e)
				throw e
			}
		},

		async toggleReaction(id = '', reactionName, shouldBeReacted){
			try{
				console.log('attemting to '+(shouldBeReacted ? 'react' : 'unreact')+' to '+id+' with '+reactionName)
				let resp = await toggleReactionToStatus(id, reactionName, shouldBeReacted)
				console.log('successfully did reaction thing', resp)

				if(this.statuses.hasOwnProperty(id))
					this.importStatuses([resp.data])
			}catch(e){
				console.error(e)
				throw e
			}
		}
	}
})


const interactionEffects = {
	unfavourite(status){
		/* TODO: once profiles are implemented, if the cached profile is ours
		 * and favourites are cached, remove the post from favourites
		 */
	},

	unreblog(status){
		// gather info about the user, so we can find reblogs belonging to us. ugly, I know.
		var userInfo = useAuthStore().userInfo
		if(!userInfo.hasOwnProperty('id'))
			return // we can't proceed if we don't have the current user's ID.
		
		// mark the reblog as deleted (if exists)
		for(let someStatusId in this.statuses){
			let someStatus = this.statuses[someStatusId]

			if(someStatus.reblog === null)
				continue
			
			if(someStatus.account.id === userInfo.id && someStatus.reblog.id === status.id){
				someStatus.deleted = true
				break // since each user only gets to reblog a status once, we can safely break here.
			}
		}
	},

	unbookmark(status){
		// remove from bookmarks
		// this is the worst
		useTimelinesStore().removeStatuses([ status.id ], [ 'bookmarks' ])
	}
}