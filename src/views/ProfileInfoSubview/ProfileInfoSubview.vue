<script setup>
import { useI18n } from 'vue-i18n'
import { htmlizeCustomEmoji } from '@/lib/utils'


// Pull in stuff from the outside
const { t } = useI18n()

const props = defineProps({
	acctInfo: { type: Object, default: null }
})
</script>

<template>
	<div class="page-content page-content--profile-info">
		<section class="card card--userinfo">
			<div
				class="card__content"
				v-html="htmlizeCustomEmoji(props.acctInfo.note, props.acctInfo.emojis)"
			/>

			<div
				v-for="(field, index) in props.acctInfo.fields"
				:key="index"
				class="card--userinfo__field"
			>
				<span class="label card__section-microheader" v-html="field.name" />
				<span class="value" v-html="field.value" />
			</div>
		</section>

		<section class="card card--userinfo-stats">
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
	</div>
</template>

<style>
.card--userinfo__field{
	padding: 12px 0 12px 16px;
	border-top: 1px solid #CCC;
}

.card--userinfo__field .value{
	display: block;
	font-size: 1rem;
	color: #000;
}

.card--userinfo-stats{
	display: block;
}

.card--userinfo-stats .profile-stat{
	border-left: none;
	border-top: 1px solid #CCC;
}

.card--userinfo-stats .profile-stat:nth-child(1){
	border-left: none;
	border-top: none;
}
 
@media screen and (min-width: 768px) {
	.card--userinfo-stats{
		display: flex;
	}

	.card--userinfo-stats .profile-stat{
		flex: 1 0 33.3%;
		border-left: 1px solid #CCC;
		border-top: none;
	}
}
</style>