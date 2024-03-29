<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchStatus } from '@/lib/api'
import { nextTick } from 'vue'
import { useInterfaceStore } from '@/stores/interface'
import { hasDisplayName } from '@/lib/utils'
import StatusSet from '@/components/StatusSet/StatusSet.vue'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.vue'


// Pull in stuff from the outside
const stores = {
	interface: useInterfaceStore()
}
const { t } = useI18n()

const props = defineProps({
	statusId: { type: String, default: '' }
})


// Values
var loaded = ref(false)
var statuses = ref([])
var focusedStatus = ref(null)


// Fetch statuses on mount
onMounted(() => {
	fetchStatus(props.statusId, true)
		.then(({ status, ancestors, descendants }) => {
			statuses.value = ancestors.concat([status]).concat(descendants)
			focusedStatus.value = status
			loaded.value = true

			let author_name = (hasDisplayName(focusedStatus.value.account)
				? focusedStatus.value.account.display_name.replace(/:[A-Za-z0-9_-]+:/gi, '')
				: `@${focusedStatus.value.account.acct}`)
			stores.interface.setPageTitle(t('statuses.status_page_title', [author_name]))

			return nextTick()
		})
		.then(() => {
			if(document.getElementsByClassName('status--highlighted').length > 0)
				document.getElementsByClassName('status--highlighted')[0].scrollIntoView({ behavior: 'smooth' })
		})
		.catch((e) => {
			loaded.value = true

			console.error(e)
			stores.interface.addToast({ type: 'error', content: e.message })
		})
})
</script>

<template>
	<div class="page-content page-content--feed">
		<main>
			<div
				v-if="!loaded"
				class="throbber-container"
			>
				<LoadingSpinner />
			</div>

			<StatusSet
				v-if="loaded && statuses.length > 0 && focusedStatus !== null"
				:highlight-id="focusedStatus.id"
				:statuses="statuses"
			/>
		</main>
	</div>
</template>

<style>

</style>
