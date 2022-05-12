<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getAccountDisplayName, getProfileUrl } from '@/lib/utils'
import { useNotifsStore } from '@/stores/notifs'
import FuzzyDate from '@/components/FuzzyDate/FuzzyDate.vue'
import StatusSetItem from '@/components/StatusSetItem/StatusSetItem.vue'


// Pull in stuff from the outside
const stores = {
	notifs: useNotifsStore()
}
const { t } = useI18n()

const props = defineProps({
	notif: { type: Object, required: true }
})


// Prepare stuff
const notifAcctDisplayName = computed(() => getAccountDisplayName(props.notif.account))
const notifAcctProfileUrl = computed(() => getProfileUrl(props.notif.account))

function markAsRead(){
	stores.notifs.markNotifsAsRead({ id: props.notif.id })
}
</script>

<template>
	<div class="card notif" :class="(!props.notif.pleroma.is_seen ? 'notif--unseen' : '')">
		<section class="card__content notif__info">
			<p>
				<RouterLink
					v-if="props.notif.type !== 'poll'"
					:to="notifAcctProfileUrl"
				>
					<bdi v-html="notifAcctDisplayName" />
				</RouterLink>

				{{ t(`notifs.${props.notif.type}`, { emoji: props.notif.emoji }) }}

				<span class="notif__info__time">
					(<FuzzyDate :datetime="props.notif.created_at" :autoupdate="60" />)
				</span>
			</p>

			<div class="card__menu">
				<button
					v-if="!props.notif.pleroma.is_seen"
					class="btn icon-btn"
					:title="t('notifs.mark_as_read')"
					@click="markAsRead"
				>
					<span class="material-icons">done</span>
				</button>
			</div>
		</section>

		<StatusSetItem
			v-if="props.notif.status"
			:key="props.notif.status"
			:status-id="props.notif.status"
		/>
	</div>
</template>

<style>
.notif{
	overflow: visible;
	padding: 0.1px 0 0.1px 0;
}

.notif--unseen{
	background-color: #EEE;
}

.notif__info p{
	width: calc(100% - var(--icon-button-size));
	line-height: var(--icon-button-size);
	vertical-align: middle;
}

.notif--unseen .notif__info p{
	font-weight: bold;
}

.notif__info__time{
	color: #333;
	font-weight: normal !important;
}

.notif .status{
	border-top: 1px solid #999;
}
</style>
