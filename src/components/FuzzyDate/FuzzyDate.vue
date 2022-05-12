<script setup>
import { computed, onMounted, onUnmounted, watchEffect, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getDateText, getFuzzyDate } from '@/lib/time_utils'


// Pull in stuff from the outside
const props = defineProps({
	datetime: { type: String, required: true },
	autoupdate: { type: Number, required: false, default: -1 }
})
const { t } = useI18n()


// Normal date-time text
const dateText = computed(() => getDateText(props.datetime))


// Allow user to toggle between fuzzy and normal
var showFuzzy = ref(true)


// Fuzzy/friendly date
var fuzzyDate = ref('')

function updateFuzzyDate(){
	fuzzyDate.value = getFuzzyDate(props.datetime)
}
watchEffect(updateFuzzyDate)

// If less than two hours old, automatically update the fuzzy date
var interval = null

onMounted(() => {
	if(props.autoupdate > 0){
		let date = new Date(props.datetime)
		let now = new Date()

		if(now - date < 1000*60*60*2)
			interval = window.setInterval(updateFuzzyDate, props.autoupdate*1000)
	}
})

onUnmounted(() => {
	if(interval !== null)
		window.clearInterval(interval)
})
</script>

<template>
	<time class="fuzzy-date" :datetime="datetime" :title="dateText" @click="showFuzzy = !showFuzzy">
		{{ ( (fuzzyDate !== null && showFuzzy) ? t(...fuzzyDate) : dateText ) }}
	</time>
</template>

<style>
.fuzzy-date{
	cursor: pointer;
}
</style>