import * as api from './api'
import { toRaw } from 'vue'


export default class TimelineFetcher {

	constructor(store, tlId, tlInfo){
		tlId = toRaw(tlId)
		tlInfo = toRaw(tlInfo)
		
		this.store = store
		
		this.store.prepareTimeline(tlId, tlInfo)

		// set up some shorthands, for ease of reading/writing
		this.tlId = tlId
		this.info = this.store.info[this.tlId]
		this.state = this.store.state[this.tlId]
	}

	get statuses(){
		return this.state.statuses
	}

	get grouped(){
		return this.state.grouped
	}

	async fetchStatuses(params = {}, config = {}){
		if(this.state.loading) console.error("no don't do that") //TODO: DO SOMETHING!!!

		this.state.loading = true

		// Populate the config with default values
		config = Object.assign({
			mode: 'append',
			setPrev: false,
			setNext: false
		}, config)

		var requestParams = Object.assign({}, this.info.params, params)
		var resp = await api.fetchTimeline(this.info, requestParams)
		if(resp.data.error) throw resp.data.error //TODO: Consider making a custom class for these kinds of errors???
		
		// add the posts to the store
		this.store.addStatuses(this.tlId, resp.data, config.mode)

		// if wanted, set the params for next and prev
		if(config.setNext && resp.links.next){
			delete resp.links.next.href
			this.state.next = resp.links.next
		}

		if(config.setPrev && resp.links.prev){
			delete resp.links.prev.href
			this.state.prev = resp.links.prev
		}

		this.state.loading = false
	}

	async fetchPrev(){
		return this.fetchStatuses(this.state.prev, { mode: 'prepend', setPrev: true })
			.then(() => {
				this.state.staleBy = 0
			})
	}

	async fetchNext(){
		return this.fetchStatuses(this.state.next, { setNext: true })
	}

	async checkForNewer(){
		var requestParams = Object.assign({}, this.state.prev)
		var resp = await api.fetchTimeline(this.info, requestParams)
		if(resp.data.error || !Array.isArray(resp.data)) throw resp.data.error //TODO: Consider making a custom class for these kinds of errors???

		if(resp.data.length > 0)
			this.state.staleBy = resp.data.length
		
		return resp.data.length
	}

	clearTimeline(){
		this.store.clearTimeline(this.tlId)
	}

}
