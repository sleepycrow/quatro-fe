<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'


// Pull in stuff from the outside
const stores = {
	auth: useAuthStore()
}
const router = useRouter()

const props = defineProps({
	test: { default: '' },
	acctInfo: { default: {} }
})


// Handlers
var elUsr = ref(null)
var elPwd = ref(null)

function onLogin(e){
	e.preventDefault()
	stores.auth.loginUser(elUsr.value.value, elPwd.value.value)
		.then(() => {
			router.push('/')
		})

	elUsr.value.value = ''
	elPwd.value.value = ''
}

function onLogout(e){
	e.preventDefault()
	stores.auth.logoutUser()
}
</script>

<template>
	<div class="page-content">
		<form v-if="!stores.auth.loggedIn" @submit="onLogin">
			<h3>Login</h3>

			<input ref="elUsr" type="text" placeholder="Username"><br>
			<input ref="elPwd" type="password" placeholder="Password"><br>
			<button>Log in</button>
		</form>

		<form v-if="stores.auth.loggedIn" @submit="onLogout">
			<h3>Logout</h3>

			<button>Log out</button>
		</form>

		<hr>

		<h3>Debug:</h3>
		<pre
			style="width: 100%; overflow: auto hidden;"
			v-html="(typeof props.test === 'object' ? JSON.stringify(props.test, undefined, '  ') : props.test)"
		/>

		<hr>

		<h3>Account:</h3>
		<pre
			style="width: 100%; overflow: auto hidden;"
			v-html="(typeof props.acctInfo === 'object' ? JSON.stringify(props.acctInfo, undefined, '  ') : props.acctInfo)"
		/>
	</div>
</template>

<style scoped>
form{
	border: 1px solid #000;
	padding: 8px;
	margin: 8px 0;
}

form input,
form button{
	margin: 4px 0;
}
</style>
