<script setup>
import { computed, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue"
import BlankLayout from "@/layouts/BlankLayout/BlankLayout.vue"
import { useAuthStore } from "@/stores/auth"
import { useNotifsStore } from "@/stores/notifs"
import { useStatusesStore } from "@/stores/statuses"
import { useInterfaceStore } from "@/stores/interface"
import { useInstanceStore } from "@/stores/instance"
import { useTimelinesStore } from "@/stores/timelines"
import ToastNotifications from './components/ToastNotifications/ToastNotifications.vue'


// Get stuff from the outside
const route = useRoute()
const stores = {
	auth: useAuthStore(),
	statuses: useStatusesStore(),
	notifs: useNotifsStore(),
	interface: useInterfaceStore(),
	instance: useInstanceStore(),
	timelines: useTimelinesStore()
}


// Return the layout for the page
const layout = computed(() => (route.meta.layout || 'DefaultLayout'))


// Do stuff when login state changes
var notifInterval = null

async function onLoginStateChange(loggedIn){
	// Clear everything that might contain personalized data before we do anything
	stores.notifs.$reset()
	stores.statuses.$reset()
	stores.timelines.$reset()

	if(loggedIn){
		await stores.notifs.fetchNotifs()
		
		notifInterval = window.setInterval(attemptFetchNewNotifs, 10000)
	}else{
		if(notifInterval !== null)
			window.clearInterval(notifInterval)
		
		notifInterval = null
	}
}

watch(() => stores.auth.loggedIn, onLoginStateChange)
onLoginStateChange(stores.auth.loggedIn)

function attemptFetchNewNotifs(){
	stores.notifs.fetchPrevNotifs()
		.catch((e) => {
			if(e.response.status === 403){
				console.error('The user token seems to be invalid. Cancelling notification polling to save on bandwidth.')

				window.clearInterval(notifInterval)
				notifInterval = null
			}
		})
}


// Update document title whenever needed
function updateTitle(){
	let pageTitle = stores.interface.pageTitle
	let instanceName = stores.instance.nodeName
	document.title = pageTitle + (pageTitle.length > 0 ? ' • ' : '') + instanceName
}

watch(() => stores.interface.pageTitle, updateTitle)
watch(() => stores.instance.nodeName, updateTitle)
</script>

<template>
	<component :is="layout">
		<RouterView :key="route.fullPath" />
	</component>
	
	<ToastNotifications />
</template>

<script>
export default {
	components: { DefaultLayout, BlankLayout }
}
</script>

<style src="./assets/base.css"></style>
