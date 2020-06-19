<template>
	<v-container
	    id="meraki-board"
	    fluid
	    tag="section"
  	>
	    <v-card
	      class="pa-5"
	    >
	    	<v-card-title>
		        Security Q&A Board
		    </v-card-title>
		    <v-card-text>
		    	<v-tabs
			      class="elevation-2 mt-4"
			      color="white"
			      light
			      centered
			      grow
			      show-arrows
			    >
			      <v-tabs-slider class="blue darken-3"></v-tabs-slider>
					
			      <v-tab
			      	v-for="(data, key) in QAs"
			      	:key="data.key"
			      	:href="`#${data.key}`"
			      	:class="data.bgColor"
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
					bgColor: '#2a9be7',
					title: 'Questions'
				},
				{
					key: 'answers',
					bgColor: '#2a9be7',
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