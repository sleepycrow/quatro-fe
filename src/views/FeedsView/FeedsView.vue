<script setup>
import { onMounted } from 'vue'
import FeedHeader from '@/components/FeedHeader/FeedHeader.vue'
import Timeline from '@/components/Timeline/Timeline.vue'
import { useI18n } from 'vue-i18n'
import { useInterfaceStore } from '../../stores/interface'


// Pull in stuff from the outside
const { t } = useI18n()

const props = defineProps({
	timeline: { type: String, default: 'public' }
})


// All available timelines
const timelines = [
	{ id: 'home', target: '/timelines/home' },
	{ id: 'local', target: '/timelines/community' },
	{ id: 'public', target: '/timelines/global' }
]


// Set the appropriate timeline info & id
var tlInfo = {
	type: 'public',
	params: {}
}
var tlId = 'public'

switch(props.timeline){
case 'home':
	tlId = 'home'

	tlInfo.type = 'home'
	break

case 'local':
	tlId = 'local'

	tlInfo.type = 'public'
	tlInfo.params.local = true
	break

case 'public':
default:
	tlId = 'public'

	tlInfo.params.local = false
	tlInfo.type = 'public'
	break
}


// Page title
onMounted( () => useInterfaceStore().setPageTitle(t('timelines.'+tlId)) )
</script>

<template>
	<div class="page-content page-content--feed">
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