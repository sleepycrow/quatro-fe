<script setup>
import { useAuthStore } from "@/stores/auth";
import { useInstanceStore } from "@/stores/instance"
import SidebarUserContent from "../SidebarUserContent/SidebarUserContent.vue";
import SidebarGuestContent from "../SidebarGuestContent/SidebarGuestContent.vue";
import { computed, ref } from "vue";
import { classString } from "../../lib/utils";

const stores = {
	auth: useAuthStore(),
	instance: useInstanceStore()
}


// Sidebar show/hide
var openSidebar = ref(false)

const sidebarClass = computed(() => classString(
	'sidebar',
	(stores.auth.loggedIn ? 'sidebar--user' : 'sidebar--guest'),
	(openSidebar.value ? 'sidebar--open' : null)
))
</script>

<template>
	<div class="open_sidebar_bg" :class="(openSidebar ? 'open_sidebar_bg--open' : '')" @click="openSidebar = false" />

	<div :class="sidebarClass">
		<SidebarUserContent v-if="stores.auth.loggedIn" />
		<SidebarGuestContent v-if="!stores.auth.loggedIn" />

		<!-------------- Footer -------------->
		<footer>
			<!-- TODO: make this take the user to an instance info page, like in the old misskey layout -->
			<img src="@/assets/logo.svg" :alt="stores.instance.nodeName" :title="stores.instance.nodeName">
		</footer>
	</div>

	<button class="open_sidebar_fab" @click="openSidebar = true">
		<span class="material-icons">menu</span>
	</button>
</template>

<style>
/* The sidebar itself
 ***********/
.sidebar{
	position: fixed;
	top: 0;
	left: calc(var(--sidebar-width) * -1.25); /* hide by default */
	z-index: 750;
	width: var(--sidebar-width);
	height: 100vh;

	display: grid;
	grid-template-rows: auto calc(var(--sidebar-logo-height) + 32px);
	overflow: hidden auto;

	background-color: #347FC4;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.75);
	transition: left 0.5s;

	color: #FFF;
}

.sidebar--open{
	left: 0;
}

@media screen and (min-width: 1280px) {
	.sidebar{
		left: 0;
	}
}

.sidebar footer{
	padding: 16px 0;
	text-align: center;
}

.sidebar footer img{
	height: var(--sidebar-logo-height);
	width: auto;
}

.sidebar__nav{
	display: block;
	width: 100%;

	padding: 0;
	list-style-type: none;
}

.sidebar__nav li{
	display: block;
}

.sidebar__nav .nav__link{
	display: block;
	cursor: pointer;
	text-decoration: none;
	width: 100%;
	color: #FFF;
	overflow: hidden;
	padding: 4px 0;
	margin: 0;
	background-color: transparent;
	transition: background-color 0.25s;
}

.sidebar__nav .nav__link:hover{
	background-color: rgba(255, 255, 255, 0.25);
}

.sidebar__nav .nav__link--active{
	background-color: transparent;
}

.sidebar__nav .nav__link--active .nav__icon{
	color: #FFF;
}

.sidebar__nav .nav__link--active .nav__label{
	font-weight: bold;
}

.sidebar__nav .nav__icon{
	text-align: center;
	width: 48px;
	line-height: 48px;
	color: #CCC;
}

.sidebar__nav .nav__label{
	font-weight: normal;
	line-height: 48px;
}

.sidebar__nav .nav__label-badge{
	color: #FFF;
	font-weight: bold;
	background-color: #C62828;
	padding: 6px 8px 2px 8px;
	border-radius: 1rem;
	margin: 0 0.25rem;
}

.sidebar .separator{
	width: 100%;
	padding: 0;
	margin: 4px 0;
	border-bottom: 1px solid #CCC;
}

/* The hamburger FAB & light-gray overlay in the background
 **********/
.open_sidebar_bg{
	display: none;

	position: fixed;
	top: 0;
	left: 0; /* hide by default */
	z-index: 700;
	width: 100vw;
	height: 100vh;

	background-color: rgba(0, 0, 0, 0.25);
}

.open_sidebar_bg--open{
	display: block;
}

.open_sidebar_fab{
	position: fixed;
	bottom: 16px;
	left: 16px;
	z-index: 710;
	width: 48px;
	height: 48px;
}

@media screen and (min-width: 1280px) {
	.open_sidebar_fab{
		display: none;
	}
}
</style>