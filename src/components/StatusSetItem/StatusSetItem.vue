<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { htmlizeCustomEmoji, htmlSpecialChars, getProfileUrl, hasDisplayName, getAccountDisplayName } from '@/lib/utils'
import PreviewCard from '@/components/PreviewCard/PreviewCard.vue'
import FuzzyDate from '@/components/FuzzyDate/FuzzyDate.vue'
import MediaAttachmentGrid from '@/components/MediaAttachmentGrid/MediaAttachmentGrid.vue'
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu.vue'
import { useStatusesStore } from '@/stores/statuses'
import { useInterfaceStore } from '@/stores/interface'
import { classString } from '../../lib/utils'

// Pull in stuff from the outside
const stores = {
	statuses: useStatusesStore(),
	interface: useInterfaceStore()
}
const router = useRouter()
const { t } = useI18n()

const props = defineProps({
	status: { default: null },
	statusId: { default: null },
	isHighlighted: { type: Boolean, default: false }
})


// Get the status
var outerStatus = null, status = null

if(typeof props.statusId === 'string')
	outerStatus = reactive(stores.statuses.getStatus(props.statusId))
else if(typeof props.status === 'object' && props.status !== null)
	outerStatus = reactive(props.status)

status = (outerStatus !== null && outerStatus.reblog !== null)
	? reactive(stores.statuses.getStatus(outerStatus.reblog.id))
	: outerStatus


// Gather info about the status
var hasSpoiler = false, hasMediaAttachments = false, statusContent = '', spoilerText = ''
var rebloggerDisplayName = '', rebloggerProfileUrl = '', authorDisplayName = '', authorProfileUrl = ''

if(status !== null){
	hasSpoiler = (typeof status.spoiler_text === 'string' && status.spoiler_text.length > 0)
	hasMediaAttachments = (Array.isArray(status.media_attachments) && status.media_attachments.length > 0)
	statusContent = htmlizeCustomEmoji(status.content, status.emojis)
	spoilerText = htmlizeCustomEmoji(htmlSpecialChars(status.spoiler_text), status.emojis)

	rebloggerDisplayName = getAccountDisplayName(outerStatus.account)
	rebloggerProfileUrl = getProfileUrl(outerStatus.account)
	authorDisplayName = getAccountDisplayName(status.account)
	authorProfileUrl = getProfileUrl(status.account)
}


// Content hiding
var contentHidden = ref(hasSpoiler)
function toggleContentVisibility(){
	contentHidden.value = !contentHidden.value
}


// Visibility icon
var statusVisibilityIcon = computed(() => {
	if(status === null)
		return 'public'
	
	switch(status.visibility){
	case 'unlisted':
		return 'lock_open'
				
	case 'private':
		return 'lock'
				
	case 'direct':
		return 'mail'
	
	case 'public':
	default:
		return 'public'
	}
})


// Fix links
const elTextContent = ref()

function processLinks(){
	if(elTextContent.value === undefined){
		console.error("oh shit")
		return
	}

	var links = elTextContent.value.querySelectorAll('a')

	function _localizeMention(link){
		var subject = link.innerText
		subject = (subject.substr(0, 1) === '@' ? subject.slice(1) : subject)

		for(var mention of status.mentions){
			if(mention.acct === subject || mention.username === subject){
				var targetUrl = getProfileUrl(mention)

				link.innerHTML = `@${mention.acct}`
				link.title = mention.acct
				link.href = targetUrl

				link.addEventListener('click', onLocalizedLinkClick.bind(this, targetUrl), false)
			}
		}
	}

	function _localizeHashtag(link){
		var tag = link.textContent.slice(1)
		var targetUrl = `/tags/${tag}`

		link.href = targetUrl

		link.addEventListener('click', onLocalizedLinkClick.bind(this, targetUrl), false)
	}

	for(var link of links){
		if(link.classList.contains('mention'))
			_localizeMention(link)
		else if(link.textContent[0] === '#')
			_localizeHashtag(link)
		else
			link.target = '_blank'
	}
}

function onLocalizedLinkClick(targetUrl, e){
	if (e.button !== 0 || e.ctrlKey || e.metaKey) return

	e.preventDefault()
	router.push(targetUrl)
}

onMounted(() => processLinks())


// Status interaction
function interactWithStatus(interaction){
	var isUndoType = (interaction.substr(0, 2) === 'un')
	var interactionType = isUndoType ? interaction.substr(2) : interaction

	simulateInteractionEffect(interactionType, isUndoType)
	
	stores.statuses.interactWithStatus(status.id, interaction)
		.catch(_e => {
			stores.interface.addToast({ type: 'error', content_i18n: 'status_interaction_failed' })
			simulateInteractionEffect(interactionType, !isUndoType) // undo the simulation we did earlier
		})
}

function simulateInteractionEffect(interactionType, isUndoType){
	switch(interactionType){
	case 'favourite':
		status.favourited = !isUndoType
		status.favourites_count += isUndoType ? -1 : 1
		break
		
	case 'reblog':
		status.reblogged = !isUndoType
		status.reblogs_count += isUndoType ? -1 : 1
		break
		
	case 'bookmark':
		status.bookmarked = !isUndoType
		break
	}
}


// Emoji reactions
function toggleReaction(reactionName, shouldBeReacted){
	simulateReactionEffect(reactionName, shouldBeReacted)
	stores.statuses.toggleReaction(status.id, reactionName, shouldBeReacted)
		.catch(_e => {
			stores.interface.addToast({ type: 'error', content_i18n: 'status_interaction_failed' })
			simulateReactionEffect(reactionName, !shouldBeReacted) // undo the simulation we did earlier
		})
} 

function simulateReactionEffect(reactionName, shouldBeReacted){
	for(let reaction of status.pleroma.emoji_reactions){
		if(reaction.name === reactionName){
			reaction.count += (shouldBeReacted ? 1 : -1)
			reaction.me = !reaction.me
			return
		}
	}

	// if we haven't returned yet, then a reaction with the desired name doesn't exist yet. create it!
	if(shouldBeReacted)
		status.pleroma.emoji_reactions.push({name: reactionName, count: 1, me: true})
}

// Dropdown menu methods
// DEBUG: remove before release
function logActivityData(){
	console.log(Object.assign({}, outerStatus)) // copy the activity into a new object to avoid logging a Proxy object
	stores.interface.addToast({ content: 'hey debunger, we heard you liek status data so we logged the status data in your console. :>' })
}

async function copyLinkToStatus(){
	try{
		await navigator.clipboard.writeText(status.uri)
		stores.interface.addToast({ content_i18n: 'status_link_copied' })
	}catch(e){
		stores.interface.addToast({ type: 'error', content_i18n: 'status_link_copy_failed' })
	}
}
</script>

<template>
	<section
		v-if="status && !(outerStatus.deleted || status.deleted)"
		class="status"
		:class="(props.isHighlighted ? 'status--highlighted' : '')"
	>
		<!-------------- Repost Info -------------->
		<div v-if="outerStatus.reblog !== null" class="card__note">
			<span class="material-icons md-18">repeat</span>
			{{ t('statuses.reposted_by') }}
			<RouterLink
				class="card-note__username"
				:to="rebloggerProfileUrl"
			>
				<bdi v-html="rebloggerDisplayName" />
			</RouterLink>
		</div>

		<!-------------- The Actual Status -------------->
		<div class="card__content">
			<!-- Author Info -->
			<div class="status-meta">
				<RouterLink class="status-meta__avatar" :to="authorProfileUrl">
					<img :src="status.account.avatar" :alt="status.account.acct">
				</RouterLink>
			
				<div class="status-meta__info">
					<div class="status-meta__author">
						<RouterLink
							v-if="hasDisplayName(status.account)"
							:to="authorProfileUrl"
						>
							<span class="author__name">
								<bdi v-html="authorDisplayName" />
							</span>

							<span class="author__username">
								(@{{ status.account.acct }})
							</span>
						</RouterLink>

						<RouterLink
							v-else
							:to="authorProfileUrl"
						>
							<span class="author__username author__username--only">
								@{{ status.account.acct }}
							</span>
						</RouterLink>
					</div>

					<div class="status-meta__date">
						<FuzzyDate :datetime="status.created_at" :autoupdate="60" />
						•
						<i
							class="material-icons md-18 status__visibility-icon"
							:title="t('statuses.visibility_'+status.visibility)"
							v-html="statusVisibilityIcon"
						/>
					</div>
				</div>
			</div>

			<!-------------- Spoiler / Content Warning ---------------->
			<div v-if="hasSpoiler" class="card__spoiler">
				<div class="card__spoiler__text">
					<span class="card__spoiler__icon material-icons">warning</span>
					<span v-if="hasMediaAttachments" class="card__spoiler__icon material-icons">image</span>
					<span class="card__spoiler__text" v-html="spoilerText" />
				</div>
				<button class="btn btn--mini" @click="toggleContentVisibility">{{ contentHidden ? t('show') : t('hide') }}</button>
			</div>
			
			<!-- Status Content -->
			<div class="status-content" :class="(contentHidden ? 'status-content--hidden' : '')">
				<div ref="elTextContent" class="status-text" v-html="statusContent" />

				<MediaAttachmentGrid
					v-if="hasMediaAttachments"
					:attachments="status.media_attachments"
					:sensitive="status.sensitive"
				/>

				<!-- Preview Cards -->
				<PreviewCard v-if="status.card && !hasMediaAttachments" :card="status.card" />
			</div>
				
			<!-- Status Menu -->
			<DropdownMenu
				horiz-align="right"
				btn-icon="more_horiz"
				container-class="dropdown dropdown--right card__menu"
				btn-class="btn icon-btn"
			>
				<li>
					<a :href="status.url" target="_blank">
						<span class="dropdown__icon material-icons">language</span>
						External source
					</a>
				</li>

				<li>
					<a @click="copyLinkToStatus">
						<span class="dropdown__icon material-icons">link</span>
						Copy link to status
					</a>
				</li>

				<li>
					<a :href="status.url" target="_blank">
						<span class="dropdown__icon material-icons">flag</span>
						Report
					</a>
				</li>

				<li>
					<a @click="logActivityData">Log activity data</a>
				</li>
			</DropdownMenu>
		</div>

		<!-------------- Emoji Reactions -------------->
		<div v-if="status.pleroma.emoji_reactions.length > 0" class="card__chips">
			<template v-for="reaction in status.pleroma.emoji_reactions">
				<button
					v-if="reaction.count > 0"
					:class="classString('card__chip', (reaction.me && 'card__chip--active'))"
					@click="toggleReaction(reaction.name, !reaction.me)"
				>
					<span class="chip__icon chip__icon--emoji">{{ reaction.name }}</span>
					{{ reaction.count }}
				</button>
			</template>
		</div>
		
		<!-------------- Actions -------------->
		<div class="card__actions">
			<button class="card__action">
				<span class="material-icons">chat_bubble_outline</span>
				{{ status.replies_count }}
			</button>
			
			<button
				class="card__action"
				:class="( status.reblogged ? 'card__action--done' : '' )"
				@click="interactWithStatus(!status.reblogged ? 'reblog' : 'unreblog')"
			>
				<span class="material-icons">{{ status.reblogged ? 'repeat_on' : 'repeat' }}</span>
				{{ status.reblogs_count }}
			</button>
			
			<button
				class="card__action"
				:class="( status.favourited ? 'card__action--done' : '' )"
				@click="interactWithStatus(!status.favourited ? 'favourite' : 'unfavourite')"
			>
				<span class="material-icons">{{ status.favourited ? 'favorite' : 'favorite_border' }}</span>
				{{ status.favourites_count }}
			</button>

			<!-- PLACEHOLDER
				TODO: MAKE ME WORK -->
			<RouterLink class="card__action" :to="'/statuses/'+status.id">
				<span class="material-icons">insert_emoticon</span>
			</RouterLink>
			
			<button
				class="card__action"
				:class="( status.bookmarked ? 'card__action--done' : '' )"
				@click="interactWithStatus(!status.bookmarked ? 'bookmark' : 'unbookmark')"
			>
				<span class="material-icons">{{ status.bookmarked ? 'bookmark' : 'bookmark_border' }}</span>
			</button>

			<RouterLink class="card__action" :to="'/statuses/'+status.id">
				<span class="material-icons">arrow_forward</span>
			</RouterLink>
		</div>
	</section>
</template>

<style>
.status{
	padding: 0.1px 0 0.1px 0; /* holy fuck I hate css. this is here to stop collapsing margins within this element */
}

.status--highlighted{
	background-color: #EEE;
}

/* Post card elements */
.status-title{
	font-size: 1.5rem;
	font-weight: bold;
	margin: 16px 0;
}

.status-meta{
	width: calc(100% - var(--icon-button-size));
	max-width: calc(100% - var(--icon-button-size));
	display: flex;
	text-align: left;
	align-items: center;
	overflow: hidden;
}

.status-meta__avatar img{
	display: block;
	width: 48px;
	height: 48px;
	max-width: 48px;
	max-height: 48px;
	border-radius: 50%;
	flex-grow: 0;
	flex-shrink: 0;
	background-color: #CCC;
	overflow: hidden;
}

.status-meta__info{
	margin: 0 0 0 10px;
	flex-grow: 1;
	flex-shrink: 0;
	overflow: hidden;
}

.status-meta__info div{
	margin: 4px 0;
}

.status-meta a{
	color: inherit;
	text-decoration: none;
}

.status-meta a:hover{
	text-decoration: none;
}

.status-meta .author__name{
	font-weight: bold;
}

.status-meta .author__username{
	font-weight: normal;
}

.status-meta .author__username--only{
	font-weight: bold;
}

.status-meta__date{
	font-weight: normal;
	color: #333;
}

.status__visibility-icon{
	cursor: default;
}

.status-content--hidden{
	display: none;
}

.status--highlighted .status-text{
	font-size: 1.33rem;
}

.status-text{
	margin: 1rem 0 0 0;
	white-space: pre-wrap;
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: break-word;
}

.status-text .emoji{
	width: 32px;
	height: 32px;
}

.card__spoiler{
	text-align: center;
	margin: 8px 0;
}

.card__spoiler .card__spoiler__text{
	font-weight: bold;
	margin: 6px;
}

.card__spoiler .card__spoiler__icon{
	font-size: 1.5rem;
	margin: 6px;
}

.card-note__username{
	font-weight: bold;
	color: inherit;
}
</style>
