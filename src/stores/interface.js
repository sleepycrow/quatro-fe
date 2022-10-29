import { defineStore } from "pinia"


export const useInterfaceStore = defineStore('interface', {
	state: () => ({
		pageTitle: '',
		
		toasts: [],

		lastAccountBrowsed: null
	}),

	actions: {
		setPageTitle(title){
			this.pageTitle = (typeof title === 'string' ? title : '')
		},

		addToast(toast){
			// Create and add the toast notification
			toast = Object.assign({
				id: Symbol(),
				type: 'info',
				autodismiss: 5,
				content: undefined,
				content_i18n: undefined
			}, toast)

			this.toasts.push(toast)

			// If set to autodismiss, set a timer
			if(toast.autodismiss > 0)
				window.setTimeout(() => { this.dismissToast(toast.id) }, toast.autodismiss * 1000)

			return toast.id
		},

		dismissToast(toastId){
			this.toasts = this.toasts.filter((toast) => (toast.id !== toastId))
		},

		isLastAccountBrowsed(acctId){
			return (this.lastAccountBrowsed && (this.lastAccountBrowsed.id === acctId || this.lastAccountBrowsed.acct === acctId))
		},

		fetchLastAccountBrowsed(){
			return new Promise((resolve) => {
				resolve({ data: this.lastAccountBrowsed })
			})
		}
	}
})