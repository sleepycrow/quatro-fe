<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { classString } from '../../lib/utils';
import { useInterfaceStore } from '@/stores/interface';

const stores = {
	interface: useInterfaceStore()
}
const { t } = useI18n()

const toasts = computed(() => stores.interface.toasts)
</script>

<template>
	<TransitionGroup name="toast" tag="div" class="toast-container">
		<div
			v-for="toast in toasts"
			:key="toast.id"
			:class="classString('toast', 'toast--'+toast.type)"
		>
			{{ ( toast.content_i18n ? t(toast.content_i18n) : toast.content ) }}
		</div>
	</TransitionGroup>
</template>

<style>
.toast-container{
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 9999;
	
	width: 100%;
	
	display: grid;
	grid-template-columns: 100%;
	gap: 0.5rem;
	padding: 0.5rem;
	pointer-events: none;
}

.toast{
	width: 100%;
	max-width: 600px;
	margin: 0 auto;
	pointer-events: auto;
	transform: none;
	opacity: 1;
	
	border-radius: 2px;
	box-shadow: 0 2px 4px #000;
	background-color: #323232;
	color: #FFF;
	padding: 1rem 1.25rem;
}

.toast--error{
	background-color: #C62828;
}

/* Vue Transition Classes */
.toast-enter-active,
.toast-leave-active{
	transition: transform 0.5s ease, opacity 0.5s ease;
}

.toast-enter-from,
.toast-leave-to{
	transform: translateY(100%);
	opacity: 0;
}
</style>