<script setup>
import { useI18n } from "vue-i18n";
import { useInstanceStore } from "@/stores/instance"

const stores = {
	instance: useInstanceStore()
}
const { t } = useI18n()
</script>

<template>
	<!-------------- Navigation -------------->
	<div class="sidebar__content">
		<div class="sidebar__blurb">
			<header>{{ stores.instance.nodeName }}</header>
			<p>{{ stores.instance.nodeDescription }}</p>
		</div>

		<nav>
			<ul class="sidebar__nav">
				<li>
					<router-link class="nav__link" active-class="nav__link--active" to="/debug">
						<span class="nav__icon material-icons">login</span>
						<span class="nav__label">{{ t('menu.login') }}</span>
					</router-link>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style>
.sidebar--guest{
	grid-template-rows: auto calc(var(--sidebar-logo-height) + 32px);
}

.sidebar__blurb{
	margin: 8px;
}

.sidebar__blurb header{
	display: block;
	text-align: center;
	font-size: 1.5rem;
	font-weight: bold;
	margin: 1.5rem 0;
}
</style>
