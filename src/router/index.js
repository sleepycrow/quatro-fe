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
import ProfileView from '@/views/ProfileView/ProfileView.vue'
import ProfileFeedsSubview from '@/views/ProfileFeedsSubview/ProfileFeedsSubview.vue'
import ProfileInfoSubview from '@/views/ProfileInfoSubview/ProfileInfoSubview.vue'

const stores = {
	interface: useInterfaceStore(pinia),
	auth: useAuthStore(pinia)
}

const profileChildren = [
	{
		path: '',
		component: ProfileFeedsSubview,
		props: { timeline: 'statuses' }
	},
	{
		path: 'timelines',
		redirect: to => `${to.fullPath}/statuses`
	},
	{
		path: 'timelines/statuses',
		component: ProfileFeedsSubview,
		props: { timeline: 'statuses' }
	},
	{
		path: 'timelines/statusesAndReplies',
		component: ProfileFeedsSubview,
		props: { timeline: 'statusesAndReplies' }
	},
	{
		path: 'timelines/media',
		component: ProfileFeedsSubview,
		props: { timeline: 'media' }
	},
	{
		path: 'timelines/favourites',
		component: ProfileFeedsSubview,
		props: { timeline: 'favourites' }
	},
	{
		path: 'info',
		component: ProfileInfoSubview
	},
	{
		path: 'debug',
		component: DebugView
	}
]

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
			path: '/users/:acctId',
			component: ProfileView,
			props: true,
			children: profileChildren
		},
		{
			name: 'localProfile',
			path: '/@:acctId',
			component: ProfileView,
			props: true,
			children: profileChildren
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
	],

	scrollBehavior(to, from, savedPosition){
		if(savedPosition)
			return savedPosition
		else
			return { top: 0 }
	}
})

router.beforeEach((to) => {
	if(to.meta.authRequired && !stores.auth.loggedIn)
		return '/'
})

router.afterEach((to, from) => {
	// Reset the page title everytime we navigate.
	if(to.fullPath !== from.fullPath)
		stores.interface.setPageTitle('')
})

export default router