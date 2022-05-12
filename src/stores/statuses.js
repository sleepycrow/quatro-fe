import { defineStore } from "pinia"
import { assignIn, clone } from 'lodash'
import { interactWithStatus } from "../lib/api"


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
				
				status.deleted = false // TODO: m,ake this do a th ing pls pls plsd pls pls pls pls

				if(status.reblog != null && typeof status.reblog === 'object'){
					statuses.push(status.reblog)
					status.reblog = status.reblog.id
				}
				
				if(this.statuses[status.id])
					assignIn(this.statuses[status.id], status)
				else
					this.statuses[status.id] = status
			}
		},

		getStatus(id = ''){
			if(!this.statuses.hasOwnProperty(id) || this.statuses[id].deleted)
				return null
			
			let status = this.statuses[id]

			if(typeof status.reblog === "string")
				status.reblog = this.getStatus(status.reblog)
			
			return status
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
			}catch(e){
				console.error(e)
				throw e
			}
		}
	}
})