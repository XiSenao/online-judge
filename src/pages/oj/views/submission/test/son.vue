<template>
	<div>
		{{name}}
		<!-- {{msg}} -->
		{{daa}}
		<button @click="alert('go')">按钮1</button>
		<button @click="goFather">按钮2</button>
	</div>
</template>

<script>
export default {
	props: ['name', 'daa'],
	props: {
		name: {
			type: String,
			default: 'diyi'
		}
	},
	data () {
		return {

		}
	},
	methods: {
		goFather (data) {
			this.$emit('alert', '我们在')
			this.$emit('alert', '阳光灿烂一天出发')
		}
	}
}
</script>

<style>

</style>