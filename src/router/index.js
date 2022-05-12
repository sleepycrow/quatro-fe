import { createRouter, createWebHistory } from "vue-router"
import { pinia } from "@/stores"
import { useInterfaceStore } from "@/stores/interface"
import { useAuthStore } from "@/stores/auth"

import FeedsView from '@/views/FeedsView/FeedsView.vue'
import TagTimelineView from '@/views/TagTimelineView/TagTimelineView.vue'
import StatusView from '@/views/StatusView/StatusView.vue'
import DebugView from '@/views/DebugView/DebugView.vue'
import NotificationsView from '@/views/NotificationsView/NotificationsView.vue'
import BookmarksView from '@/views/BookmarksView/BookmarksView.vue'

const stores = {
	interface: useInterfaceStore(pinia),
	auth: useAuthStore(pinia)
}

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			name: 'root',
			path: '/',
			redirect: () => {
				return (stores.auth.loggedIn ? '/timelines/home' : '/debug')
			}
		},


		// ------ Timelines ------ \\
		{
			name: 'homeTimeline',
			path: '/timelines/home',
			component: FeedsView,
			props: { timeline: 'home' },
			meta: { authRequired: true }
		},
		{
			name: 'communityTimeline',
			path: '/timelines/community',
			component: FeedsView,
			props: { timeline: 'local' }
		},
		{
			name: 'globalTimeline',
			path: '/timelines/global',
			component: FeedsView,
			props: { timeline: 'public' }
		},
		{
			name: 'tagTimeline',
			path: '/tags/:tag',
			component: TagTimelineView,
			props: true
		},
		{
			name: 'bookmarksTimeline',
			path: '/bookmarks',
			component: BookmarksView,
			meta: { authRequired: true }
		},


		// ------ Profiles/users ------ \\
		{
			name: 'externalProfile',
			path: '/users/:test',
			component: DebugView,
			props: true
		},
		{
			name: 'localProfile',
			path: '/@:test',
			component: DebugView,
			props: true
		},
		{
			path: '/debug',
			component: DebugView
		},


		// ------ Idk ------ \\
		{
			name: 'status',
			path: '/statuses/:statusId',
			component: StatusView,
			props: true
		},

		{
			name: 'notifications',
			path: '/notifications',
			component: NotificationsView,
			meta: { authRequired: true }
		},
	]
})

router.beforeEach((to) => {
	if(to.meta.authRequired && !stores.auth.loggedIn)
		return '/'
})

router.afterEach(() => {
	// Reset the page title everytime we navigate.
	stores.interface.setPageTitle('')
})

export default router