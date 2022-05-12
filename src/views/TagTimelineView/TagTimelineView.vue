<script setup>
import { onMounted } from 'vue'
import FeedHeader from '@/components/FeedHeader/FeedHeader.vue'
import Timeline from '@/components/Timeline/Timeline.vue'
import { useInterfaceStore } from '../../stores/interface'


// Pull in stuff from the outside
const props = defineProps({
	tag: { type: String, default: '' }
})


// Page title
onMounted( () => useInterfaceStore().setPageTitle('#' + props.tag) )
</script>

<template>
	<div class="page-content page-content--feed">
		<FeedHeader>#{{ tag }}</FeedHeader>

		<Timeline
			store-id="tag"
			:info="{ type: 'tag', tag: props.tag }"
		/>
	</div>
</template>

<style>

</style>