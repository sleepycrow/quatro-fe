import { defineStore } from "pinia"
import { fetchInstanceInfo, fetchNodeInfo } from "@/lib/api"


export const useInstanceStore = defineStore('instance', {
	state: () => ({
		// NodeInfo/Instance
		nodeName: 'Quatro-FE',
		nodeDescription: 'Just another federated community.',

		openRegistrations: true,

		maxStatusLength: 5000
	}),

	actions: {
		async fetchInstanceInfo(){
			var info = await Promise.all([ fetchInstanceInfo(), fetchNodeInfo() ])
			var instanceInfo = info[0].data
			var nodeInfo = info[1].data

			this.nodeName = nodeInfo.metadata.nodeName
			this.nodeDescription = nodeInfo.metadata.nodeDescription
			this.openRegistrations = nodeInfo.metadata.openRegistrations
			this.maxStatusLength = instanceInfo.max_toot_chars

			return
		}
	}
})