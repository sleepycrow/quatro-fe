import { defineStore } from "pinia"


export const useInterfaceStore = defineStore('interface', {
	state: () => ({
		pageTitle: ''
	}),

	actions: {
		setPageTitle(title){
			this.pageTitle = (typeof title === 'string' ? title : '')
		}
	}
})