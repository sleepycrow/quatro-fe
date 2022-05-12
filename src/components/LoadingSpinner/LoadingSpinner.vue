<!--
	Shamelessly stolen from mrrocks on codepen
	https://codepen.io/mrrocks/pen/ExLovj
-->

<template>
	<svg class="throbber" width="65px" height="65px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
		<circle class="throbber__path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30" />
	</svg>
</template>

<style>
	:root{
		--throbber-offset: 187;
		--throbber-duration: 1.4s;
	}

	.throbber {
		animation: rotator 1.4s linear infinite;
	}

	@keyframes rotator {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(270deg); }
	}

	.throbber__path {
		stroke: var(--accent);
		stroke-dasharray: var(--throbber-offset);
		stroke-dashoffset: 0;
		transform-origin: center;
		animation: dash var(--throbber-duration) ease-in-out infinite;
	}

	@keyframes dash {
		0% {
			stroke-dashoffset: var(--throbber-offset);
		}
		
		50% {
			stroke-dashoffset: calc(var(--throbber-offset) / 4);
			transform: rotate(135deg);
		}

		100% {
			stroke-dashoffset: var(--throbber-offset);
			transform: rotate(450deg);
		}
	}
</style>