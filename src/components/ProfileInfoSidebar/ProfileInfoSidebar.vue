<script setup>
import { useI18n } from 'vue-i18n';
import { htmlizeCustomEmoji } from '@/lib/utils'


// Pull in stuff from the outside
const { t } = useI18n();

const props = defineProps({
	acctInfo: { type: Object, default: null }
})
</script>

<template>
	<aside>
		<section class="card card--about">
			<div class="card__content" v-html="htmlizeCustomEmoji(props.acctInfo.note, props.acctInfo.emojis)" />

			<div
				v-for="(field, index) in props.acctInfo.fields"
				:key="index"
				class="card--about__field"
			>
				<span class="label" v-html="field.name" />
				<span class="value" v-html="field.value" />
			</div>
		</section>

		<section class="card card--mini-stats">
			<div v-if="!props.acctInfo.pleroma.hide_followers" class="profile-stat">
				<span class="number">{{ props.acctInfo.followers_count }}</span>
				<span class="label card__section-microheader">
					{{ t('profiles.follower_count_noun', parseInt(props.acctInfo.followers_count)) }}
				</span>
			</div>

			<div v-if="!props.acctInfo.pleroma.hide_follows" class="profile-stat">
				<span class="number">{{ props.acctInfo.following_count }}</span>
				<span class="label card__section-microheader">
					{{ t('profiles.follow_count_noun', parseInt(props.acctInfo.following_count)) }}
				</span>
			</div>

			<div class="profile-stat">
				<span class="number">{{ props.acctInfo.statuses_count }}</span>
				<span class="label card__section-microheader">
					{{ t('profiles.status_count_noun', parseInt(props.acctInfo.statuses_count)) }}
				</span>
			</div>
		</section>
	</aside>
</template>

<style>
/* description box */
.card--about__field{
	padding: 12px 0 12px 16px;
	border-top: 1px solid #CCC;
}

.card--about__field .value{
	display: block;
	font-size: 1rem;
	color: #000;
}

.card--about__field .label{
	display: block;
	font-size: 0.8rem;
	font-weight: bold;
	text-transform: uppercase;
	color: #333;
}

/* quick stats */
.card--mini-stats{
	display: none;
}

.card--mini-stats .profile-stat{
	border-top: 1px solid #CCC;
}

.card--mini-stats .profile-stat:nth-child(1){
	border-top: none;
}

@media screen and (min-width: 768px) {
	.card--mini-stats{
		display: block;
	}
}
</style>