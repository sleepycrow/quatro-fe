<script setup>
import { onMounted, ref, computed, unref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, RouterLink } from "vue-router";
import { fetchAccount } from '@/lib/api'
import { hasDisplayName, getAccountDisplayName, getProfileUrl } from '@/lib/utils'
import { useInterfaceStore } from '@/stores/interface'
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.vue'


// Pull in stuff from the outside
const stores = {
	interface: useInterfaceStore()
}
const { t } = useI18n()
const route = useRoute()

const props = defineProps({
	acctId: { type: String, default: '' }
})


// Load profile
const loaded = ref(false)
const acctInfo = ref(null)

onMounted(() => {
	(stores.interface.isLastAccountBrowsed(props.acctId)
		? stores.interface.fetchLastAccountBrowsed()
		: fetchAccount(props.acctId))
		.then(info => {
			stores.interface.lastAccountBrowsed = info.data
			acctInfo.value = info.data
			loaded.value = true

			if(hasDisplayName(acctInfo.value)){
				let display_name = acctInfo.value.display_name.replace(/:[A-Za-z0-9_-]+:/gi, '')
				stores.interface.setPageTitle(`${display_name} (@${acctInfo.value.acct})`)
			}else{
				stores.interface.setPageTitle(`@${acctInfo.value.acct}`)
			}
		})
		.catch((e) => {
			loaded.value = true

			console.error(e)
			stores.interface.addToast({ type: 'error', content: e.message })
		})
})

// Shorthands & utils :>
const relativePath = route.fullPath.replace(/\/@[^/]+/, '').replace(/\/users\/[^/]+/, '')

const isOnTimelinePage = computed(() =>	(relativePath.includes('timelines') || relativePath.length <= 1))
const profileBaseUrl = computed(() => (loaded.value && acctInfo ? getProfileUrl( unref(acctInfo) ) : ''))
</script>

<template>
	<div
		v-if="!loaded"
		class="throbber-container"
	>
		<LoadingSpinner />
	</div>

	<header
		v-if="loaded && acctInfo"
		class="profile-banner"
		:style="`background-image: url('${acctInfo.header}');`"
	>
		<div class="profile-banner__backdrop" />

		<div class="profile-banner__content-wrapper">
			<div class="profile-header">
				<img
					class="profile-header__avatar"
					:src="acctInfo.avatar"
					:alt="acctInfo.acct" 
				>

				<div class="profile-header__info">
					<h1><bdi v-html="getAccountDisplayName(acctInfo)" /></h1>
					<h2 v-if="hasDisplayName(acctInfo)">
						@{{ acctInfo.acct }}
					</h2>
				</div>

				<div class="profile-header__controls">
					<button class="btn">
						{{ t('profiles.follow_btn') }}
					</button>

					<button class="btn">
						{{ t('profiles.message_btn') }}
					</button>
				</div>
			</div>

			<div class="tab-menu tab-menu--transparent tab-menu--centered">
				<RouterLink
					:to="`${profileBaseUrl}/timelines`"
					class="tab"
					:class="(isOnTimelinePage ? 'tab--active' : '')"
				>
					{{ t('profiles.timelines') }}
				</RouterLink>

				<RouterLink :to="`${profileBaseUrl}/info`" class="tab" active-class="tab--active">
					{{ t('profiles.information') }}
				</RouterLink>

				<RouterLink :to="`${profileBaseUrl}/debug`" class="tab" active-class="tab--active">
					Debug
				</RouterLink>
			</div>
		</div>
	</header>
	
	<RouterView
		v-if="loaded && acctInfo"
		:acct-info="acctInfo"
	/>
</template>

<style>
/* Profile header */
.profile-banner{
	position: relative;
	z-index: 0;

	width: 100%;
	height: 400px;
	
	background: #FFF url() no-repeat scroll center center;
	background-size: cover;
}

.profile-banner__backdrop{
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	
	height: 400px;
	width: 100%;
	
	background: linear-gradient(rgba(255, 255, 255, 0.3) 75%, #FFF);
}

.profile-banner__content-wrapper{
	position: absolute;
	bottom: 0;
	left: 0;
	z-index: 2;
	
	width: 100%;
	
	padding: 0 calc((100% - var(--inner-page-width--wide)) / 2);
	
	color: #000;
}

.profile-header{
	width: 100%;
	
	display: block;
	text-align: center;
}

@media screen and (min-width: 768px) {	
	.profile-header{
		text-align: left;
		display: flex;
		align-items: center;
	}
}

.profile-header__avatar,
.profile-header__info,
.profile-header__controls{
	margin: 0.5rem;
}

.profile-header .profile-header__avatar{
	width: 96px;
	height: 96px;
	border-radius: 50%;
	flex-grow: 0;
	flex-shrink: 0;
}

.profile-header .profile-header__info{
	flex-grow: 1;
}

.profile-header__info h1{
	font-size: 1.75rem;
	margin: 0.2rem 0;
	padding: 0;
}

.profile-header__info h1 .emoji{
	width: 1.75rem;
	height: 1.75rem;
}

.profile-header__info h2{
	font-size: 1rem;
	margin: 0.2rem 0;
	font-weight: normal;
}

.profile-header__controls{
	flex-shrink: 0;
	flex-grow: 0;
}

.profile-header__controls *{
	margin: 0.5rem;
}

.profile-banner .tab{
	color: #000;
}

.profile-banner .tab--active{
	color: var(--accent);
	border-bottom: 2px solid var(--accent);
}
</style>