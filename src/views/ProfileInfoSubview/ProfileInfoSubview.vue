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

		<section class="card card--user-followers">
			<div class="card__content">
				<div class="card__section-microheader">{{ t('profiles.followers') }}</div>
			</div>
		</section>

		<section class="card card--user-follows">
			<div class="card__content">
				<div class="card__section-microheader">{{ t('profiles.follows') }}</div>
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
</style>