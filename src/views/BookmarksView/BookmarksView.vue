<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import FeedHeader from '@/components/FeedHeader/FeedHeader.vue'
import Timeline from '@/components/Timeline/Timeline.vue'
import { useInterfaceStore } from '../../stores/interface'


// Pull in stuff from the outside
const { t } = useI18n()


// Page title
onMounted( () => useInterfaceStore().setPageTitle(t('menu.bookmarks')) )
</script>

<template>
	<div class="page-content page-content--feed">
		<FeedHeader>{{ t('menu.bookmarks') }}</FeedHeader>

		<Timeline
			store-id="bookmarks"
			:info="{ type: 'bookmarks' }"
		/>
	</div>
</template>

<style>

</style>