<script setup>
import FeedHeader from '@/components/FeedHeader/FeedHeader.vue'
import Timeline from '@/components/Timeline/Timeline.vue'
import ProfileInfoSidebar from '@/components/ProfileInfoSidebar/ProfileInfoSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { getProfileUrl } from '@/lib/utils'


// Pull in stuff from the outside
const stores = {
	auth: useAuthStore()
}

const props = defineProps({
	acctInfo: { type: Object, default: null },
	timeline: { type: String, default: 'statuses' }
})


// All available timelines
const baseUrl = getProfileUrl(props.acctInfo)
const timelines = [
	{ id: 'user_statuses', target: `${baseUrl}/timelines/statuses` },
	{ id: 'user_statuses_and_replies', target: `${baseUrl}/timelines/statusesAndReplies` },
	{ id: 'user_media', target: `${baseUrl}/timelines/media` }
]
if(!props.acctInfo.pleroma.hide_favorites || (stores.auth.loggedIn && props.acctInfo.id === stores.auth.userInfo.id))
	timelines.push({ id: 'user_favourites', target: `${baseUrl}/timelines/favourites` })


// Set the appropriate timeline info & id
var tlInfo = {
	type: 'user',
	userId: props.acctInfo.id,
	params: {}
}
var tlId = 'statuses'

switch(props.timeline){
case 'statuses':
	tlId = 'user_statuses'

	tlInfo.type = 'user'
	tlInfo.params.exclude_replies = true
	break

case 'statusesAndReplies':
	tlId = 'user_statuses_and_replies'

	tlInfo.type = 'user'
	tlInfo.params.exclude_reblogs = true
	break

case 'media':
	tlId = 'user_media'

	tlInfo.type = 'user'
	tlInfo.params.exclude_reblogs = true
	tlInfo.params.only_media = true
	break

case 'favourites':
default:
	tlId = 'user_favourites'

	tlInfo.type = 'favourites'
	break
}
</script>

<template>
	<div class="page-content page-content--2col page-content--profile-feeds">
		<ProfileInfoSidebar :acct-info="props.acctInfo" />

		<main>
			<FeedHeader
				:timelines="timelines"
				:selected="tlId"
			/>

			<Timeline
				:store-id="tlId"
				:info="tlInfo"
			/>
		</main>
	</div>
</template>

<style>

</style>