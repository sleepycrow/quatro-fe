<script setup>
// TODO: this component should probably be removed, since it's function is now very minimal
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu.vue'


const { t } = useI18n()

const props = defineProps({
	timelines: { type: Array, required: false, default: ()=>([]) },
	selected: { type: String, default: '' }
})


// Dropdown stuff
var selectedTl = ref('')

const shouldHaveDropdown = (props.timelines.length > 0)
if(shouldHaveDropdown){
	let tlId = (props.selected.length > 0 ? props.selected : props.timelines[0].id)
	for(let tl of props.timelines){
		if(tl.id == tlId){
			selectedTl = tl
			break
		}
	}
}
</script>

<template>
	<header class="flex-header">
		<div class="flex-header__title">
			<!-- Feed Selector Dropdown -->
			<DropdownMenu
				v-if="shouldHaveDropdown"
				btn-class="flex-header__dropdown__title"
				:btn-text="t('timelines.'+selectedTl.id)"
				:show-arrow="true"
			>
				<li v-for="tl in timelines" :key="tl.id">
					<RouterLink :to="tl.target">
						{{ t('timelines.'+tl.id) }}
					</RouterLink>
				</li>
			</DropdownMenu>

			<!-- Normal header -->
			<h1 v-else>
				<slot />
			</h1>
		</div>

		<div class="flex-header__buttons">
			<button class="btn icon-btn">
				<span class="material-icons">tune</span>
			</button>
		</div>
	</header>
</template>