import { defineStore } from "pinia"
import { oauthObtainToken, oauthRevokeToken, verifyCredentials } from "@/lib/api"


export const useAuthStore = defineStore('auth', {
	state: () => ({
		loggedIn: false,
		token: '',
		userInfo: {}
	}),

	actions: {
		async attemptTokenRecovery(){
			var token = window.localStorage.getItem('authToken')
			if(token !== null && token.length > 0){
				try{
					await this.verifyCredentials(token)
				}catch(e){
					window.localStorage.removeItem('authToken')
				}
			}
		},
	
		async verifyCredentials(token){
			try{
				var userInfo = await verifyCredentials(token)
	
				// If the token is valid, save it for later, then save everything into vuex and mark as logged in
				window.localStorage.setItem('authToken', token)
				this.token = token
				this.userInfo = userInfo.data
				this.loggedIn = true
			}catch(e){
				throw e
			}
		},

		async loginUser(username, password){
			try{
				var resp = await oauthObtainToken(username, password)
				this.verifyCredentials(resp.data.access_token)
			}catch(e){
				//FIXME: ADD A PROPER ERROR MESSAGE HERE
				window.alert('eror eror o cholercia')
				console.error(e.response.data)
			}
		},
	
		async logoutUser(){
			window.localStorage.removeItem('authToken')
			oauthRevokeToken(this.token) // we don't care too much if it succeeds or not
			this.$reset()
		}
	}
})