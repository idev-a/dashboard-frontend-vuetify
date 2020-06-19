<template>
	<v-container
	    id="meraki-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	      tile
	      flat
	    >
	    	<v-card-title>
		        Security Q&A Board
		    </v-card-title>
		    <v-card-text>
		    	<v-tabs
			      class="mt-4 border"
			      background-color="success"
			      color="white"
			      light
			      centered
			      grow
			      flat
			      show-arrows
			    >
			      <v-tabs-slider class="blue darken-3"></v-tabs-slider>
					
			      <v-tab
			      	v-for="(data, key) in QAs"
			      	:key="data.key"
			      	:href="`#${data.key}`"
			      >
			        {{data.title}}
			      </v-tab>

			      <v-tab-item
			      	value="questions"
			      >
					<security-questions />
		  		  </v-tab-item>
		  		  <v-tab-item
			      	value="answers"
			      >
					<security-answers />
		  		  </v-tab-item>
		  		</v-tabs>
		    </v-card-text>
		</v-card>
	</v-container>
</template>

<script>
export default {
	name: 'QABoard',

	data () {
		return {
			QAs: [
				{
					key: 'questions',
					bgColor: 'success',
					title: 'Questions'
				},
				{
					key: 'answers',
					bgColor: 'orange accent-3',
					title: 'Answers'
				}
			],
		}
	},

	components: {
		SecurityQuestions: () => import('./SecurityQuestions'),
		SecurityAnswers: () => import('./SecurityAnswers')
	},
}
</script>