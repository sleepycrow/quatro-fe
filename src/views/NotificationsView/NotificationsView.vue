<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotifsStore } from '@/stores/notifs'
import NotificationCard from '@/components/NotificationCard/NotificationCard.vue'
import { useInterfaceStore } from '../../stores/interface'


// Pull in stuff from the outside
const stores = {
	notifs: useNotifsStore()
}
const { t } = useI18n()


const isLoading = computed(() => stores.notifs.loading)
const notifs = computed(() => stores.notifs.notifs)


// Page title
onMounted( () => useInterfaceStore().setPageTitle(t('menu.notifications')) )


// Functions to be used in the component
function fetchNext(){
	stores.notifs.fetchNextNotifs()
}

function markAllAsRead(){
	stores.notifs.markNotifsAsRead({ all: true })
}
</script>

<template>
	<div class="page-content page-content--notifications">
		<header class="flex-header">
			<div class="flex-header__title">
				<h1>{{ t('menu.notifications') }}</h1>
			</div>

			<div class="flex-header__buttons">
				<button
					class="btn icon-btn"
					:title="t('notifs.mark_all_as_read')"
					@click="markAllAsRead"
				>
					<span class="material-icons">done_all</span>
				</button>
			</div>
		</header>

		<NotificationCard
			v-for="notif in notifs"
			:key="notif.id"
			:notif="notif"
		/>

		<div v-if="notifs.length > 0" class="load-more-container">
			<button class="btn" :disabled="isLoading" @click="fetchNext()">
				{{ isLoading ? t('loading') : t('load_more') }}
			</button>
		</div>
	</div>
</template>

<style>

</style>