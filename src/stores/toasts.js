import { defineStore } from "pinia"


export const useToastsStore = defineStore('toasts', {
	state: () => ({
		toasts: []
	}),

	actions: {
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
		}
	}
})