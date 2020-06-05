<template>
	<v-dialog v-model="confirmModal" max-width="290">
		<v-card>
	        <v-card-title class="text-center"><b>WARNING</b></v-card-title>
	        <v-card-text>Are you sure?</v-card-text>
	        <v-card-actions>
	          <v-spacer></v-spacer>
	          <v-btn color="red darken-1" text @click="showConfirm(false)">Disagree</v-btn>
	          <v-btn color="green darken-1" text @click="agree">Agree</v-btn>
	        </v-card-actions>
      	</v-card>
	</v-dialog>
</template>

<script>
	import { mapState, mapActions } from 'vuex';
	export default {
		name: 'ConfirmDialog',

		data () {
			return {
			}
		},

		computed: {
			...mapState(['confirmModal']),
		},

		methods: {
			...mapActions(['showConfirm']),

			agree () {
				this.showConfirm(false)
				this.$emit('callback')
			}
		}
	}
</script>