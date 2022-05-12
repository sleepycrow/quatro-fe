<script setup>
import { useI18n } from 'vue-i18n'
import { PAGE_SIZE } from '@/lib/api'
import StatusSet from '@/components/StatusSet/StatusSet.vue'
import TimelineFetcher from '@/lib/timeline_fetcher'
import { useTimelinesStore } from '@/stores/timelines'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.vue'
import { computed, onMounted, onUnmounted, watch } from 'vue'


// Pull in stuff from the outside
const stores = {
	timelines: useTimelinesStore()
}
const { t } = useI18n()

const props = defineProps({
	storeId: { type: String, required: true },
	info: { type: Object, required: true }
})


// Set up post fetcher
var fetcher = $ref(null)

function resetFetcher(){
	fetcher = new TimelineFetcher(stores.timelines, props.storeId, props.info)

	// if the cached timeline is empty, fetch some posts to populate it.
	// if it's not, check if there are newer posts than what we have
	if(fetcher.statuses.length <= 0)
		fetcher.fetchStatuses({}, { setNext: true, setPrev: true })
	else
		fetcher.checkForNewer()
}

watch(() => props.info, resetFetcher, { deep: true })
resetFetcher()

// Periodically check for new posts
var interval = null

onMounted(() => {
	interval = window.setInterval(() => fetcher.checkForNewer(), 60 * 1000)
})

onUnmounted(() => {
	if(interval !== null)
		window.clearInterval(interval)
})

// Handy helpers & shorthands :)
const isLoading = computed(() => fetcher.state.loading)
const isStale = computed(() => (fetcher.state.staleBy > 0))
const statuses = computed(() => fetcher.grouped)

function fetchPrev(){
	var promise

	// If we are behind by a lot, just clear the timeline and start anew instead
	if(fetcher.state.staleBy >= PAGE_SIZE){
		fetcher.clearTimeline()
		promise = fetcher.fetchStatuses({}, { setNext: true, setPrev: true })
	}else{
		promise = fetcher.fetchPrev()
	}
			
	promise
		.then(() => {
			window.scroll({ top: 0, behavior: 'smooth' })
			fetcher.checkForNewer()
		})
}

function fetchNext(){
	fetcher.fetchNext()
}

function getActivityKey(activity){
	return (Array.isArray(activity) ? activity[activity.length - 1] : activity)
}
</script>

<template>
	<div class="timeline">
		<div
			v-if="isLoading && statuses.length == 0"
			class="throbber-container"
		>
			<LoadingSpinner />
		</div>
		
		<div
			v-if="statuses.length > 0"
			class="page-content page-content--feed"
		>
			<div v-if="isStale" class="load-new-container">
				<button class="btn" :disabled="isLoading" @click="fetchPrev()">
					{{ isLoading ? t('loading') : t('load_new_statuses') }}
				</button>
			</div>

			<StatusSet
				v-for="status in statuses"
				:key="getActivityKey(status)"
				:status-ids="status"
			/>

			<div class="load-more-container">
				<button class="btn" :disabled="isLoading" @click="fetchNext()">
					{{ isLoading ? t('loading') : t('load_more') }}
				</button>
			</div>
		</div>
	</div>
</template>

<style>
.load-new-container{
	position: sticky;
	top: 8px;
	z-index: 10;
	text-align: center;
	pointer-events: none;
}

.load-new-container button{
	pointer-events: auto;
}

.load-more-container{
	text-align: center;
}
</style>
