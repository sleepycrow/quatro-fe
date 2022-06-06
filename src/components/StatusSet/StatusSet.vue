<script setup>
import { useI18n } from 'vue-i18n'
import { useStatusesStore } from '@/stores/statuses'
import StatusSetItem from '@/components/StatusSetItem/StatusSetItem.vue'

// Pull in stuff from the outside
const stores = {
	statuses: useStatusesStore()
}
const { t } = useI18n()

const props = defineProps({
	statusIds: { default: null },
	statuses: { default: null },
	highlightId: { type: String, default: '' }
})


// Get the right statuses
var statuses = []
if(Array.isArray(props.statusIds)){
	statuses = props.statusIds
		.map(id => stores.statuses.getStatus(id))
		.filter(val => (val !== null))
}else if(Array.isArray(props.statuses)){
	statuses = props.statuses
}

// Gather info about the statuses, for the future
const isThreadPart = (() => {
	if(statuses.length <= 0) // sanity check
		return false

	let topStatus = statuses[0]
	topStatus = topStatus.reblog !== null ? topStatus.reblog : topStatus
	return (typeof topStatus.in_reply_to_id === "string" && topStatus.in_reply_to_id !== "")
})()
</script>

<template>
	<article v-if="statuses.length > 0" class="card status-set">
		<div v-if="isThreadPart" class="card__note">
			<span class="material-icons-outlined md-18">library_books</span>
			{{ t('statuses.part_of_a_thread') }}
		</div>

		<StatusSetItem
			v-for="status in statuses"
			:key="status.id"
			:status="status"
			:is-highlighted="status.id == props.highlightId"
		/>
	</article>
</template>

<style>
.status-set{
	overflow: visible; /* So that the context menus work */
	margin: 1rem 0;
}

.status-set .status{
	border-bottom: 1px solid #999;
}

.status-set .status:last-child{
	border-bottom: none;
}
</style>
