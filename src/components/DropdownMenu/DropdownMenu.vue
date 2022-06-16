<script setup>
import { onMounted, onUnmounted, ref } from 'vue'


// Pull in stuff from the outside
const props = defineProps({
	btnClass: { type: String, default: 'btn btn--transparent btn--dropdown' },
	btnText: { type: String, default: '' },
	btnIcon: { type: String, default: '' },
	showArrow: { type: Boolean, default: false },

	containerClass: { type: String, default: 'dropdown' },

	menuClass: { type: String, default: 'dropdown__content' },
	horizAlign: { type: String, default: 'left' }, 
	vertAlign: { type: String, default: 'down' } //dummy, doesn't do anything yet
})


// Toggle menu
const elContainer = ref(null)
var menuOpen = ref(false)

function onDocumentClick(e){
	if(elContainer.value.contains(e.target) && (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON'))
		return
			
	menuOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
	<div ref="elContainer" :class="props.containerClass">
		<button :class="props.btnClass" @click="menuOpen = !menuOpen">
			<span
				v-if="props.btnIcon.length > 0"
				class="material-icons"
				v-html="props.btnIcon"
			/>

			<span
				v-if="props.btnText.length > 0"
				v-text="props.btnText"
			/>
			
			<span v-if="showArrow" class="material-icons">arrow_drop_down</span>
		</button>


		<Transition name="dropdown">
			<ul v-if="menuOpen" ref="elContent" :class="props.menuClass">
				<slot />
			</ul>
		</Transition>
	</div>
</template>

<style>
.dropdown-enter-active,
.dropdown-leave-active{
	transition: opacity 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to{
	opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from{
	opacity: 1;
}
</style>