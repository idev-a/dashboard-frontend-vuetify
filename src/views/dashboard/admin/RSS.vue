<template>
	<v-container
	    id="query-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        RSS Board
		        <v-spacer></v-spacer>
		        <v-btn :loading="loading" :disabled="loading" @click="runQuery" color="success">Populate<v-icon  size="16" right dark>mdi-send</v-icon></v-btn>
	      	</v-card-title>
	    </v-card>
	    <v-row
	    	>
    		<v-col
				cols='12'
    		>
	    		<v-textarea
	                v-model="rss"
	                label="RSS Link" 
	                hint="Ctrl + Enter to populate rss"
	                rows="3"
	                outlined
	                @keyup.ctrl.13="keyDownOnRss"
	            />
	    	</v-col>
	    </v-row>
	</v-container>
</template>

<script>
	export default {
		name: 'RSS',

		data: () =>({
			loading: false,
	     	search: '',
		})
	}
</script>