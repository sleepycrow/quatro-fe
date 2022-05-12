/**
 * Group threads in a timeline together.
 * Works only in reverse-chronological order, refactor if needed.
 * @param {Array} timeline -- an array of status objects 
 * @returns An array of status objects, possibly with a new property - ancestors (array or status objects)
 */
export function groupThreads(timeline, hideShown = true){
	var needed = []
	var found = {}
	var outputTimeline = []

	// Loop 1: Find replies to various posts in the timeline, grab the IDs of their parent posts for later
	for(let i = 0; i < timeline.length; i++){
		let post = timeline[i]

		if(typeof(post.in_reply_to_id) === "string" && post.in_reply_to_id.length !== "")
			needed.push(post.in_reply_to_id)
	}

	// Loop 2: Try to find the parent posts collected earlier
	for(let i = 0; i < timeline.length; i++){
		let post = timeline[i]

		if(needed.includes(post.id))
			found[post.id] = post
		
		if(post.reblog && needed.includes(post.reblog.id))
			found[post.reblog.id] = post
	}

	// Loop 3: Group posts with their parents
	for(let i = 0; i < timeline.length; i++){
		let ancestors = []
		let post = timeline[i]

		if(needed.includes(post.id) || (post.reblog && needed.includes(post.reblog.id)))
			continue

		/* eslint-disable  no-prototype-builtins */
		if(typeof(post.in_reply_to_id) === "string" && found.hasOwnProperty(post.in_reply_to_id)){
			let lastPost = post

			while(typeof(lastPost.in_reply_to_id) === "string" && found.hasOwnProperty(lastPost.in_reply_to_id)){
				lastPost = found[lastPost.in_reply_to_id]
				ancestors.splice(0, 0, lastPost)

				if(hideShown) delete found[lastPost.id]
			}
		}
		/* eslint-enable  no-prototype-builtins */

		let grouped = ancestors.map(status => status.id)
		grouped.push(post.id)
		outputTimeline.push(grouped)
	}

	return outputTimeline
}
