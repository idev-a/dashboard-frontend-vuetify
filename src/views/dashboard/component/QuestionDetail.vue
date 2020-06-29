<template>
	<div
      class="px-4"
    >
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Question
          </div>
        </v-col>
        <v-col
          cols="auto"
	      class="display-2"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">
            	{{currentQuestion.question}} 
            	<v-chip :color="levelColor(risk)" dark>
		            <div class="subtitle-2">{{ risk }}</div>
          	  	</v-chip>
            </span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Answer
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{currentQuestion.answer}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Category
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{currentQuestion.category}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class="mb-0"
        >
          <div class="font-weight-medium">
            Description
          </div>
        </v-col>
        <v-col
          cols="auto"
          class="pt-0"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{currentQuestion.description}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
      >
        <v-col
          cols="auto"
          class=""
        >
          <div class="font-weight-medium">
            Notes
          </div>
        </v-col>
        <v-col
          cols="auto"
        >
          <!-- <v-card shaped outlined class="my-0 pa-2"> -->
            <span class="text--secondary">{{currentQuestion.notes}}</span>
          <!-- </v-card> -->
        </v-col>
      </v-row>
      <v-row
        align="center"
        class="mb-3"
      >
        <div
          class="d-flex flex-wrap"
        >
          <v-chip
            outlined
            class="ma-2"
            :color="currentQuestion.availability == 1 ? 'red accent-2' : 'grey accent-4'"
          >
            <v-avatar v-if="currentQuestion.availability == 1" left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            Availability
          </v-chip>
       
          <v-chip
            outlined
            class="ma-2"
            :color="currentQuestion.confidentiality == 1 ? 'red accent-2' : 'grey accent-4'"
          >
            <v-avatar v-if="currentQuestion.confidentiality == 1" left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            Confidentiality
          </v-chip>
       
          <v-chip
            outlined
            class="ma-2"
            :color="currentQuestion.integrity == 1 ? 'red accent-2' : 'grey accent-4'"
          >
            <v-avatar v-if="currentQuestion.integrity == 1" left>
              <v-icon>mdi-checkbox-marked-circle</v-icon>
            </v-avatar>
            Integrity
          </v-chip>
        </div>
      </v-row>
      <v-row
        align="center"
      >
        <div
          class="d-flex flex-wrap"
        >
          <v-chip
            v-if="currentQuestion['T1. Software Failures (code, configuration etc.)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Software Failures (code, configuration etc.)
          </v-chip>
          <v-chip
            v-if="currentQuestion['T2. Cloud Failures (Provider, VHardware, Capacity)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Cloud Failures (Provider, VHardware, Capacity)
          </v-chip>
        </v-col>
          <v-chip
            v-if="currentQuestion['T3. Legal Threats (failure to comply, bad contacts)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Legal Threats (failure to comply, bad contacts)
          </v-chip>
          <v-chip
            v-if="currentQuestion['T4. Social Engineering'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Social Engineering
          </v-chip>
          <v-chip
            v-if="currentQuestion['T5. External Unauthorized Access to Information Systems / Data'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            External Unauthorized Access to Information Systems / Data
          </v-chip>
          <v-chip
            v-if="currentQuestion['T6. Traffic Monitoring or Interception'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Traffic Monitoring or Interception
          </v-chip>
          <v-chip
            v-if="currentQuestion['T7.External Attacker Tampering with Data / Data Destruction'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            External Attacker Tampering with Data / Data Destruction
          </v-chip>
          <v-chip
            v-if="currentQuestion['T8. Repudiation of transactions and messages'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Repudiation of transactions and messages
          </v-chip>
          <v-chip
            v-if="currentQuestion['T9. Insider Abuse of Privilege'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Insider Abuse of Privilege
          </v-chip>
          <v-chip
            v-if="currentQuestion['T10. Third Party Liability (contractors, third processing)'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Third Party Liability (contractors, third processing)
          </v-chip>
          <v-chip
            v-if="currentQuestion['T11. Employee / User Mistakes'] == 1"
            outlined
            class="ma-2"
            color="secondary"
          >
            Employee / User Mistakes
          </v-chip>
        </div>
      </v-row>
    </div>
</template>

<script>
	import { levelColor } from '../../../util'
	export default {
		name: 'QuestionDetail',

		props: {
			currentQuestion: {
				type: Object
			}
		},

		computed: {
			risk () {
	      		let risk = 'Low'
	      		if (this.currentQuestion.high) {
	      			risk = 'High'
	      		}
	      		if (this.currentQuestion.medium) {
	      			risk = 'Medium'
	      		}
	      		if (this.currentQuestion.low) {
	      			risk = 'Low'
	      		}
	      		return risk
			},
		},

		methods: {
			levelColor
		}
	}
</script>