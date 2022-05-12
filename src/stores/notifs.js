import { defineStore } from "pinia"
import { pinia } from "."
import { fetchNotifications, markNotificationsAsRead } from "@/lib/api"
import { useStatusesStore } from "./statuses"


// The store itself
export const useNotifsStore = defineStore('notifs', {
	state: () => ({
		muted: false,
		loading: false,

		next: {},
		prev: {},

		notifs: [],
		unread: 0
	}),

	actions: {
		addNotifs(notifs, mode = 'append'){
			if(!Array.isArray(notifs))
				return false
			
			switch(mode){
			case 'prepend':
				this.notifs = notifs.concat(this.notifs)
				break
				
			case 'append':
			default:
				this.notifs = this.notifs.concat(notifs)
				break
			}
	
			this.unread = countUnreadNotifs(this.notifs)
		},

		async markNotifsAsRead(args){
			if(this.notifs.length <= 0)
				return true
			
			try{
				// Mark notifs as read on client side
				for(var notif of this.notifs){
					if(args.all || (args.id && args.id === notif.id))
						notif.pleroma.is_seen = true
				}

				this.unread = countUnreadNotifs(this.notifs)
				
				// Mark notifs as read server-side
				var reqParams = {}
			
				if(args.all)
					reqParams.max_id = this.notifs[0].id
				else if(args.id)
					reqParams.id = args.id
				
				await markNotificationsAsRead(reqParams)
			}catch(e){
				console.error(e)
				window.alert('an eror okurded while dismising notificejszym') // TODO: replace me with something else when toasts are implemented
			}
		},

		async fetchNotifs(params = {}, config = {}){
			if(this.loading){
				console.error('A notification fetch was requested while one was already in progress! Ignoring.')
				return
			}
	
			this.loading = true

			config = Object.assign({
				mode: 'prepend',
				setPrev: true,
				setNext: true
			}, config)
	
			var resp = await fetchNotifications(params)

			if(resp.data.error){
				this.loading = false
				throw resp.data.error //TODO: Consider making a custom class for these kinds of errors???
			}
	
			if(resp.data.length > 0){
				// prepare the notifications
				resp.data.forEach(prepareNotif)
			
				// add the statuses to the store
				this.addNotifs(resp.data, config.mode)
	
				// if wanted, set the params for next and prev
				if(config.setNext && resp.links.next){
					delete resp.links.next.href
					this.next = resp.links.next
				}

				if(config.setPrev && resp.links.prev){
					delete resp.links.prev.href
					this.prev = resp.links.prev
				}
			}
	
			this.loading = false
		},

		async fetchNextNotifs(){
			return this.fetchNotifs(
				this.next,
				{ mode: 'append', setNext: true, setPrev: false }
			)
		},

		async fetchPrevNotifs(){
			return this.fetchNotifs(
				this.prev,
				{ mode: 'prepend', setNext: false, setPrev: true }
			)
		}
	}
})


// Utilities
function countUnreadNotifs(notifs){
	return notifs.reduce((acc, notif) => (notif.pleroma.is_seen ? acc : ++acc), 0)
}

function prepareNotif(notif){
	// if a notif has a status attached to it, import it to where we store all peristent statuses
	if(typeof notif.status === 'object'){
		useStatusesStore(pinia).importStatuses([notif.status])
		notif.status = notif.status.id
	}
}